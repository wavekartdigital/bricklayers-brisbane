#!/usr/bin/env bash
# Install or update the Bricklayers Brisbane site on Ubuntu 24.04 (nginx + PHP-FPM). Safe to run again.
#   As root on the server:
#     curl -fsSL https://raw.githubusercontent.com/wavekartdigital/bricklayers-brisbane/main/deploy/setup.sh | bash
# Keeps api/config.php and api/storage/ (leads, uploads) across updates.
set -euo pipefail
export DEBIAN_FRONTEND=noninteractive
REPO=https://github.com/wavekartdigital/bricklayers-brisbane.git
SRC=/opt/bricklayers-brisbane
WEB=/var/www/bricklayers
DOMAIN=bricklayersbrisbane.com.au

[ "$(id -u)" = 0 ] || { echo "Please run as root."; exit 1; }

echo "==> Packages"
apt-get update -y
apt-get install -y git curl rsync nginx php-fpm php-curl php-mbstring ufw certbot python3-certbot-nginx
if ! command -v node >/dev/null || [ "$(node -p 'process.versions.node.split(".")[0]')" -lt 18 ]; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y nodejs
fi

echo "==> Code"
if [ -d "$SRC/.git" ]; then
  git -C "$SRC" fetch -q
  git -C "$SRC" reset -q --hard origin/main
else
  git clone -q "$REPO" "$SRC"
fi
cd "$SRC"
# Netlify Forms don't exist here: use the PHP form handler (see README).
sed -i "s/formProvider: 'netlify'/formProvider: 'php'/" src/data.js
node build.js

echo "==> Publish"
mkdir -p "$WEB"
rsync -a --delete --exclude 'api/config.php' --exclude 'api/storage/' site/ "$WEB/"
[ -f "$WEB/api/config.php" ] || cp "$WEB/api/config.example.php" "$WEB/api/config.php"
mkdir -p "$WEB/api/storage"
chown -R www-data:www-data "$WEB/api/storage"
chown root:www-data "$WEB/api/config.php"
chmod 640 "$WEB/api/config.php"

PHPSOCK=$(ls /run/php/php[0-9]*-fpm.sock | head -1)
cat > /etc/nginx/sites-available/bricklayers <<EOF
server {
    listen 80 default_server;
    server_name $DOMAIN www.$DOMAIN;
    root $WEB;
    index index.html;
    client_max_body_size 25m;

    # Same rules as site/api/.htaccess
    location ^~ /api/storage/ { return 403; }
    location ~ ^/api/(config\.php|.*\.(json|csv|log))$ { return 403; }
    location ~ ^/api/.+\.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:$PHPSOCK;
    }
    location /assets/ { expires 7d; }
    location / { try_files \$uri \$uri/ \$uri.html =404; }
    error_page 404 /404.html;
}
EOF
ln -sf /etc/nginx/sites-available/bricklayers /etc/nginx/sites-enabled/bricklayers
rm -f /etc/nginx/sites-enabled/default
sed -i 's/^upload_max_filesize.*/upload_max_filesize = 10M/; s/^post_max_size.*/post_max_size = 25M/' /etc/php/*/fpm/php.ini
systemctl restart "$(basename "$PHPSOCK" .sock)"
nginx -t
systemctl reload nginx

ufw allow OpenSSH >/dev/null
ufw allow 'Nginx Full' >/dev/null
ufw --force enable >/dev/null

# The nginx config above is plain HTTP, so put the certificate back on every run.
if [ -d "/etc/letsencrypt/live/$DOMAIN" ]; then
  echo "==> SSL"
  certbot install --nginx --cert-name "$DOMAIN" --redirect --non-interactive
  echo "Done: https://$DOMAIN"
else
  echo "Done: http://$(curl -s https://api.ipify.org)"
  echo "No SSL yet. Once the domain points here, accept the Let's Encrypt terms and run:"
  echo "  certbot --nginx -d $DOMAIN -d www.$DOMAIN --redirect -m YOUR_EMAIL --agree-tos"
fi

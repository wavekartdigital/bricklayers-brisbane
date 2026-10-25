// ─────────────────────────────────────────────────────────────
// All business content lives here. Edit this file, then run `node build.js`.
// Values wrapped in [square brackets] are placeholders: they render with an
// amber highlight on the site so they're easy to spot and replace.
// ─────────────────────────────────────────────────────────────
const photos = require('./photos.json');
const UPLOADS = 'https://bricklayersbrisbane.com.au/wp-content/uploads/';
// Photos are hot-linked from the current WordPress site for now.
// Before launch: download, convert to WebP and self-host under /assets/img/.
const img = (i) => UPLOADS + photos[i];

const site = {
  name: 'Bricklayers Brisbane',
  legalName: 'Bricklayers Brisbane Pty Ltd',
  url: 'https://bricklayersbrisbane.com.au',
  phone: '0431 138 393',
  phoneIntl: '+61431138393',
  whatsapp: '61431138393',
  email: 'info@bricklayersbrisbane.com.au',
  street: '9 Burkett Crescent',
  suburb: 'Victoria Point',
  state: 'QLD',
  postcode: '4165',
  geo: { lat: -27.5856, lng: 153.2958 },
  years: '30+',
  qbcc: '[QBCC Lic. No.]',
  abn: '22 687 173 128',
  acn: '687 173 128',
  projects: '[X]+',
  rating: '[4.9]',
  reviewCount: '[X]',
  hours: [
    ['Mon – Fri', '[6:30am – 4:30pm]'],
    ['Saturday', '[By appointment]'],
    ['Sunday', 'Closed'],
  ],
  googleProfile: '[Google Business Profile link]',
  googleReviewUrl: '[Google "leave a review" link]',
  facebook: 'https://www.facebook.com/bricklayersbrisbane',
  instagram: '', // add when the account is live
  // Integrations: leave blank to disable. See README.md.
  gaId: '',                    // e.g. G-ABC123XYZ
  searchConsole: '',           // google-site-verification content value
  mapsKey: '',                 // browser key with Places API → enables address autocomplete
  recaptchaSiteKey: '',        // reCAPTCHA v3 site key (honeypot + time-trap always on)
  // 'netlify' = Netlify Forms (hosting on Netlify). 'php' = api/quote.php (any PHP host).
  formProvider: 'netlify',
  formEndpoint: '/api/quote.php',
  reviewsEndpoint: '/api/reviews.php',
};

const services = [
  {
    slug: 'retaining-feature-walls',
    name: 'Entrance, Retaining & Feature Walls',
    short: 'Engineered retaining walls, statement entrance walls and feature walls that lift the whole property.',
    icon: 'wall',
    cats: ['retaining', 'feature'],
    hero: 31,
    headline: 'Retaining, Entrance & Feature Walls in Brisbane',
    metaTitle: 'Retaining Walls Brisbane | Entrance & Feature Walls | Bricklayers Brisbane',
    metaDesc: 'Engineered block retaining walls, rendered entrance walls and feature walls across Brisbane, Redlands and Logan. Licensed & insured. Free quotes.',
    intro: 'Sloping blocks, tired street frontages and plain backyards are what we fix. We build retaining walls that hold, entrance walls that welcome, and feature walls people notice, all built to Brisbane soil and council requirements.',
    includes: [
      'Engineered block retaining walls (core-filled & reinforced)',
      'Drainage, ag-pipe and gravel backfill done properly',
      'Rendered entrance walls, piers and letterbox pillars',
      'Integrated lighting, house numbers and gate posts',
      'Poolside and garden feature walls',
      'Brick matching to suit existing homes',
    ],
    problems: [
      ['Unusable sloping yard', 'Tiered walls create flat, usable lawn and entertaining space.'],
      ['Soil erosion & runoff', 'Correct drainage behind the wall stops washouts after Brisbane storms.'],
      ['Leaning or failing walls', 'We remove and rebuild old sleeper or block walls before they collapse.'],
      ['Bland street appeal', 'A rendered entrance wall adds instant kerb appeal and value.'],
    ],
    faqs: [
      ['Do I need council approval for a retaining wall?', 'In Queensland, retaining walls over 1 metre high, or walls within 1.5 metres of a building or another retaining wall, generally need building approval and engineer certification. We\'ll tell you what your wall needs at the free site visit.'],
      ['What is the best material for a retaining wall in Brisbane?', 'Core-filled concrete block is our go-to for strength and lifespan, especially on reactive clay soils. Rendered block, brick and stone-look finishes are all available.'],
      ['How long does a retaining wall take?', 'Most residential walls take between a few days and two weeks, depending on length, height, access and weather.'],
      ['Can you match my existing brickwork?', 'Usually, yes. We source matching or complementary bricks and mortar colours so new work blends in.'],
    ],
  },
  {
    slug: 're-pointing',
    name: 'Re-Point Repair',
    short: 'Rake out and replace crumbling mortar to stop moisture, restore strength and refresh the look of brickwork.',
    icon: 'trowel',
    cats: ['repointing'],
    hero: 128,
    headline: 'Brick Repointing & Mortar Repair in Brisbane',
    metaTitle: 'Brick Repointing Brisbane | Mortar Repair | Bricklayers Brisbane',
    metaDesc: 'Professional brick repointing across Brisbane. We replace cracked, crumbling mortar to stop water damage and restore your brickwork. Free quotes.',
    intro: 'Mortar wears out long before bricks do. Repointing replaces failed joints so water stays out, bricks stay put, and your walls look sharp again, on heritage and modern homes alike.',
    includes: [
      'Inspection of mortar joints, bricks and damp issues',
      'Careful raking out of failed mortar',
      'Colour-matched mortar mixes (incl. lime mortar for older homes)',
      'Joint profiles matched to the original (struck, ironed, raked)',
      'Replacement of cracked or spalled bricks',
      'Clean-down and wash on completion',
    ],
    problems: [
      ['Crumbling or sandy mortar', 'Soft joints that rub away with a finger are failing and let water in.'],
      ['Damp patches inside', 'Open joints are a common path for moisture into wall cavities.'],
      ['Loose bricks', 'Re-bedding and repointing restores the strength of the wall.'],
      ['Tired, patchy look', 'Fresh, consistent joints make old brickwork look new again.'],
    ],
    faqs: [
      ['What are the signs my brickwork needs repointing?', 'Mortar that\'s cracked, recessed, crumbling or missing; loose bricks; plant growth in joints; or damp patches on the inside of the wall.'],
      ['How long does repointing last?', 'Done properly with the right mortar, repointing typically lasts decades.'],
      ['Can you match old mortar colour?', 'Yes. We trial mortar mixes and colours on site to match the existing joints as closely as possible.'],
      ['Is repointing messy?', 'Raking out creates dust, so we protect windows, paths and gardens and clean up fully at the end of each day.'],
    ],
  },
  {
    slug: 'existing-work-pavers',
    name: 'Existing Work & Pavers',
    short: 'Repairs, extensions and paving that blend seamlessly with what\'s already there.',
    icon: 'pavers',
    cats: ['pavers'],
    hero: 20,
    headline: 'Paving, Steps & Repairs to Existing Brickwork',
    metaTitle: 'Pavers & Brick Repairs Brisbane | Bricklayers Brisbane',
    metaDesc: 'Paving, steps, landings and repairs to existing brick and block work across Brisbane. Seamless, colour-matched results. Free quotes.',
    intro: 'Got existing brick, block or paving that needs extending, repairing or levelling? We work with what\'s already there so new and old sit together like they were always one job.',
    includes: [
      'Paved paths, patios, driveways and pool surrounds',
      'Lifting and re-laying sunken or uneven pavers',
      'Brick and tiled steps, landings and entries',
      'Extensions to existing walls and planter boxes',
      'Colour and pattern matching',
      'Edge restraints and sub-base preparation',
    ],
    problems: [
      ['Trip hazards', 'Lifted, sunken or cracked pavers re-laid on a proper base.'],
      ['Mismatched additions', 'New work matched to existing bricks, pavers and joints.'],
      ['Water pooling', 'Correct falls so water runs away from the house.'],
      ['Dated entries', 'New steps and landings give the front of the home a lift.'],
    ],
    faqs: [
      ['Can you re-use my existing pavers?', 'Often, yes. Sound pavers can be lifted, cleaned and re-laid on a new base, with replacements matched for any broken ones.'],
      ['Why are my pavers sinking?', 'Usually poor base preparation or water getting underneath. We dig out, compact a new base and fix the drainage cause.'],
      ['Do you build steps?', 'Yes. Brick, block and tiled steps and landings, built to safe rise and going dimensions.'],
    ],
  },
  {
    slug: 'wall-removal-repair',
    name: 'Walls Removed, Replaced or Just Made Safe',
    short: 'Storm, impact or age damage. We remove, rebuild or stabilise walls safely, including insurance work.',
    icon: 'shield',
    cats: ['removal'],
    hero: 80,
    headline: 'Wall Removal, Replacement & Make-Safe Brickwork',
    metaTitle: 'Brick Wall Removal & Repair Brisbane | Insurance Work | Bricklayers Brisbane',
    metaDesc: 'Damaged, cracked or unsafe brick walls removed, rebuilt or made safe across Brisbane. Insurance repairs, garage and window openings. Free quotes.',
    intro: 'When a wall is cracked, leaning, storm-damaged or simply in the way, we make it safe fast and rebuild it properly. We also handle insurance work, new openings and structural modifications.',
    includes: [
      'Make-safe of damaged or unstable walls',
      'Demolition and removal of brick & block walls',
      'Rebuilds matched to existing brickwork',
      'New or widened openings for doors, windows and garages',
      'Insurance repair work with photos and reports',
      'Coordination with engineers where required',
    ],
    problems: [
      ['Storm or vehicle damage', 'Quick make-safe, then a full rebuild that matches the original.'],
      ['Cracked walls', 'Assessed, removed and rebuilt with the cause addressed.'],
      ['Garage or window changes', 'Openings cut, lintels installed and brickwork made good.'],
      ['Insurance claims', 'Clear quotes and documentation for your insurer.'],
    ],
    faqs: [
      ['Do you do insurance work?', 'Yes. We quote and complete storm, impact and structural damage repairs, with the photos and details insurers ask for.'],
      ['Can you remove a load-bearing wall?', 'Load-bearing changes need an engineer\'s design. We work to that design, with temporary propping and correctly sized lintels or beams.'],
      ['How quickly can you make a wall safe?', 'For urgent jobs we prioritise a make-safe visit. Call us directly on the number above.'],
    ],
  },
  {
    slug: 'brick-block',
    name: 'Brick & Block',
    short: 'Structural and decorative brick and block construction for homes, extensions and commercial builds.',
    icon: 'bricks',
    cats: ['brickblock'],
    hero: 39,
    headline: 'Brick & Block Laying Brisbane',
    metaTitle: 'Bricklayer Brisbane | Brick & Block Laying | Bricklayers Brisbane',
    metaDesc: 'Experienced Brisbane bricklayers for brick and block construction: extensions, garages, fences, core-filled walls and commercial work. Licensed & insured.',
    intro: 'From core-filled blockwork to face brick, we lay it straight, level and to spec, on time. Builders, owner-builders and homeowners trust us for clean, accurate work.',
    includes: [
      'Face brick and rendered block construction',
      'Core-filled & reinforced blockwork',
      'Extensions, garages, sheds and granny flats',
      'Boundary walls and fences',
      'Brick stairs, planters and BBQ areas',
      'Commercial and industrial blockwork',
    ],
    problems: [
      ['Builder needs a reliable brickie', 'We turn up when we say we will and work to the program.'],
      ['Strength requirements', 'Reinforced, core-filled blockwork built to engineering.'],
      ['Finish quality', 'Clean joints and straight lines, ready for render or left as face brick.'],
      ['Messy sites', 'We clean as we go and leave the site tidy.'],
    ],
    faqs: [
      ['Brick or block: which should I choose?', 'Block is ideal for structural and rendered work; face brick gives a classic look with low maintenance. We\'ll recommend what suits your design and budget.'],
      ['Do you work with builders?', 'Yes. We work with builders, developers and owner-builders across Brisbane and surrounds.'],
      ['Do you supply materials?', 'We can supply all materials or work with materials you or your builder provide.'],
    ],
  },
  {
    slug: 'homes-developments',
    name: 'Homes & Developments',
    short: 'Bricklaying for new homes, townhouses and multi-unit developments, on schedule and to spec.',
    icon: 'house',
    cats: ['homes'],
    hero: 110,
    headline: 'Bricklaying for New Homes & Developments',
    metaTitle: 'Bricklaying for Homes & Developments Brisbane | Bricklayers Brisbane',
    metaDesc: 'Residential and multi-unit development bricklaying across South East Queensland. Reliable crews, quality blockwork, on-time completion.',
    intro: 'New homes, duplexes and townhouse projects need a bricklaying crew that keeps the build moving. We bring experienced crews, clear communication and quality you can sign off on.',
    includes: [
      'New home brick and block construction',
      'Duplex, townhouse and unit developments',
      'Fire-rated and acoustic separating walls',
      'Retaining and boundary walls for subdivisions',
      'Coordination with builders and site supervisors',
      'Defect-free handover focus',
    ],
    problems: [
      ['Program delays', 'Crews sized to your schedule so bricklaying isn\'t the hold-up.'],
      ['Inconsistent quality', 'One team, one standard, across every unit.'],
      ['Site safety', 'Fully insured, safe work practices and tidy sites.'],
      ['Communication', 'A single point of contact from start to finish.'],
    ],
    faqs: [
      ['What size developments do you take on?', 'From single new homes to multi-unit townhouse projects. Tell us the scope and program and we\'ll confirm crew availability.'],
      ['Can you work from plans?', 'Yes. Send plans and engineering through the quote form and we\'ll provide a detailed quote.'],
    ],
  },
];

const categories = [
  ['all', 'All'],
  ['retaining', 'Retaining Walls'],
  ['feature', 'Feature Walls'],
  ['repointing', 'Re-Pointing'],
  ['pavers', 'Pavers'],
  ['removal', 'Wall Removal'],
  ['brickblock', 'Brick & Block'],
  ['homes', 'Homes & Developments'],
];

// Case-study copy is a draft written from the photos. Confirm details with
// the client and replace [placeholders] before launch.
// `ba`: [before, after] photo indexes for the comparison slider. The current
// pairs are SAMPLE pairs (same job type, not the same viewpoint). Replace with
// true before/after shots and set `baSample: false`.
const projects = [
  { id: 'pool-feature-wall', cat: 'feature', title: 'Poolside Feature Wall with Water Blade', cover: 31, photos: [31, 42, 122], featured: true,
    type: 'Residential · Feature wall', challenge: 'A new pool needed a backdrop that hid the boundary and became the focal point of the yard.', solution: 'A rendered block feature wall with an integrated water blade and planter, finished to match the home.' },
  { id: 'tiered-retaining', cat: 'retaining', title: 'Tiered Block Retaining Walls', cover: 24, photos: [24, 27, 34, 90], featured: true, ba: [34, 24], baSample: true,
    type: 'Residential · Retaining wall', challenge: 'A steep backyard with almost no flat space, and soil washing down after every storm.', solution: 'Engineered, core-filled block walls in tiers with ag-pipe drainage and gravel backfill, creating two level terraces.' },
  { id: 'rendered-entrance-fence', cat: 'feature', title: 'Rendered Entrance Fence & Piers', cover: 113, photos: [113, 101, 65], featured: true,
    type: 'Residential · Entrance wall', challenge: 'A dated street frontage that did nothing for the home\'s kerb appeal.', solution: 'A low rendered block fence with feature piers and infill panels, painted to suit the facade.' },
  { id: 'entry-wall-letterbox', cat: 'feature', title: 'Entry Wall & Letterbox Pier', cover: 116, photos: [116, 117, 108], featured: true,
    type: 'Residential · Entrance wall', challenge: 'The owners wanted a modern, clean entry statement with numbering and a letterbox.', solution: 'A smooth rendered block wall with an integrated letterbox pier and house number.' },
  { id: 'tiled-entry-stairs', cat: 'pavers', title: 'Entry Stairs & Landing', cover: 20, photos: [20, 28, 60], featured: true,
    type: 'Residential · Steps & paving', challenge: 'Steep, uneven entry steps that felt unsafe.', solution: 'New block-built stairs with even risers and a tiled finish, plus a generous landing.' },
  { id: 'heritage-repoint', cat: 'repointing', title: 'Heritage Brick Repair & Re-Point', cover: 128, photos: [128, 55], featured: true,
    type: 'Residential · Re-pointing', challenge: 'Original brick arches with cracked, crumbling mortar letting moisture in.', solution: 'Failed joints raked out and repointed with a colour-matched mortar; damaged bricks replaced.' },
  { id: 'core-filled-blockwork', cat: 'brickblock', title: 'Core-Filled Structural Blockwork', cover: 39, photos: [39, 38, 94, 95], featured: true, ba: [38, 39], baSample: true,
    type: 'Residential · Brick & block', challenge: 'A structural lower level that had to meet the engineer\'s reinforcement spec.', solution: 'Reinforced, core-filled blockwork laid true and ready for render.' },
  { id: 'new-home-blockwork', cat: 'homes', title: 'New Home Blockwork', cover: 110, photos: [110, 104, 62], featured: true, ba: [104, 110], baSample: true,
    type: 'New build · Home', challenge: 'A builder needed a dependable crew to keep a new home on program.', solution: 'Full block construction delivered to schedule with a clean, render-ready finish.' },
  { id: 'townhouse-development', cat: 'homes', title: 'Townhouse Development Walls', cover: 127, photos: [127, 125, 112, 103], featured: true,
    type: 'Development · Multi-unit', challenge: 'Multiple units needing consistent separating and boundary walls.', solution: 'One crew, one standard across every unit, coordinated with the site supervisor.' },
  { id: 'levelled-yard', cat: 'retaining', title: 'Block Retaining Wall & Levelled Yard', cover: 79, photos: [79, 69, 102],
    type: 'Residential · Retaining wall', challenge: 'A sloping block left the owners without a usable lawn.', solution: 'A straight, engineered block wall allowed the yard to be filled and levelled.' },
  { id: 'boundary-drainage', cat: 'retaining', title: 'Boundary Retaining Wall & Drainage', cover: 41, photos: [41, 9, 66, 93],
    type: 'Residential · Retaining wall', challenge: 'Water from the neighbouring property was undermining the boundary.', solution: 'A new boundary wall with ag-pipe, membrane and free-draining backfill.' },
  { id: 'courtyard-paving', cat: 'pavers', title: 'Courtyard Paving & Surrounds', cover: 21, photos: [21, 15],
    type: 'Residential · Pavers', challenge: 'Uneven ground and pooling water beside the house.', solution: 'A compacted base, correct falls and new paving with block edging.' },
  { id: 'wall-removed-rebuilt', cat: 'removal', title: 'Wall Removed & Rebuilt for Conversion', cover: 80, photos: [80, 81, 82, 83],
    type: 'Renovation · Wall removal', challenge: 'An under-house area being converted needed walls removed and new ones built.', solution: 'Old walls removed safely, new block walls built and made ready for finishing.' },
  { id: 'make-safe-rebuild', cat: 'removal', title: 'Damaged Wall Made Safe & Replaced', cover: 88, photos: [88, 72, 105],
    type: 'Repair · Make safe', challenge: 'A damaged wall had become unsafe.', solution: 'Immediate make-safe, then removal and a matched rebuild.' },
  { id: 'brick-block-stairs', cat: 'brickblock', title: 'Brick & Block Stair Construction', cover: 96, photos: [96, 97, 64],
    type: 'Residential · Brick & block', challenge: 'New external stairs needed between levels.', solution: 'Brick-faced block stairs with consistent risers and solid footings.' },
  { id: 'garage-blockwork', cat: 'homes', title: 'Detached Garage Blockwork', cover: 47, photos: [47, 71],
    type: 'Residential · New structure', challenge: 'A new garage and storage building at the rear of the block.', solution: 'Block construction built to engineering, ready for roof and render.' },
].map((p) => ({ ...p, suburb: '[Suburb]', duration: '[X weeks]', quote: '[Client quote, add once approved]' }));

// Shown until live Google reviews load from /api/reviews.php. Never present these as real.
const sampleReviews = Array.from({ length: 6 }, (_, i) => ({
  author: '[Reviewer name]',
  date: '[Date]',
  rating: 5,
  text: '[A real Google review will appear here once the reviews feed is connected. These cards are placeholders.]',
  service: services[i % services.length].slug,
}));

const whyUs = [
  ['award', 'Quality workmanship', 'Straight lines, clean joints and finishes we\'re proud to put our name on.'],
  ['clock', 'On-time completion', 'We turn up when we say and keep your project on schedule.'],
  ['broom', 'Clean, tidy sites', 'We clean as we go and leave your property spotless.'],
  ['dollar', 'Transparent pricing', 'Clear, itemised quotes with no surprise extras.'],
  ['pin', 'Local Brisbane team', 'Family-owned and based in the Redlands, serving all of Brisbane.'],
  ['shield', 'Workmanship guarantee', 'Licensed, fully insured and backed by our workmanship guarantee.'],
];

const process = [
  ['mail', 'Send Inquiry', 'Tell us about your project online or call us. Photos help!'],
  ['clipboard', 'Free Site Visit & Quote', 'We inspect, measure and give you a clear written quote.'],
  ['trowel', 'Expert Build', 'Our qualified team builds it right, on time and to spec.'],
  ['check', 'Walkthrough & Clean-up', 'We walk the job with you and leave the site clean.'],
];

const faqs = [
  ['How much does bricklaying cost in Brisbane?', 'It depends on the size, materials, site access and finish. A small repair might be a few hundred dollars; a large retaining wall or new structure can be many thousands. We give free, itemised quotes after a site visit so you know exactly what you\'re paying for.'],
  ['How long will my project take?', 'Small repairs and repointing jobs often take a day or two. Retaining and feature walls typically take a few days to two weeks. Larger builds are scheduled to your program. We\'ll give you a timeframe in your quote.'],
  ['Do I need council approval?', 'Many small walls and repairs don\'t, but retaining walls over 1 metre, walls near buildings or boundaries and structural changes often need building approval and engineering. We\'ll advise you at the site visit and can work with your certifier or engineer.'],
  ['How high can a retaining wall be without an engineer?', 'As a general guide in Queensland, walls over 1 metre high, or within 1.5 metres of a building or another retaining wall, need engineering design and approval. Every site is different, so we check yours before quoting.'],
  ['What are the signs I need repointing?', 'Crumbling, cracked or missing mortar, loose bricks, plants growing in joints, or damp patches on internal walls are all signs your mortar is failing.'],
  ['Are you licensed and insured?', `Yes. We\'re QBCC licensed (licence ${site.qbcc}) and carry full public liability insurance.`],
  ['Which areas do you service?', 'All of Brisbane plus the Redlands, Logan, Ipswich and Moreton Bay regions. See the service area list above or just ask.'],
  ['Do you offer free quotes?', 'Always. Send us your details and photos through our quote form and we\'ll arrange a free site visit.'],
];

const areas = [
  ['Redlands', ['Victoria Point', 'Cleveland', 'Capalaba', 'Redland Bay', 'Thornlands', 'Wellington Point', 'Ormiston', 'Alexandra Hills', 'Birkdale', 'Sheldon']],
  ['Brisbane Southside', ['Carindale', 'Mount Gravatt', 'Sunnybank', 'Wynnum', 'Manly', 'Holland Park', 'Coorparoo', 'Camp Hill', 'Rochedale', 'Eight Mile Plains']],
  ['Brisbane Northside', ['Chermside', 'Aspley', 'Kedron', 'Everton Park', 'Albany Creek', 'Ashgrove', 'The Gap', 'Nundah', 'Bracken Ridge', 'Stafford']],
  ['Logan', ['Springwood', 'Shailer Park', 'Daisy Hill', 'Loganholme', 'Beenleigh', 'Underwood', 'Slacks Creek', 'Cornubia']],
  ['Ipswich', ['Ipswich', 'Springfield', 'Redbank Plains', 'Goodna', 'Brassall', 'Ripley']],
  ['Moreton Bay', ['North Lakes', 'Redcliffe', 'Strathpine', 'Caboolture', 'Narangba', 'Petrie']],
];

module.exports = { site, services, categories, projects, sampleReviews, whyUs, process, faqs, areas, img };

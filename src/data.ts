// Every string, link and piece of seed data for the site lives here.
// Start editing from the top: SITE, then the page sections below it.
//
// The figures on this site come from the project documentation: ESP32-C3 Super
// Mini, one passive piezo on GPIO 3, 3.7 V 3500 mAh LiPo through a TP4056,
// five cadence patterns, 15 mA advertising, 65 mA peak, under 50 ms latency.

export const SITE = {
  name: 'SONA',
  tagline: 'Navigation you can hear',
  email: 'hello@sonahelm.dev',
  phone: '+44 7700 900142',
  address: ['SONA — Sound Navigation Helmet', 'Engineering Design Studio, Room 2.14', 'First-year engineering project, 2026'],
  hours: 'Bench demos weekdays, 10:00–17:00',
  socials: [
    { label: 'GitHub', href: 'https://github.com' },
    { label: 'YouTube', href: 'https://www.youtube.com' },
    { label: 'Instagram', href: 'https://instagram.com' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com' },
  ],
}

/** Main navigation. The first four sit in the header; the menu shows all of them. */
export const NAV = [
  { label: 'Overview', to: '/#overview' },
  { label: 'Tech specs', to: '/services' },
  { label: 'Build log', to: '/work' },
  { label: 'About', to: '/studio' },
]
export const MENU = [
  { label: 'Overview', to: '/' },
  { label: 'Tech specs', to: '/services' },
  { label: 'Build log', to: '/work' },
  { label: 'Test programme', to: '/careers' },
  { label: 'About', to: '/studio' },
  { label: 'Book a demo', to: '/contact' },
]

/*
  Photography. Every image on the site goes through this one constant: swap
  `src` for your own file in public/images/ (or any URL) and update `alt`.
  The current files are generated placeholders, not photographs of the helmet;
  the `holo*` entries are the iridescent renders used on the inner pages.
*/
export const IMAGES = {
  aurora: { src: '/images/aurora.webp', alt: 'Soft translucent 3D forms in mint, peach and lilac on a pale background' },
  fold: { src: '/images/fold.webp', alt: 'Geometric shapes pressed into cream cotton paper beside a stack of colour-blocked book covers' },
  halcyon: { src: '/images/halcyon.webp', alt: 'Calm interior with a curved travertine desk and warm indirect light' },
  kite: { src: '/images/kite.webp', alt: 'Orange technical jacket hung against a green wall in hard sunlight' },
  meridian: { src: '/images/meridian.webp', alt: 'Two phones showing an app on a cobalt blue background' },
  nocturne: { src: '/images/nocturne.webp', alt: 'Swirling violet, magenta and teal liquid on black' },
  portrait: { src: '/images/portrait.webp', alt: 'A worktable with printed layouts, swatches and a moodboard in morning light' },
  ostra: { src: '/images/ostra.webp', alt: 'Ceramic jug and cups on linen in warm morning light' },
  glass: { src: '/images/glass.webp', alt: 'Clear glass carafe and tumbler casting light on a pale grey surface' },
  lookbook: { src: '/images/lookbook.webp', alt: 'Wooden bench with a folded throw beside a paper floor lamp in a bright room' },
  holoKnot: { src: '/images/holo/knot.webp', alt: '' },
  holoSphere: { src: '/images/holo/sphere.webp', alt: '' },
  holoCloud: { src: '/images/holo/cloud.webp', alt: '' },
  holoScissors: { src: '/images/holo/scissors.webp', alt: '' },
  holoStar: { src: '/images/holo/star.webp', alt: '' },
  holoPrism: { src: '/images/holo/prism.webp', alt: '' },
} as const satisfies Record<string, { src: string; alt: string }>
export type ImageKey = keyof typeof IMAGES

export const HOME = {
  eyebrow: 'Prototype 04 — acoustic navigation',
  headline: ['Sound Navigation', 'Helmet'],
  standfirst:
    'Turn-by-turn cues you hear instead of read. A phone sends a single byte over Bluetooth; a buzzer inside the helmet answers with a cadence your ear already knows.',
  heroCaption: 'Buzzer in the ear pocket, ESP32-C3 in the foam, 3,500 mAh cell behind the head.',
  actions: {
    primary: { label: 'Book a demo', to: '/contact' },
    secondary: { label: 'Read the tech specs', to: '/services' },
  },
  facts: [
    { value: 1, suffix: '', label: 'Piezo actuator' },
    { value: 5, suffix: '', label: 'Cadence patterns' },
    { value: 24, suffix: ' h+', label: 'Continuous runtime' },
    { value: 50, suffix: ' ms', label: 'Latency ceiling' },
  ],
  why: {
    kicker: 'Why sound',
    title: ['Eyes on', 'the road.'],
    body: 'A handlebar mount or a phone in the hand pulls a rider’s eyes off the road for a second at a time. This system moves the instruction into the one channel that is still free: the ear. The buzzer sits inside the lining rather than over the canal, so ambient traffic stays audible.',
    points: ['No visual cognitive load', 'Ambient sound is not occluded', 'Cue to tone in under 50 ms'],
    caption: 'Rider sightline, uninterrupted',
  },
  wireless: {
    kicker: 'The link',
    title: ['A phone talks.', 'The helmet answers.'],
    body: 'An ESP32-C3 Super Mini advertises a custom GATT service. The phone writes one ASCII character to a single characteristic and the helmet plays the matching cadence. There is no screen to watch and no map to glance at.',
    points: [
      { title: 'BLE 5.0', body: '2.4 GHz link on the NimBLE stack, advertised as Helmet-Nav-ESP32C3.' },
      { title: 'One byte', body: 'L, R, U, D or C. That is the entire protocol.' },
      { title: 'Reconnects itself', body: 'Advertising restarts on disconnect, so a dropped link is not a dead helmet.' },
    ],
    caption: 'BLE link · phone to helmet',
  },
  cadence: {
    kicker: 'Encoding',
    title: ['One buzzer.', 'Five cues.'],
    body: 'Pattern does the work: a chirp count for direction, pitch for urgency, one long tone for arrival. Nothing to learn beyond a syllable.',
  },
  highlightsTitle: ['Three', 'decisions'],
  highlightsIntro: 'The rules that shaped the board, the wiring and the firmware.',
  highlights: [
    {
      icon: 'volume',
      title: 'One actuator, no amplifier',
      body: 'A single piezo replaces an MP3 module, amplifier, micro-SD card and boost converter. Fewer parts, less mass, less to fail.',
    },
    {
      icon: 'eye',
      title: 'Nothing to look at',
      body: 'There is no HUD and no screen in the loop. The cue arrives in the ear pocket and the road never leaves your view.',
    },
    {
      icon: 'power',
      title: 'Hard-cut power',
      body: 'An SPST switch isolates the cell between charger and MCU, so the helmet draws nothing at all when it is off.',
    },
  ],
  build: {
    kicker: 'The build',
    title: ['Bench first,', 'then the lining.'],
    body: 'An ESP32-C3 Super Mini, a TP4056 charge board, a 3,500 mAh cell behind the head and one piezo on GPIO 3. Wires run at 28 AWG under the comfort liner, taped against vibration, with the buzzer set into the ear pocket.',
    facts: ['~15 mA while advertising', '~65 mA peak', '28 AWG under the liner'],
    action: { label: 'Read the build log', to: '/work' },
  },
  calibration: {
    title: ['Tuned for', 'wind noise'],
    body: 'Wind noise rises with speed, so the buzzer is damped to match. Layers over the aperture are added or removed for the ride, keeping the cue legible without fatiguing the ear indoors.',
    items: [
      { name: 'Quiet indoor', level: 65, note: '0–15 km/h · two layers of tape' },
      { name: 'City commute', level: 75, note: '15–40 km/h · one layer' },
      { name: 'High speed', level: 85, note: '40 km/h and up · direct channel, no damping' },
    ],
  },
  specs: [
    { label: 'Controller', value: 'ESP32-C3 Super Mini · RISC-V · BLE 5.0 · 22.5 × 18 mm' },
    { label: 'Audio', value: '1 × piezo buzzer on GPIO 3 · PWM tone generation' },
    { label: 'Power', value: '3.7 V 3,500 mAh LiPo · TP4056 · SPST hard-cut switch' },
    { label: 'Runtime', value: '24 h+ continuous · 1 A USB-C charging' },
    { label: 'Current', value: '~15 mA advertising · ~65 mA peak' },
    { label: 'Latency', value: 'Under 50 ms, command to tone' },
  ],
  cta: {
    title: ['Hear it for', 'yourself.'],
    body: 'A short bench demo: a phone, the helmet and the five cues. Weekdays in the engineering studio, or by video call if you are further away.',
    action: { label: 'Book a demo', to: '/contact' },
    note: 'First-year engineering prototype · not for sale',
  },
}

export type Cadence = {
  cmd: string
  label: string
  pattern: string
  freq: string
  description: string
  pulses: { freq: number; ms: number }[]
}

/** The documented cadence map: exact frequencies, pulse lengths and gaps. */
export const CADENCES: Cadence[] = [
  {
    cmd: 'L',
    label: 'Turn left',
    pattern: '1 chirp · 80 ms',
    freq: '2400 Hz',
    description: 'One syllable: left.',
    pulses: [{ freq: 2400, ms: 80 }],
  },
  {
    cmd: 'R',
    label: 'Turn right',
    pattern: '2 chirps · 80 ms on, 80 ms off',
    freq: '2400 Hz',
    description: 'Two syllables: right.',
    pulses: [
      { freq: 2400, ms: 80 },
      { freq: 2400, ms: 80 },
    ],
  },
  {
    cmd: 'U',
    label: 'U-turn, sharp',
    pattern: '3 chirps · 60 ms on, 60 ms off',
    freq: '3000 Hz',
    description: 'Three fast, higher chirps: sharp turn.',
    pulses: [
      { freq: 3000, ms: 60 },
      { freq: 3000, ms: 60 },
      { freq: 3000, ms: 60 },
    ],
  },
  {
    cmd: 'D',
    label: 'Destination',
    pattern: '1 long tone · 500 ms',
    freq: '1800 Hz',
    description: 'One long low tone: you have arrived.',
    pulses: [{ freq: 1800, ms: 500 }],
  },
  {
    cmd: 'C',
    label: 'Connected',
    pattern: '2 ascending chirps',
    freq: '2000 → 2600 Hz',
    description: 'Two rising tones: the link is up.',
    pulses: [
      { freq: 2000, ms: 100 },
      { freq: 2600, ms: 150 },
    ],
  },
]

/** The product experience: problem, anatomy, signal path, ride and status. */
export const EXPERIENCE = {
  problem: {
    kicker: 'The problem',
    title: ['Two seconds', 'looking down.'],
    body: 'Handlebar mounts and phones in hand take a rider’s eyes off the road at the exact moment the road matters most. This project takes the screen out of the loop rather than making it smaller.',
    calc: {
      metres: 14,
      line: 'Two seconds at 25 km/h is about fourteen metres of road you never saw.',
      working: '25 km/h ≈ 6.9 m/s × 2 s ≈ 13.9 m',
    },
    rows: [
      { label: 'Screen navigation', cost: '2 s', headline: 'Eyes down at every junction', detail: 'A glance per instruction, timed by the phone rather than the road.' },
      { label: 'Acoustic cues', cost: '0 s', headline: 'Eyes stay forward', detail: 'One byte in, one cadence out, under 50 ms from command to tone.' },
    ],
  },
  parts: [
    {
      id: 'esp32',
      n: 1,
      title: 'ESP32-C3 Super Mini',
      spec: '22.5 × 18 mm · BLE 5.0 · RISC-V',
      body: 'Runs the Bluetooth stack, the cadence engine and the PWM tone output. Native 3.3 V logic, so no level shifter sits between it and the buzzer.',
      x: 55,
      y: 46,
    },
    {
      id: 'buzzer',
      n: 2,
      title: 'Piezo buzzer',
      spec: 'GPIO 3 · PWM · ~70 dB at the ear',
      body: 'Set into the ear pocket and damped with tape or foam. Every cue on this page is played by this one part.',
      x: 65,
      y: 65.5,
    },
    {
      id: 'battery',
      n: 3,
      title: '3.7 V 3,500 mAh LiPo',
      spec: '24 h+ continuous · TP4056 · 1 A USB-C',
      body: 'Sits in a pre-moulded channel in the rear EPS foam, away from impact points and clear of shell fasteners.',
      x: 31,
      y: 62,
    },
    {
      id: 'switch',
      n: 4,
      title: 'SPST hard-cut switch',
      spec: 'Charger output → 5 V pin',
      body: 'Cuts the cell physically, so an off helmet draws nothing and cannot drain itself in a bag.',
      x: 24,
      y: 72,
    },
  ],
  flow: [
    {
      title: 'Phone writes a byte',
      detail: 'The terminal app writes one ASCII character — L, R, U, D or C — to characteristic 0bed4054-9a70-4bc5-8c1d-05d9c77d4e0b.',
      meta: 'BLE GATT write',
    },
    {
      title: 'The link delivers it',
      detail: 'The ESP32-C3 receives the write on its custom service through the NimBLE stack. Advertising restarts if the phone drops.',
      meta: '2.4 GHz · BLE 5.0',
    },
    {
      title: 'Firmware maps the character',
      detail: 'A switch on the command picks the pulse count, tone frequency and pulse length. Nothing else is computed.',
      meta: 'command → pattern',
    },
    {
      title: 'The piezo plays the pattern',
      detail: 'PWM drives the buzzer on GPIO 3 between 1.8 and 3.0 kHz, damped to roughly 70 dB at the ear for normal riding.',
      meta: 'GPIO 3 · 1800–3000 Hz',
    },
    {
      title: 'The rider hears the cue',
      detail: 'One chirp left, two right, three for a U-turn, one long tone for arrival. The ear canal stays open to traffic.',
      meta: 'under 50 ms',
    },
  ],
  ride: [
    {
      key: 'L',
      moment: 'Junction ahead',
      title: 'One chirp, and the turn is left',
      body: 'The route turns left. A single 80 ms chirp at 2400 Hz arrives in the ear pocket. The rider turns without looking down.',
    },
    {
      key: 'R',
      moment: 'Road bends right',
      title: 'Two chirps mean right',
      body: 'Two 80 ms chirps, 80 ms apart, both at 2400 Hz. Two syllables: right. Nothing to read, nothing to remember beyond the count.',
    },
    {
      key: 'D',
      moment: 'Arrival',
      title: 'One long tone, then silence',
      body: 'A single 500 ms tone at 1800 Hz. The route ends, the helmet goes quiet, and the next instruction only arrives when there is one.',
    },
  ],
  status: [
    {
      label: 'Working',
      tone: 'good' as const,
      summary: 'Built, wired and measured on the bench.',
      items: [
        { title: 'BLE 5.0 link', detail: 'Custom GATT service with one writable characteristic; advertising restarts after a disconnect.' },
        { title: 'Five cadence patterns', detail: 'Single piezo on GPIO 3, 1800–3000 Hz, 60–500 ms pulses.' },
        { title: 'Power stage', detail: '3,500 mAh LiPo, TP4056 charge and protection board, SPST hard-cut switch.' },
        { title: 'Helmet integration', detail: 'Cell in the rear EPS channel, buzzer in the ear pocket, 28 AWG harness taped under the liner.' },
      ],
    },
    {
      label: 'In development',
      tone: 'warn' as const,
      summary: 'Documented work still being tuned.',
      items: [
        { title: 'Volume calibration', detail: 'Three damping settings at roughly 65, 75 and 85 dB for quiet, city and high-speed riding.' },
        { title: 'Bench verification', detail: 'Current draw and cue latency measured before each helmet is closed up.' },
        { title: 'Harness serviceability', detail: 'Strain relief and access so the buzzer and board can be reached without disturbing the liner.' },
      ],
    },
    {
      label: 'Planned',
      tone: 'plan' as const,
      summary: 'Not in Prototype 04. No microphone is fitted.',
      items: [
        { title: 'AI voice interaction', detail: 'Would need a microphone, an audio path and a model on the phone. The current helmet has no microphone, so this is not a working feature.' },
        { title: 'Spoken directions', detail: 'The documented upgrade path: DFPlayer Mini on UART, 40 mm 4 Ω speaker and an MT3608 boost to 5 V.' },
        { title: 'Notifications and calls', detail: 'Needs a phone-side app that reads notifications and synthesises speech. The link today carries five single-byte commands.' },
        { title: 'Navigation app', detail: 'Prototype 04 is driven from a BLE terminal. A routing app that writes the same bytes does not exist yet.' },
      ],
    },
  ],
}

/** Used by the marquee on the about page: every part in the build. */
export const CLIENTS = ['ESP32-C3', 'TP4056', '3.7 V LiPo', 'Piezo buzzer', 'SPST switch', '28 AWG', 'BLE 5.0', 'USB-C']

export type Service = {
  slug: string
  title: string
  short: string
  art: HoloKind
  intro: string
  deliverables: string[]
}
export type HoloKind = 'knot' | 'sphere' | 'cloud' | 'scissors' | 'star' | 'prism'

export const SERVICES: Service[] = [
  {
    slug: 'controller',
    title: 'ESP32-C3 controller',
    short: 'The smallest board that fits the comfort foam',
    art: 'sphere',
    intro:
      'One RISC-V board runs the Bluetooth stack, the cadence engine and the tone output. At 22.5 by 18 millimetres it disappears into the recess above the ear, and its native 3.3 V logic removes a level shifter.',
    deliverables: ['RISC-V, 160 MHz', 'BLE 5.0, NimBLE stack', 'Native 3.3 V logic', '22.5 × 18.0 mm footprint', 'Low sleep-current draw'],
  },
  {
    slug: 'acoustics',
    title: 'Single-buzzer acoustics',
    short: 'Five cues from one piezo on GPIO 3',
    art: 'prism',
    intro:
      'A passive piezo driven by PWM carries the whole interface. Frequency, pulse length and repetition count encode the command, so no amplifier, DAC or speaker subsystem is needed.',
    deliverables: ['Passive piezo, GPIO 3', 'PWM tone generation', 'Five cadence patterns', 'Damped to ~70 dB at the ear', 'Direct channel for speed'],
  },
  {
    slug: 'power',
    title: 'Power and charging',
    short: 'A cell, a protection board and a physical switch',
    art: 'star',
    intro:
      'A 3.7 V 3,500 mAh pouch cell feeds a TP4056 board with over-discharge and over-current protection, rated for 1 A charge. An SPST switch sits between the board output and the MCU rail.',
    deliverables: ['3.7 V 3,500 mAh LiPo', 'TP4056 CC/CV at 1 A', 'Over-discharge protection', 'Over-current protection', 'SPST hard-cut switch'],
  },
  {
    slug: 'firmware',
    title: 'BLE firmware',
    short: 'One characteristic, five commands, no app to watch',
    art: 'cloud',
    intro:
      'The helmet is a BLE peripheral with a custom service and a single writable characteristic. A write of one ASCII byte triggers the cadence, and advertising restarts automatically after a disconnect.',
    deliverables: ['Custom GATT service', 'One write characteristic', 'Single-byte commands', 'Advertising restart on disconnect', 'Serial debug log'],
  },
  {
    slug: 'assembly',
    title: 'Mechanical integration',
    short: 'Cell in the EPS channel, buzzer in the ear pocket',
    art: 'knot',
    intro:
      'The battery sits in a pre-moulded channel in the rear EPS foam, away from impact points. Wiring runs at 28 AWG beneath the removable comfort liner, taped at every joint, with the buzzer aligned to the ear canal.',
    deliverables: ['Cell in the rear EPS channel', '28 AWG under the liner', 'Kapton tape at every joint', 'Buzzer aligned to the canal', 'Aperture damping layers'],
  },
]

export const APPROACH = [
  { title: 'Distraction-free', body: 'If it needs a glance, it does not belong in a helmet.', art: 'knot' as HoloKind, tone: 'violet' as const },
  { title: 'Inventory first', body: 'Every part is on the shelf: one board, one buzzer, one cell, one switch.', art: 'scissors' as HoloKind, tone: 'white' as const },
  { title: 'Bench before helmet', body: 'Current, latency and volume are measured before anything goes into the lining.', art: 'star' as HoloKind, tone: 'white' as const },
  { title: 'Upgrade, not replace', body: 'Voice prompts can be added on UART without changing the controller.', art: 'sphere' as HoloKind, tone: 'night' as const },
]

export const PROCESS = [
  { step: '01', title: 'Select', body: 'One board, one buzzer, one cell. Every part had to be in inventory and fit inside the shell.' },
  { step: '02', title: 'Assemble', body: 'Battery into the rear foam channel, TP4056 and switch in the shell, buzzer into the ear pocket, 28 AWG between them.' },
  { step: '03', title: 'Encode', body: 'Five commands mapped to pulse counts, tone lengths and frequencies, then written as a switch statement in firmware.' },
  { step: '04', title: 'Bench test', body: 'Current draw, cue latency and loudness measured at three wind-noise levels before the helmet went on a head.' },
]

export const ENGAGEMENTS = [
  {
    name: 'HUD concept',
    price: 'Dropped',
    length: 'Scope decision',
    body: 'An optical head-up display: precise on paper, but power-hungry, mechanically fragile and one more thing to look at.',
    points: ['Optics and mounting', 'High power draw', 'Glance required'],
  },
  {
    name: 'Acoustic prototype',
    price: 'Current build',
    length: 'Bench verified',
    body: 'One controller, one buzzer, five cues and a phone that writes a single byte.',
    points: ['ESP32-C3 and BLE', 'Single piezo cadence map', '24 h+ on 3,500 mAh', 'Under 50 ms latency'],
    featured: true,
  },
  {
    name: 'Voice module',
    price: 'Future',
    length: 'Upgrade path',
    body: 'A DFPlayer Mini and a 40 mm speaker add spoken prompts on the same controller.',
    points: ['UART at 9600 baud', 'MT3608 boost to 5 V', '1 kΩ series resistors'],
  },
]

export const FAQ = [
  {
    q: 'Why not the head-up display?',
    a: 'The first concept used an optical HUD. The optics, power draw and mechanical stability did not fit a first-year prototype, and a glance at a display is exactly the distraction the project set out to remove. The acoustic version keeps the useful part.',
  },
  {
    q: 'Why a single buzzer?',
    a: 'An MP3 module, amplifier, speaker and boost converter would add mass, wiring and current. One piezo driven by PWM covers five cues on its own.',
  },
  {
    q: 'How does the phone talk to it?',
    a: 'A BLE GATT service with one write characteristic. The app writes a single ASCII character — L, R, U, D or C — and the firmware plays the matching pattern.',
  },
  {
    q: 'How long does it run?',
    a: 'A 3,500 mAh cell gives more than twenty-four hours of continuous use. Charging is 1 A over USB-C through the TP4056 board.',
  },
  {
    q: 'Can the cues be louder?',
    a: 'Yes, by removing damping layers. The aperture is covered with tape or open-cell foam to bring it to roughly 70 dB at the ear for normal riding, and left open for high-speed wind noise.',
  },
  {
    q: 'What is the upgrade path?',
    a: 'A DFPlayer Mini on hardware serial, a 40 mm 4 Ω speaker in the ear pocket and an MT3608 boost stage would add voice prompts without replacing the controller.',
  },
]

export type Project = {
  slug: string
  client: string
  title: string
  year: number
  disciplines: string[]
  cover: ImageKey
  gallery: ImageKey[]
  summary: string
  challenge: string
  approach: string
  results: { value: string; label: string }[]
  quote?: { text: string; name: string; role: string }
  accent: string
}

export const DISCIPLINES = ['Scope', 'Electronics', 'Firmware', 'Acoustics'] as const

/** The build log: one entry per engineering decision. */
export const PROJECTS: Project[] = [
  {
    slug: 'scope',
    client: 'Decision 01',
    title: 'Dropping the head-up display',
    year: 2026,
    disciplines: ['Scope'],
    cover: 'fold',
    gallery: ['fold', 'portrait'],
    summary: 'The original brief had optics in it. The prototype that shipped has none, and is better for it.',
    challenge: 'A helmet HUD needs a projector, a combiner and a power budget that a first-year build cannot carry, and it still asks the rider to look at something.',
    approach: 'Keep the navigation, drop the display. The instruction moved from the eye to the ear, which removed the optics, the mounting and most of the power draw in one decision.',
    results: [
      { value: '0', label: 'Optical parts left' },
      { value: '1', label: 'Channel: the ear' },
      { value: '4', label: 'Components in the BOM' },
    ],
    accent: '#8e8e93',
  },
  {
    slug: 'controller',
    client: 'Decision 02',
    title: 'The smallest board that fits',
    year: 2026,
    disciplines: ['Electronics'],
    cover: 'meridian',
    gallery: ['meridian', 'fold'],
    summary: 'An ESP32-C3 Super Mini at 22.5 × 18 mm, with Bluetooth built in and 3.3 V logic that needs no shifter.',
    challenge: 'The board had to sit inside the comfort foam, run from a single LiPo cell and hold a phone connection without an external radio.',
    approach: 'One board does the radio, the cadence engine and the tone output. Its footprint disappears above the ear and its native logic level removes a whole level-shifting stage.',
    results: [
      { value: '22.5×18', label: 'Millimetres, board' },
      { value: '1', label: 'Board in the build' },
      { value: '0', label: 'Level shifters' },
    ],
    accent: '#0071e3',
  },
  {
    slug: 'power-stage',
    client: 'Circuit 03',
    title: 'A cell, a charger and a switch',
    year: 2026,
    disciplines: ['Electronics'],
    cover: 'glass',
    gallery: ['glass', 'nocturne'],
    summary: 'A 3,500 mAh pouch cell into a TP4056 board, then an SPST switch, then the 5 V pin. No boost converter, no drain when off.',
    challenge: 'A helmet is switched on and off all day, so quiescent drain matters as much as capacity. The cell also has to survive being charged from a laptop.',
    approach: 'The TP4056 handles 1 A charging and protects against over-discharge and over-current. The switch cuts the rail physically, so an off helmet is a dead circuit, not a sleeping one.',
    results: [
      { value: '24 h+', label: 'Continuous runtime' },
      { value: '1 A', label: 'USB-C charge rate' },
      { value: '0 mA', label: 'Draw when off' },
    ],
    accent: '#1d1d1f',
  },
  {
    slug: 'cadence',
    client: 'Firmware 04',
    title: 'Five cues from one buzzer',
    year: 2026,
    disciplines: ['Firmware'],
    cover: 'aurora',
    gallery: ['aurora', 'nocturne'],
    summary: 'One chirp left, two right, three for a U-turn, one long tone for arrival, two rising tones for connected.',
    challenge: 'A single tone cannot say “left” and “right” at once. The encoding had to be unmistakable on the first hearing, at 70 dB, over traffic.',
    approach: 'Count, length and pitch carry the meaning: syllable count for direction, higher and faster for urgency, a long low tone for the end of the route. The firmware is a switch on one byte.',
    results: [
      { value: '5', label: 'Patterns in firmware' },
      { value: '1', label: 'Byte per command' },
      { value: '<50 ms', label: 'Command to tone' },
    ],
    accent: '#7b3cff',
  },
  {
    slug: 'integration',
    client: 'Assembly 05',
    title: 'Into the lining, without a rattle',
    year: 2026,
    disciplines: ['Acoustics'],
    cover: 'portrait',
    gallery: ['portrait', 'lookbook'],
    summary: 'Cell in the rear EPS channel, buzzer in the ear pocket, 28 AWG taped under the comfort liner.',
    challenge: 'Loose wire in a helmet is a wear item and an annoyance. The buzzer also had to be loud enough outdoors and quiet enough indoors.',
    approach: 'Every joint is taped with Kapton against vibration, wires run under the removable liner, and the aperture gets one or two layers of tape depending on the ride.',
    results: [
      { value: '3', label: 'Damping settings' },
      { value: '~70 dB', label: 'At the ear, indoors' },
      { value: '8', label: 'Wires in the harness' },
    ],
    accent: '#c7b49a',
  },
  {
    slug: 'upgrade',
    client: 'Next 06',
    title: 'The voice module that fits later',
    year: 2026,
    disciplines: ['Firmware', 'Electronics'],
    cover: 'halcyon',
    gallery: ['halcyon', 'glass'],
    summary: 'A DFPlayer Mini, a 40 mm speaker and an MT3608 boost stage bolt onto the same controller.',
    challenge: 'Spoken prompts need 5 V, an SD card and an amplifier — three things the current build deliberately does without.',
    approach: 'Keep the controller and the BLE service, add the audio module on hardware serial with 1 kΩ series resistors, and boost the cell to 5 V only for the amplifier.',
    results: [
      { value: '9600', label: 'Baud on the UART link' },
      { value: '40 mm', label: 'Speaker in the ear pocket' },
      { value: '5.0 V', label: 'Boosted rail' },
    ],
    accent: '#74e3ff',
  },
]

/** Notes from the bench, shown by the testimonial slider. */
export const TESTIMONIALS = [
  { quote: 'Idle advertising sits at 15 mA and peaks at 65 mA with the buzzer driving. Comfortably inside the budget.', name: 'Bench note 01', role: 'Current consumption' },
  { quote: 'Command to tone lands under 50 ms in the serial terminal, which is faster than the phone can redraw a map.', name: 'Bench note 02', role: 'Latency' },
  { quote: 'Two chirps is unmistakably not one. Nobody needed the legend after the second cue.', name: 'Bench note 03', role: 'Cadence legibility' },
  { quote: 'One layer of tape is the setting that survives a city commute without shouting indoors.', name: 'Bench note 04', role: 'Volume calibration' },
]

export const STUDIO = {
  title: ['One project,', 'four decisions'],
  intro:
    'SONA is a first-year engineering project: a riding helmet that speaks in cadences instead of screens. It began as an optical head-up display and became a single-buzzer acoustic system on an ESP32-C3, built from parts that were already on the shelf.',
  stats: [
    { value: 1, label: 'Controller board' },
    { value: 5, label: 'Cadence patterns' },
    { value: 24, label: 'Hours of runtime' },
    { value: 50, label: 'Milliseconds, max' },
  ],
  values: [
    { title: 'Distraction-free', body: 'If it needs a glance, it does not belong in a helmet.' },
    { title: 'Inventory first', body: 'One board, one buzzer, one cell, one switch. Nothing exotic, nothing on back order.' },
    { title: 'Bench before helmet', body: 'Current, latency and volume are measured before anything goes into the lining.' },
  ],
  team: [
    { name: 'Design lead', role: 'Circuit, firmware, integration' },
    { name: 'Project supervisor', role: 'Engineering review' },
    { name: 'Lab technician', role: 'Soldering and safety' },
  ],
  awards: [
    { year: 2026, name: 'HUD concept', note: 'Optics and mounting studied, then dropped' },
    { year: 2026, name: 'Acoustic prototype', note: 'ESP32-C3, buzzer, BLE link' },
    { year: 2026, name: 'Bench verification', note: 'Current, latency and volume measured' },
    { year: 2026, name: 'Helmet integration', note: 'Cell in the EPS channel, buzzer in the ear pocket' },
  ],
}

export type Role = {
  slug: string
  title: string
  team: string
  location: string
  type: string
  summary: string
  responsibilities: string[]
  requirements: string[]
}

export const CAREERS = {
  title: ['Listen for', 'us'],
  intro:
    'The cues have to be obvious on the first hearing. Listening sessions take twenty minutes: five tones, five commands, and an honest answer about which ones you could tell apart.',
  perks: [
    { title: 'Twenty minutes', body: 'A short briefing, the five cues in sequence, then the same cues in random order.' },
    { title: 'No experience needed', body: 'You do not need to ride, or to know anything about electronics.' },
    { title: 'Honest answers', body: 'Three questions afterwards. The blunt ones are the useful ones.' },
    { title: 'Quiet room', body: 'Sessions run at a bench with the door shut, so volume is judged fairly.' },
  ],
}

export const ROLES: Role[] = [
  {
    slug: 'cadence-recognition',
    title: 'Cadence recognition',
    team: 'Listening test',
    location: 'Engineering studio, bench 4',
    type: '20 minutes',
    summary: 'Hear the five cues once with the legend, then again without it, and tell us which ones you could name.',
    responsibilities: ['Listen to each cue twice', 'Name the cue without looking', 'Say which two were easiest to confuse'],
    requirements: ['No hearing aids', 'Comfortable in a quiet room', 'Under an hour on site'],
  },
  {
    slug: 'wind-noise',
    title: 'Wind-noise legibility',
    team: 'Listening test',
    location: 'Engineering studio, bench 4',
    type: '25 minutes',
    summary: 'Judge the three damping settings against recorded wind noise at 15, 30 and 45 km/h.',
    responsibilities: ['Rate each setting for clarity', 'Flag any setting that is uncomfortably loud', 'Pick the setting you would ride with'],
    requirements: ['No hearing aids', 'Prior riding experience preferred', 'Under an hour on site'],
  },
  {
    slug: 'ble-pairing',
    title: 'Pairing walkthrough',
    team: 'Bench test',
    location: 'Engineering studio, bench 4',
    type: '15 minutes',
    summary: 'Pair a phone to the helmet with no instructions, and tell us where the flow lost you.',
    responsibilities: ['Scan, connect and write a command', 'Narrate what you expected to happen', 'Note anything you had to guess'],
    requirements: ['An Android or iOS phone', 'No prior knowledge of BLE', 'Under an hour on site'],
  },
]

export const CONTACT = {
  title: ['Book a', 'demo'],
  intro: 'Three short steps. Bench demos run on weekdays, and we reply within two working days.',
  budgets: ['In the studio', 'By video call', 'At a project fair', 'Wherever suits you'] as const,
  timelines: ['This week', 'In 2–4 weeks', 'Next term', 'Just exploring'] as const,
  services: ['Cadence cues', 'Bluetooth link', 'Power and runtime', 'Firmware', 'Fitting and damping'] as const,
  steps: ['What to see', 'Where and when', 'About you'],
}

export const FOOTER = {
  newsletter: { title: 'Build notes', body: 'One email a month: new measurements, firmware changes, open listening sessions.' },
  legal: `© ${new Date().getFullYear()} SONA — Sound Navigation Helmet`,
}

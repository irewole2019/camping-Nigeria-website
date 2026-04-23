/**
 * Program data extracted from official program documents.
 * Each program maps to a dedicated sub-page under /schools/programs/.
 */

export interface ProgramPillar {
  title: string
  description: string
}

export interface ProgramModule {
  title: string
  description: string
  activities: string[]
  outcome: string
}

export interface ScheduleItem {
  time: string
  activity: string
}

export interface PackageTier {
  name: string
  tag: string
  duration: string
  includes: string[]
}

export interface ProgramData {
  slug: string
  title: string
  subtitle: string
  overview: string
  audience: string[]
  formats: { label: string; detail: string }[]
  stats: { label: string; value: string }[]
  pillars: ProgramPillar[]
  modules: ProgramModule[]
  schedule: { label: string; items: ScheduleItem[] }
  tiers: PackageTier[]
}

// ─── 2-Day On-Campus Camps ──────────────────────────────────────────────────

export const ON_CAMPUS_CAMPS: ProgramData = {
  slug: 'on-campus-camps',
  title: '2-Day On-Campus Camps',
  subtitle: 'Immersive outdoor experiences delivered right at your school gates.',
  overview:
    'A school-based immersive camp experience that transforms familiar campus grounds into a safe, exciting environment for adventure, learning, teamwork, and personal growth. Combining camping culture, outdoor recreation, life skills, eco-awareness, and creative activities — without requiring long-distance travel.',
  audience: [
    'Primary schools',
    'Secondary schools',
    'Holiday camps',
    'Boarding schools',
    'Faith-based schools',
    'International schools',
  ],
  formats: [
    { label: 'Overnight Camp', detail: 'A true 2-day on-campus camping experience with sleeping tents.' },
    { label: 'Extended Day Camp', detail: 'Two full days on campus without overnight stay.' },
    { label: 'Hybrid Camp', detail: 'Day 1 full day and evening, Day 2 morning continuation.' },
  ],
  stats: [
    { label: 'Duration', value: '2 Days' },
    { label: 'Ages', value: '6 – 17' },
    { label: 'Group Size', value: '40 – 150+' },
    { label: 'Formats', value: '3 Options' },
  ],
  pillars: [
    {
      title: 'Responsibility',
      description: 'Participants learn to care for their space, belongings, team, and shared environment.',
    },
    {
      title: 'Resilience',
      description: 'Participants adapt to routines, outdoor conditions, teamwork demands, and new experiences.',
    },
    {
      title: 'Independence',
      description: 'Participants practice decision-making, self-management, and confidence outside normal classroom structure.',
    },
    {
      title: 'Teamwork',
      description: 'Participants collaborate through house systems, games, shared routines, and camp challenges.',
    },
    {
      title: 'Curiosity',
      description: 'Participants explore, observe, create, ask questions, and engage more openly with the world around them.',
    },
  ],
  modules: [
    {
      title: 'Arrival & Camp Orientation',
      description: 'Students are welcomed into the camp environment and introduced to camp culture.',
      activities: ['Registration', 'House assignments', 'Orientation walk', 'Team icebreakers', 'Camp rules introduction'],
      outcome: 'Participants feel safe, informed, and part of a team from the start.',
    },
    {
      title: 'Tent & Camp Setup',
      description: 'A practical session that builds teamwork and outdoor confidence.',
      activities: ['Tent demonstration', 'Shared space setup', 'Bedroll organization', 'House zone identity creation'],
      outcome: 'Participants learn camp structure, responsibility, and collaborative setup.',
    },
    {
      title: 'Nature Discovery & Eco-Awareness',
      description: 'A school-ground version of outdoor environmental learning.',
      activities: ['Guided eco-awareness talk', 'Nature observation', 'Campus biodiversity spotting', 'Waste awareness challenge'],
      outcome: 'Participants connect with their natural surroundings and build environmental habits.',
    },
    {
      title: 'Sports & Movement',
      description: 'Fun, energetic activities that drive engagement and team spirit.',
      activities: ['Relay races', 'Football mini-games', 'Tug of war', 'Obstacle challenges', 'House competitions'],
      outcome: 'Participants develop teamwork, resilience, and physical engagement.',
    },
    {
      title: 'Creative Session',
      description: 'A calmer but meaningful creative block.',
      activities: ['Camp journaling', 'House banner design', 'Adire-inspired activity', 'Drawing and painting', 'Creative writing'],
      outcome: 'Participants express themselves creatively and reflect on their camp experience.',
    },
    {
      title: 'Evening Gathering',
      description: 'One of the emotional highlights of camp.',
      activities: ['Campfire-style circle', 'Karaoke', 'Storytelling', 'Acoustic music', 'Gratitude moments'],
      outcome: 'The experience closes with emotional connection, memory-making, and meaning.',
    },
    {
      title: 'Reflection & Closing',
      description: 'A guided close that helps schools see the developmental value.',
      activities: ['Debrief circle', 'Favourite moments', 'House recognitions', 'Certificate presentation'],
      outcome: 'Participants leave with clarity, pride, and a sense of accomplishment.',
    },
  ],
  schedule: {
    label: 'Sample 2-Day Overnight Schedule',
    items: [
      { time: '9:00 AM', activity: 'Arrival, registration, house assignment' },
      { time: '10:00 AM', activity: 'Opening circle and orientation' },
      { time: '10:30 AM', activity: 'Tent and camp setup session' },
      { time: '11:30 AM', activity: 'Nature discovery walk and eco-awareness' },
      { time: '12:30 PM', activity: 'Lunch' },
      { time: '1:15 PM', activity: 'Creative session or camp craft' },
      { time: '2:30 PM', activity: 'House games and team challenges' },
      { time: '5:00 PM', activity: 'Light evening recreation' },
      { time: '6:00 PM', activity: 'Dinner' },
      { time: '7:00 PM', activity: 'Camp circle, karaoke, storytelling' },
      { time: '8:30 PM', activity: 'Wind-down and lights-out' },
      { time: '—', activity: 'Day 2' },
      { time: '7:00 AM', activity: 'Morning movement or aerobics' },
      { time: '8:15 AM', activity: 'Sports and inter-house challenges' },
      { time: '9:30 AM', activity: 'Creative reflection or journaling' },
      { time: '10:30 AM', activity: 'Final camp challenge and team awards' },
      { time: '11:30 AM', activity: 'Debrief circle' },
      { time: '12:00 PM', activity: 'Pack-down, pickup, close' },
    ],
  },
  tiers: [
    {
      name: 'Spark',
      tag: 'Introduction',
      duration: '2 days, non-overnight',
      includes: [
        'Orientation and house system',
        'Eco-awareness activity',
        'Sports and games',
        'One creative session',
        'Closing awards',
      ],
    },
    {
      name: 'Trail',
      tag: 'Most Popular',
      duration: '2 full days',
      includes: [
        'Tent setup and camp skills',
        'Outdoor challenges',
        'Sports program',
        'Eco-learning',
        'Reflection sessions',
        'Keepsake materials',
      ],
    },
    {
      name: 'Summit',
      tag: 'Signature',
      duration: 'Overnight format',
      includes: [
        'Full camp transformation',
        'House system and tent experience',
        'Evening gathering',
        'Sports and challenges',
        'Creative and reflective activities',
        'Award ceremony and certificates',
      ],
    },
  ],
}

// ─── Nature & Craft ─────────────────────────────────────────────────────────

export const NATURE_CRAFT: ProgramData = {
  slug: 'nature-craft',
  title: 'Nature & Craft',
  subtitle: 'A single-day immersive experience blending outdoor adventure, creative expression, and environmental education.',
  overview:
    'Nature & Craft brings together eco-awareness learning, outdoor activities, artistic and cultural experiences, team bonding, and hands-on environmental stewardship. The goal is not only to teach environmental responsibility, but to make it memorable through movement, making, storytelling, and shared experience.',
  audience: [
    'Primary schools',
    'Secondary schools',
    'Universities and colleges',
    'Holiday programs',
    'Youth organizations',
    'Community groups',
  ],
  formats: [
    { label: 'On-Campus Activation', detail: 'Delivered within school grounds for convenience and safety.' },
    { label: 'Off-Campus Outdoor Venue', detail: 'An outdoor destination experience for deeper immersion.' },
    { label: 'Special Themed Event', detail: 'Custom themed days aligned with school calendars.' },
  ],
  stats: [
    { label: 'Duration', value: '4 – 8 Hrs' },
    { label: 'Ages', value: '5 – 18+' },
    { label: 'Group Size', value: '20 – 150+' },
    { label: 'Delivery', value: 'On/Off Campus' },
  ],
  pillars: [
    {
      title: 'Explore',
      description: 'Outdoor discovery and eco-learning through nature walks, scavenger hunts, and environmental games.',
    },
    {
      title: 'Create',
      description: 'Artistic sessions inspired by nature, culture, and sustainability — including adire tie-and-dye.',
    },
    {
      title: 'Play',
      description: 'Movement, teamwork, and recreation through relay races, team sports, and cooperative challenges.',
    },
    {
      title: 'Gather',
      description: 'Shared moments that build memory, reflection, and connection through storytelling and bonfire gatherings.',
    },
  ],
  modules: [
    {
      title: 'Eco-Awareness Session',
      description: 'A curriculum-aligned introduction to the environment, sustainability, and stewardship.',
      activities: ['Understanding our environment', 'Waste and pollution', 'Biodiversity and habitats', 'Everyday environmental action'],
      outcome: 'Participants leave with practical environmental understanding and clear action points.',
    },
    {
      title: 'Nature Discovery Activity',
      description: 'A guided outdoor experience that helps learners observe and connect with their surroundings.',
      activities: ['Guided nature walk', 'Observation journals', 'Texture, color, and sound mapping', 'Nature scavenger hunt'],
      outcome: 'Participants become more observant, curious, and connected to place.',
    },
    {
      title: 'Adire & Creative Heritage Workshop',
      description: 'A hands-on artistic session celebrating Nigerian cultural heritage.',
      activities: ['Introduction to adire traditions', 'Symbol and storytelling through fabric', 'Tie-and-dye practical session', 'Take-home art piece'],
      outcome: 'Participants engage with Nigerian cultural heritage while expressing creativity.',
    },
    {
      title: 'Camping Experience',
      description: 'A practical and exciting introduction to outdoor living.',
      activities: ['Tent setup demonstration', 'Team-based camp setup challenge', 'Outdoor safety introduction', 'Camp etiquette'],
      outcome: 'Participants learn confidence, teamwork, and outdoor readiness.',
    },
    {
      title: 'Sports & Team Recreation',
      description: 'High-energy outdoor play that strengthens teamwork and joy.',
      activities: ['Sack races', 'Relay competitions', 'Tug of war', 'Football mini-games', 'Cooperative challenges'],
      outcome: 'Participants develop teamwork, resilience, and physical engagement.',
    },
    {
      title: 'Bonfire & Reflection',
      description: 'Best suited to off-campus or approved outdoor venues.',
      activities: ['Bonfire circle', 'Storytelling', 'Music and drumming', 'Reflection prompts', 'Closing ceremony'],
      outcome: 'The experience ends with emotional connection, memory-making, and meaning.',
    },
  ],
  schedule: {
    label: 'Sample 6-Hour Immersive Day',
    items: [
      { time: '9:00 AM', activity: 'Arrival, welcome, group briefing, icebreakers' },
      { time: '9:30 AM', activity: 'Eco-awareness module' },
      { time: '10:15 AM', activity: 'Nature discovery activity' },
      { time: '11:00 AM', activity: 'Adire tie-and-dye workshop' },
      { time: '12:30 PM', activity: 'Break and refreshments' },
      { time: '1:00 PM', activity: 'Camping setup experience' },
      { time: '2:00 PM', activity: 'Sports and team games' },
      { time: '3:00 PM', activity: 'Reflection, group photos, close' },
    ],
  },
  tiers: [
    {
      name: 'Seed',
      tag: 'Half-Day',
      duration: '4 hours',
      includes: [
        'Welcome and orientation',
        'Eco-awareness session',
        'One outdoor activity',
        'One creative workshop',
        'Closing reflection',
      ],
    },
    {
      name: 'Grow',
      tag: 'Most Popular',
      duration: '6 hours',
      includes: [
        'Welcome and icebreakers',
        'Eco-awareness session',
        'Nature discovery activity',
        'Adire workshop',
        'Camping setup challenge',
        'Team sports',
        'Closing circle',
      ],
    },
    {
      name: 'Bloom',
      tag: 'Signature',
      duration: '8 hours',
      includes: [
        'Full welcome session',
        'Eco-awareness learning block',
        'Nature walk or scavenger hunt',
        'Adire workshop',
        'Camp setup and outdoor skills',
        'Sports and games',
        'Bonfire and storytelling',
        'Reflection and certificates',
      ],
    },
  ],
}

// ─── Leadership Development ─────────────────────────────────────────────────

export const LEADERSHIP_DEVELOPMENT: ProgramData = {
  slug: 'leadership-development',
  title: 'Leadership Development',
  subtitle: 'Structured challenges that grow confident, collaborative young leaders.',
  overview:
    'A high-engagement program designed for older students — SS1 to SS3, prefects, student leaders, and emerging peer influencers. Using fun, practical, and reflective activities to strengthen confidence, teamwork, communication, initiative, responsibility, and service-minded leadership.',
  audience: [
    'School prefects',
    'Senior students (SS1–SS3)',
    'Student council members',
    'Class captains',
    'Club executives',
    'High-potential students',
  ],
  formats: [
    { label: 'On-Campus Session', detail: 'Leadership activation delivered within school grounds.' },
    { label: 'Off-Campus Retreat', detail: 'A deeper immersive experience at an outdoor venue.' },
    { label: 'Prefect Training Day', detail: 'Specialized program for newly appointed or existing prefects.' },
  ],
  stats: [
    { label: 'Duration', value: '3 – 6 Hrs' },
    { label: 'Classes', value: 'SS1 – SS3' },
    { label: 'Group Size', value: '20 – 100+' },
    { label: 'Formats', value: '3 Options' },
  ],
  pillars: [
    {
      title: 'Self-Leadership',
      description: 'Managing attitude, conduct, emotions, preparation, and personal discipline.',
    },
    {
      title: 'Communication',
      description: 'Speaking clearly, listening actively, giving direction, and representing others well.',
    },
    {
      title: 'Collaboration',
      description: 'Working with peers, resolving tension, and contributing to a team goal.',
    },
    {
      title: 'Initiative',
      description: 'Stepping forward, solving problems, and acting without constant supervision.',
    },
    {
      title: 'Responsibility',
      description: 'Owning tasks, following through, and understanding that leadership is service.',
    },
    {
      title: 'Resilience',
      description: 'Handling pressure, adapting, recovering from setbacks, and staying effective.',
    },
  ],
  modules: [
    {
      title: 'Leadership Mindset Session',
      description: 'A practical and interactive opening that reframes leadership for older students.',
      activities: ['Leadership as influence, not title', 'Service versus status', 'Confidence versus arrogance', 'Discipline and credibility'],
      outcome: 'Students understand that leadership is earned through conduct, consistency, and service.',
    },
    {
      title: 'Identity & Strengths Mapping',
      description: 'A guided self-awareness session that helps students understand how they lead.',
      activities: ['Leadership style prompts', 'Strengths and blind spots exercise', 'Values mapping', 'Peer perception activity'],
      outcome: 'Students gain language for their strengths, growth areas, and leadership identity.',
    },
    {
      title: 'Team Challenge Circuit',
      description: 'A core fun element — highly active and engaging.',
      activities: ['Timed team problem-solving', 'Strategy races', 'Trust-based group challenges', 'Leadership rotation challenges'],
      outcome: 'Students experience leadership under pressure and learn that collaboration beats ego.',
    },
    {
      title: 'Communication & Influence Lab',
      description: 'Practical skills for student leaders who need to speak, direct, and resolve.',
      activities: ['Public speaking drills', 'Message relay exercises', 'Active listening challenge', 'Conflict response role-play'],
      outcome: 'Students improve how they speak, listen, and influence others.',
    },
    {
      title: 'Decision-Making Simulation',
      description: 'A prefect-focused module mirroring real school leadership situations.',
      activities: ['Discipline scenario role-play', 'Peer-pressure leadership cases', 'Event coordination simulation', 'Ethics and consequence mapping'],
      outcome: 'Students practice judgment, fairness, and accountability.',
    },
    {
      title: 'Service & School Culture',
      description: 'What makes the program school-friendly and values-based.',
      activities: ['Leadership as service', 'Protecting school culture', 'Being an example to juniors', 'Using influence positively'],
      outcome: 'Students connect leadership to character and institutional culture.',
    },
    {
      title: 'Reflection & Commitment Circle',
      description: 'A guided closing that helps the learning stick.',
      activities: ['Leadership journaling', 'Peer affirmations', 'Action-card completion', 'Team recognition'],
      outcome: 'Students leave with clarity, memory, and next-step commitment.',
    },
  ],
  schedule: {
    label: 'Sample 4-Hour Session',
    items: [
      { time: '9:00 AM', activity: 'Arrival, registration, icebreakers, team grouping' },
      { time: '9:30 AM', activity: 'Leadership mindset session' },
      { time: '10:15 AM', activity: 'Team challenge circuit' },
      { time: '11:15 AM', activity: 'Break' },
      { time: '11:30 AM', activity: 'Communication and influence lab' },
      { time: '12:15 PM', activity: 'Decision-making simulation' },
      { time: '1:00 PM', activity: 'Reflection, commitments, recognition, close' },
    ],
  },
  tiers: [
    {
      name: 'Rise',
      tag: 'Introduction',
      duration: '3 hours',
      includes: [
        'Leadership mindset session',
        'One challenge block',
        'Communication exercise',
        'Reflection close',
      ],
    },
    {
      name: 'Lead',
      tag: 'Most Popular',
      duration: '4 hours',
      includes: [
        'Mindset session',
        'Challenge circuit',
        'Communication lab',
        'Decision-making exercise',
        'Reflection and commitments',
      ],
    },
    {
      name: 'Influence',
      tag: 'Signature',
      duration: '6 hours',
      includes: [
        'Full immersive structure',
        'Strengths mapping',
        'Challenge circuit',
        'Communication lab',
        'Responsibility simulation',
        'Service and school culture block',
        'Certificates and recognition',
      ],
    },
  ],
}


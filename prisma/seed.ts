import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const AFCON_TEAMS = [
  'Algeria', 'Angola', 'Burkina Faso', 'Cameroon', 'Cape Verde', 'DR Congo',
  'Egypt', 'Equatorial Guinea', 'Gabon', 'Ghana', 'Guinea', 'Guinea-Bissau',
  'Ivory Coast', 'Mali', 'Mauritania', 'Morocco', 'Mozambique', 'Nigeria',
  'Senegal', 'Sierra Leone', 'South Africa', 'Tanzania', 'Tunisia', 'Zambia'
];

const PLAYER_NAMES_GK = [
  'Mendy', 'Samatta', 'Ochoa', 'Ngadeu-Ngadjui', 'Mungunkhishig', 'Kone',
  'Sy', 'Baron', 'Gomis', 'Keita', 'Belloumi', 'Oukidja', 'Soumaoro', 'M\'Bolhi',
  'Mandanda', 'Lukong', 'Ondoa', 'Kpa', 'M\' Hassan', 'Bouka', 'Ekangene',
  'Khadim', 'Cofie', 'Fanka', 'Ndiaye', 'Diop', 'Diawara', 'Beye', 'Sylla'
];

const PLAYER_NAMES_DEF = [
  'Mendy', 'Saiss', 'Diarra', 'Bissouma', 'Gueye', 'Diop', 'Cisse', 'Traore',
  'Konate', 'Koulibaly', 'Thiam', 'Mbengue', 'Ndiaye', 'Ba', 'Sarr', 'Wade',
  'Niakate', 'Sy', 'N\'Goumou', 'Bald', 'Mbacku', 'Camara', 'Diabaté', 'Kone',
  'Toure', 'Doumbia', 'Fofana', 'Sangaré', 'Keita', 'Mara', 'Dieng', 'Baldé',
  'Soumano', 'Mensah', 'Agyemang', 'Opoku', 'Kusi', 'Yiadom', 'Baba', 'Adams',
  'Abubakari', 'Sulemana', 'Issahaku', 'Ibrahim', 'Adams', 'Awudu', 'Ntim',
  'Baba', 'Mensah', 'Ofori', 'Antwi', 'Asamoah', 'Kwarasey', 'Jagne', 'Gassama'
];

const PLAYER_NAMES_MID = [
  'Ziyech', 'Hakimi', 'Benrahma', 'Mahrez', 'Mané', 'Sané', 'Gnabry', 'Griezmann',
  'Pogba', 'Kante', 'Kante', 'Ndombele', 'Guendouzi', 'Fofana', 'Bissouma',
  'Konaté', 'Diawara', 'Sangaré', 'Traoré', 'Camara', 'Keita', 'Diarra',
  'Baldé', 'Diabaté', 'Toure', 'Doumbia', 'Kone', 'Sy', 'Diop', 'Ndiaye',
  'M\'Sakn', 'Bauth', 'Mensah', 'Kofi', 'Agyemang', 'Appau', 'Kwakye', 'Osei',
  'Kumah', 'Asiedu', 'Acquah', 'Arthur', 'Dzukaman', 'Ocran', 'Mensah', 'Owusu',
  'Micheal', 'Kingsley', 'Yaw', 'Danso', 'Kwofie', 'Bismarck', 'Kwame', 'Nii'
];

const PLAYER_NAMES_FWD = [
  'Salah', 'Aubameyang', 'Mane', 'Hakimi', 'Zaha', 'Lookman', 'Mrema', 'Osako',
  'Haller', 'Ajax', 'Lukaku', 'Osimhen', 'Awazie', 'Uzoho', 'Kelechi', 'Chukwueze',
  'Kandouss', 'Nekkeb', 'Chabi', 'Yacine', 'Brahim', 'Dolly', 'Ounas', 'Bounedj',
  'Bahl', 'Mou', 'Zahra', 'Moumbagna', 'Sarr', 'Diatta', 'Ndiaye', 'Diouf',
  'Baldé', 'Gassama', 'Jallow', 'Ceesay', 'Mendes', 'N\'Doye', 'Fati', 'Baba',
  'Sow', 'Diop', 'Gueye', 'Kébé', 'Diagne', 'M\'Bengue', 'Sarr', 'Niang', 'Khalil',
  'Asamoah', 'Mensah', 'Owusu', 'Agyapong', 'Tetteh', 'Boakye', 'Yiadom', 'Agyeman'
];

function randomFromArray<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generatePlayersForTeam(teamId: string, teamName: string) {
  const players = [];
  const positions: { position: string; names: string[]; count: number }[] = [
    { position: 'GK', names: PLAYER_NAMES_GK, count: 3 },
    { position: 'DEF', names: PLAYER_NAMES_DEF, count: 8 },
    { position: 'MID', names: PLAYER_NAMES_MID, count: 10 },
    { position: 'FWD', names: PLAYER_NAMES_FWD, count: 8 }
  ];

  for (const pos of positions) {
    const usedNames = new Set<string>();
    for (let i = 0; i < pos.count; i++) {
      let name: string;
      do {
        name = randomFromArray(pos.names);
      } while (usedNames.has(name));
      usedNames.add(name);

      players.push({
        teamId,
        name: `${name} ${teamName.substring(0, 3).toUpperCase()}${i + 1}`,
        position: pos.position,
        isActive: true
      });
    }
  }

  return players;
}

async function main() {
  console.log('🌱 Starting database seed...\n');

  // Create Teams
  console.log('Creating 24 AFCON teams...');
  const teams = [];
  for (const teamName of AFCON_TEAMS) {
    const team = await prisma.team.create({
      data: { name: teamName }
    });
    teams.push(team);
  }
  console.log(`✅ Created ${teams.length} teams\n`);

  // Create Players (500+ total)
  console.log('Creating 500+ players...');
  let totalPlayers = 0;
  for (const team of teams) {
    const players = generatePlayersForTeam(team.id, team.name);
    await prisma.player.createMany({ data: players });
    totalPlayers += players.length;
  }
  console.log(`✅ Created ${totalPlayers} players\n`);

  // Create Fixtures (15 games covering 3 matchdays)
  console.log('Creating fixtures...');
  const fixtures = [];
  
  // Matchday 1 fixtures - January 13-14, 2025
  const matchday1Date = new Date('2025-01-13T18:00:00Z');
  const matchday1Fixtures = [
    { home: 'Senegal', away: 'Gambia', time: matchday1Date },
    { home: 'Mali', away: 'Guinea', time: new Date('2025-01-13T21:00:00Z') },
    { home: 'Algeria', away: 'Angola', time: new Date('2025-01-14T15:00:00Z') },
    { home: 'Burkina Faso', away: 'Mauritania', time: new Date('2025-01-14T18:00:00Z') },
    { home: 'Egypt', away: 'Senegal', time: new Date('2025-01-14T21:00:00Z') }
  ];

  // Matchday 2 fixtures - January 17-18, 2025
  const matchday2Date = new Date('2025-01-17T18:00:00Z');
  const matchday2Fixtures = [
    { home: 'Nigeria', away: 'Ghana', time: matchday2Date },
    { home: 'Ivory Coast', away: 'Nigeria', time: new Date('2025-01-17T21:00:00Z') },
    { home: 'Morocco', away: 'Zambia', time: new Date('2025-01-18T15:00:00Z') },
    { home: 'South Africa', away: 'Tunisia', time: new Date('2025-01-18T18:00:00Z') },
    { home: 'Cameroon', away: 'DR Congo', time: new Date('2025-01-18T21:00:00Z') }
  ];

  // Matchday 3 fixtures - January 21-22, 2025
  const matchday3Date = new Date('2025-01-21T18:00:00Z');
  const matchday3Fixtures = [
    { home: 'Gambia', away: 'Mali', time: matchday3Date },
    { home: 'Guinea', away: 'Senegal', time: new Date('2025-01-21T21:00:00Z') },
    { home: 'Mauritania', away: 'Algeria', time: new Date('2025-01-22T15:00:00Z') },
    { home: 'Angola', away: 'Burkina Faso', time: new Date('2025-01-22T18:00:00Z') },
    { home: 'Ghana', away: 'Egypt', time: new Date('2025-01-22T21:00:00Z') }
  ];

  const allFixtures = [...matchday1Fixtures, ...matchday2Fixtures, ...matchday3Fixtures];

  const teamMap = new Map(teams.map(t => [t.name, t]));

  for (const f of allFixtures) {
    const homeTeam = teamMap.get(f.home);
    const awayTeam = teamMap.get(f.away);
    
    if (homeTeam && awayTeam) {
      const fixture = await prisma.fixture.create({
        data: {
          kickoffAt: f.time,
          status: 'NS',
          homeTeamId: homeTeam.id,
          awayTeamId: awayTeam.id
        }
      });
      fixtures.push(fixture);
    }
  }
  console.log(`✅ Created ${fixtures.length} fixtures\n`);

  // Create Slates grouped by date
  console.log('Creating slates...');
  const slateData = [
    {
      name: 'Matchday 1 - January 13-14',
      dateLocal: new Date('2025-01-13'),
      fixtureTimes: matchday1Fixtures.map(f => new Date(f.time))
    },
    {
      name: 'Matchday 2 - January 17-18',
      dateLocal: new Date('2025-01-17'),
      fixtureTimes: matchday2Fixtures.map(f => new Date(f.time))
    },
    {
      name: 'Matchday 3 - January 21-22',
      dateLocal: new Date('2025-01-21'),
      fixtureTimes: matchday3Fixtures.map(f => new Date(f.time))
    }
  ];

  const slates = [];
  for (const data of slateData) {
    const lockAt = new Date(Math.min(...data.fixtureTimes.map(t => t.getTime())));
    
    const slate = await prisma.slate.create({
      data: {
        name: data.name,
        dateLocal: data.dateLocal,
        lockAt,
        status: 'OPEN'
      }
    });
    slates.push(slate);
  }
  console.log(`✅ Created ${slates.length} slates\n`);

  // Link fixtures to slates
  console.log('Linking fixtures to slates...');
  const matchday1FixtureIds = fixtures.slice(0, 5).map(f => f.id);
  const matchday2FixtureIds = fixtures.slice(5, 10).map(f => f.id);
  const matchday3FixtureIds = fixtures.slice(10, 15).map(f => f.id);

  const slateFixtures = [];
  for (const fixtureId of matchday1FixtureIds) {
    slateFixtures.push({ slateId: slates[0].id, fixtureId });
  }
  for (const fixtureId of matchday2FixtureIds) {
    slateFixtures.push({ slateId: slates[1].id, fixtureId });
  }
  for (const fixtureId of matchday3FixtureIds) {
    slateFixtures.push({ slateId: slates[2].id, fixtureId });
  }

  for (const sf of slateFixtures) {
    await prisma.slateFixture.create({
      data: sf
    });
  }
  console.log(`✅ Created ${slateFixtures.length} slate-fixture links\n`);

  // Summary
  console.log('📊 Seed Summary:');
  console.log(`   - Teams: ${teams.length}`);
  console.log(`   - Players: ${totalPlayers}`);
  console.log(`   - Fixtures: ${fixtures.length}`);
  console.log(`   - Slates: ${slates.length}`);
  console.log(`   - Slate-Fixture Links: ${slateFixtures.length}`);
  console.log('\n🎉 Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

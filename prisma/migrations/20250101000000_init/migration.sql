-- CreateEnum
CREATE TYPE "FixtureStatus" AS ENUM ('NS', 'LIVE', 'FT');
CREATE TYPE "SlateStatus" AS ENUM ('OPEN', 'LOCKED', 'SCORED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Entry" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Entry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fixture" (
    "id" TEXT NOT NULL,
    "kickoffAt" TIMESTAMP(3) NOT NULL,
    "status" "FixtureStatus" NOT NULL DEFAULT 'NS',
    "homeTeamId" TEXT NOT NULL,
    "awayTeamId" TEXT NOT NULL,
    CONSTRAINT "Fixture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Slate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dateLocal" TIMESTAMP(3) NOT NULL,
    "lockAt" TIMESTAMP(3) NOT NULL,
    "status" "SlateStatus" NOT NULL DEFAULT 'OPEN',
    CONSTRAINT "Slate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SlateFixture" (
    "slateId" TEXT NOT NULL,
    "fixtureId" TEXT NOT NULL,
    CONSTRAINT "SlateFixture_pkey" PRIMARY KEY ("slateId","fixtureId")
);

-- CreateTable
CREATE TABLE "SlateLineup" (
    "id" TEXT NOT NULL,
    "entryId" TEXT NOT NULL,
    "slateId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lockedAt" TIMESTAMP(3),
    CONSTRAINT "SlateLineup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SlateLineupPick" (
    "id" TEXT NOT NULL,
    "lineupId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "isCaptain" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "SlateLineupPick_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerFixtureStat" (
    "id" TEXT NOT NULL,
    "fixtureId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "minutes" INTEGER NOT NULL DEFAULT 0,
    "goals" INTEGER NOT NULL DEFAULT 0,
    "assists" INTEGER NOT NULL DEFAULT 0,
    "cleanSheet" BOOLEAN NOT NULL DEFAULT false,
    "goalsConceded" INTEGER NOT NULL DEFAULT 0,
    "saves" INTEGER NOT NULL DEFAULT 0,
    "pensSaved" INTEGER NOT NULL DEFAULT 0,
    "pensMissed" INTEGER NOT NULL DEFAULT 0,
    "yellow" INTEGER NOT NULL DEFAULT 0,
    "red" INTEGER NOT NULL DEFAULT 0,
    "ownGoal" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "PlayerFixtureStat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SlateEntryPoints" (
    "lineupId" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "computedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SlateEntryPoints_pkey" PRIMARY KEY ("lineupId")
);

-- CreateTable
CREATE TABLE "EntryTotalPoints" (
    "entryId" TEXT NOT NULL,
    "total" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "EntryTotalPoints_pkey" PRIMARY KEY ("entryId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "Entry_userId_key" ON "Entry"("userId");
CREATE UNIQUE INDEX "Team_name_key" ON "Team"("name");
CREATE UNIQUE INDEX "Player_teamId_name_key" ON "Player"("teamId", "name");
CREATE UNIQUE INDEX "Slate_dateLocal_key" ON "Slate"("dateLocal");
CREATE UNIQUE INDEX "SlateLineup_entryId_slateId_key" ON "SlateLineup"("entryId", "slateId");
CREATE UNIQUE INDEX "SlateLineupPick_lineupId_playerId_key" ON "SlateLineupPick"("lineupId", "playerId");
CREATE UNIQUE INDEX "PlayerFixtureStat_fixtureId_playerId_key" ON "PlayerFixtureStat"("fixtureId", "playerId");

-- AddForeignKey
ALTER TABLE "Entry" ADD CONSTRAINT "Entry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fixture" ADD CONSTRAINT "Fixture_homeTeamId_fkey" FOREIGN KEY ("homeTeamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Fixture" ADD CONSTRAINT "Fixture_awayTeamId_fkey" FOREIGN KEY ("awayTeamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SlateFixture" ADD CONSTRAINT "SlateFixture_slateId_fkey" FOREIGN KEY ("slateId") REFERENCES "Slate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "SlateFixture" ADD CONSTRAINT "SlateFixture_fixtureId_fkey" FOREIGN KEY ("fixtureId") REFERENCES "Fixture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SlateLineup" ADD CONSTRAINT "SlateLineup_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "Entry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "SlateLineup" ADD CONSTRAINT "SlateLineup_slateId_fkey" FOREIGN KEY ("slateId") REFERENCES "Slate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SlateLineupPick" ADD CONSTRAINT "SlateLineupPick_lineupId_fkey" FOREIGN KEY ("lineupId") REFERENCES "SlateLineup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "SlateLineupPick" ADD CONSTRAINT "SlateLineupPick_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerFixtureStat" ADD CONSTRAINT "PlayerFixtureStat_fixtureId_fkey" FOREIGN KEY ("fixtureId") REFERENCES "Fixture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "PlayerFixtureStat" ADD CONSTRAINT "PlayerFixtureStat_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SlateEntryPoints" ADD CONSTRAINT "SlateEntryPoints_lineupId_fkey" FOREIGN KEY ("lineupId") REFERENCES "SlateLineup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntryTotalPoints" ADD CONSTRAINT "EntryTotalPoints_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "Entry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

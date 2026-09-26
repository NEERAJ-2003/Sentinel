-- CreateTable
CREATE TABLE "Run" (
    "id" TEXT NOT NULL,
    "bob_task_id" TEXT NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended_at" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'active',

    CONSTRAINT "Run_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "run_id" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "metadata" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "previous_hash" TEXT NOT NULL,
    "event_hash" TEXT NOT NULL,
    "risk_level" TEXT NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Approval" (
    "id" SERIAL NOT NULL,
    "event_id" INTEGER NOT NULL,
    "decision" TEXT NOT NULL,
    "approved_by" TEXT NOT NULL,
    "reason" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Approval_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationResult" (
    "id" SERIAL NOT NULL,
    "run_id" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL,
    "failed_event_id" INTEGER,
    "verified_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VerificationResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Run_bob_task_id_key" ON "Run"("bob_task_id");

-- CreateIndex
CREATE UNIQUE INDEX "Approval_event_id_key" ON "Approval"("event_id");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_run_id_fkey" FOREIGN KEY ("run_id") REFERENCES "Run"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Approval" ADD CONSTRAINT "Approval_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationResult" ADD CONSTRAINT "VerificationResult_run_id_fkey" FOREIGN KEY ("run_id") REFERENCES "Run"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

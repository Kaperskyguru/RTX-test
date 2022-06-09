-- CreateTable
CREATE TABLE "Fact" (
    "id" CHAR(36) NOT NULL DEFAULT gen_random_uuid(),

    CONSTRAINT "Fact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "mobileNum" TEXT,
    "email" TEXT,
    "password" TEXT,
    "address" TEXT,
    "lat" DOUBLE PRECISION,
    "long" DOUBLE PRECISION,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Orders" (
    "id" TEXT NOT NULL,
    "providerID" TEXT NOT NULL DEFAULT '',
    "items" TEXT[],
    "prices" TEXT[],
    "history" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderHistory" (
    "id" TEXT NOT NULL,
    "uID" TEXT NOT NULL,
    "pID" TEXT NOT NULL,
    "items" TEXT[],
    "total" TEXT NOT NULL,

    CONSTRAINT "OrderHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Provider" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "mobileNum" TEXT,
    "email" TEXT,
    "password" TEXT,
    "address" TEXT,
    "lat" DOUBLE PRECISION,
    "long" DOUBLE PRECISION,
    "stars" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Provider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProviderInStockItems" (
    "id" TEXT NOT NULL,
    "items" TEXT[],
    "prices" TEXT[],

    CONSTRAINT "ProviderInStockItems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProviderOrder" (
    "id" TEXT NOT NULL,
    "providerID" TEXT NOT NULL,
    "userID" TEXT NOT NULL,
    "accepted" BOOLEAN DEFAULT false,
    "history" BOOLEAN DEFAULT false,
    "items" TEXT[],
    "prices" TEXT[],
    "quatities" TEXT[],
    "total" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ProviderOrder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_mobileNum_key" ON "User"("mobileNum");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Provider_mobileNum_key" ON "Provider"("mobileNum");

-- CreateIndex
CREATE UNIQUE INDEX "Provider_email_key" ON "Provider"("email");

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_id_fkey" FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderHistory" ADD CONSTRAINT "OrderHistory_uID_fkey" FOREIGN KEY ("uID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderInStockItems" ADD CONSTRAINT "ProviderInStockItems_id_fkey" FOREIGN KEY ("id") REFERENCES "Provider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderOrder" ADD CONSTRAINT "ProviderOrder_providerID_fkey" FOREIGN KEY ("providerID") REFERENCES "Provider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

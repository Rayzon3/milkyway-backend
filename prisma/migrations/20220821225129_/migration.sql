-- CreateTable
CREATE TABLE "GraphData" (
    "id" TEXT NOT NULL,
    "adminID" TEXT NOT NULL,
    "userID" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "dataPoint" INTEGER NOT NULL,
    "dataPintX" INTEGER NOT NULL,
    "dataPointY" INTEGER NOT NULL,

    CONSTRAINT "GraphData_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GraphData" ADD CONSTRAINT "GraphData_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GraphData" ADD CONSTRAINT "GraphData_adminID_fkey" FOREIGN KEY ("adminID") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

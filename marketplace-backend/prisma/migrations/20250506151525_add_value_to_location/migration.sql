/*
  Warnings:

  - You are about to drop the column `professionalId` on the `Location` table. All the data in the column will be lost.
  - Made the column `city` on table `Location` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Location" DROP CONSTRAINT "Location_professionalId_fkey";

-- DropIndex
DROP INDEX "Location_professionalId_key";

-- AlterTable
ALTER TABLE "Location" DROP COLUMN "professionalId",
ADD COLUMN     "country" TEXT NOT NULL DEFAULT 'Argentina',
ADD COLUMN     "postalCode" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "province" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "city" SET NOT NULL;

-- AlterTable
ALTER TABLE "Professional" ADD COLUMN     "locationId" INTEGER;

-- AddForeignKey
ALTER TABLE "Professional" ADD CONSTRAINT "Professional_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

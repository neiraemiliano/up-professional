-- AlterTable
ALTER TABLE "Professional" ADD COLUMN     "emergencyService" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "insurance" TEXT,
ADD COLUMN     "languages" JSONB,
ADD COLUMN     "responseTime" INTEGER,
ADD COLUMN     "satisfactionRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "workingHours" TEXT;

-- CreateTable
CREATE TABLE "Certification" (
    "id" SERIAL NOT NULL,
    "professionalId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "issuer" TEXT,
    "issueDate" TIMESTAMP(3),
    "expiryDate" TIMESTAMP(3),
    "certificateUrl" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Certification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Specialty" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "categoryId" INTEGER,
    "description" TEXT,
    "icon" TEXT,

    CONSTRAINT "Specialty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfessionalSpecialty" (
    "id" SERIAL NOT NULL,
    "professionalId" INTEGER NOT NULL,
    "specialtyId" INTEGER NOT NULL,
    "yearsExperience" INTEGER,
    "isMain" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ProfessionalSpecialty_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Specialty_name_key" ON "Specialty"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ProfessionalSpecialty_professionalId_specialtyId_key" ON "ProfessionalSpecialty"("professionalId", "specialtyId");

-- AddForeignKey
ALTER TABLE "Certification" ADD CONSTRAINT "Certification_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "Professional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Specialty" ADD CONSTRAINT "Specialty_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfessionalSpecialty" ADD CONSTRAINT "ProfessionalSpecialty_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "Professional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfessionalSpecialty" ADD CONSTRAINT "ProfessionalSpecialty_specialtyId_fkey" FOREIGN KEY ("specialtyId") REFERENCES "Specialty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

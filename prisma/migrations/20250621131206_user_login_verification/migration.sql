-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastLoginAttempt" TIMESTAMP(3),
ADD COLUMN     "loginAttempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "verificationCode" TEXT,
ADD COLUMN     "verificationCodeExpires" TIMESTAMP(3);

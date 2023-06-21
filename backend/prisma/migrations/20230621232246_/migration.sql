/*
  Warnings:

  - You are about to drop the `product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `price` on the `control` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `control` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `control` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `control` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `user` table. All the data in the column will be lost.
  - Added the required column `control` to the `control` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "product";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "message" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "message" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "message_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_control" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "control" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "control_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_control" ("created_at", "id", "userId") SELECT "created_at", "id", "userId" FROM "control";
DROP TABLE "control";
ALTER TABLE "new_control" RENAME TO "control";
CREATE TABLE "new_user" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL
);
INSERT INTO "new_user" ("created_at", "email", "id", "password") SELECT "created_at", "email", "id", "password" FROM "user";
DROP TABLE "user";
ALTER TABLE "new_user" RENAME TO "user";
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

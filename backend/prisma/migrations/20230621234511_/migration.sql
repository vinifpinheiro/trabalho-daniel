/*
  Warnings:

  - You are about to drop the column `username` on the `message` table. All the data in the column will be lost.
  - Added the required column `title` to the `message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `messageId` to the `control` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_message" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "likes" INTEGER NOT NULL,
    "published" BOOLEAN NOT NULL,
    "created_at" DATETIME NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "message_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_message" ("created_at", "id", "likes", "message", "published", "quantity", "userId") SELECT "created_at", "id", "likes", "message", "published", "quantity", "userId" FROM "message";
DROP TABLE "message";
ALTER TABLE "new_message" RENAME TO "message";
CREATE TABLE "new_control" (
    "messageId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "control" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL,
    "quantity" INTEGER NOT NULL,
    "likes" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "control_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "control_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "message" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_control" ("control", "created_at", "id", "likes", "quantity", "type", "userId") SELECT "control", "created_at", "id", "likes", "quantity", "type", "userId" FROM "control";
DROP TABLE "control";
ALTER TABLE "new_control" RENAME TO "control";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

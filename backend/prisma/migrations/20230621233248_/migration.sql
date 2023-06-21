/*
  Warnings:

  - Added the required column `quantity` to the `message` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_message" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "message" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "likes" INTEGER NOT NULL,
    "published" BOOLEAN NOT NULL,
    "created_at" DATETIME NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "message_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_message" ("created_at", "id", "likes", "message", "published", "userId") SELECT "created_at", "id", "likes", "message", "published", "userId" FROM "message";
DROP TABLE "message";
ALTER TABLE "new_message" RENAME TO "message";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

/*
  Warnings:

  - Added the required column `quantity` to the `control` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_control" (
    "type" TEXT NOT NULL,
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "control" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL,
    "quantity" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "control_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_control" ("control", "created_at", "id", "type", "userId") SELECT "control", "created_at", "id", "type", "userId" FROM "control";
DROP TABLE "control";
ALTER TABLE "new_control" RENAME TO "control";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

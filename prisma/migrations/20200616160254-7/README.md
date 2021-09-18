# Migration `20200616160254-7`

This migration has been generated by Elias Bundala at 6/16/2020, 4:02:54 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."Bid" ALTER COLUMN "state" SET DEFAULT E'PENDING';

ALTER TABLE "public"."Order" ALTER COLUMN "state" SET DEFAULT E'PENDING';

ALTER TABLE "public"."TokenOrder" ALTER COLUMN "state" SET DEFAULT E'PENDING';

ALTER TABLE "public"."Transaction" ALTER COLUMN "state" SET DEFAULT E'PENDING';

ALTER TABLE "public"."User" DROP COLUMN "name",
DROP COLUMN "passwordHash",
ADD COLUMN "displayName" text  NOT NULL ,
ADD COLUMN "emailVerified" boolean  NOT NULL ,
ADD COLUMN "phoneNumber" text  NOT NULL ,
ALTER COLUMN "role" SET DEFAULT E'USER';

CREATE UNIQUE INDEX "User.phoneNumber" ON "public"."User"("phoneNumber")
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200616160035-6..20200616160254-7
--- datamodel.dml
+++ datamodel.dml
@@ -2,34 +2,34 @@
 // learn more about it in the docs: https://pris.ly/d/prisma-schema
 datasource db {
   provider = "postgresql"
-  url = "***"
+  url      = env("DATABASE_URL")
 }
 generator client {
   provider = "prisma-client-js"
 }
 model User {
-  id           Int          @default(autoincrement()) @id
-  uid          String       @unique
-  email        String       @unique
-  displayName         String
-  phoneNumber String
+  id            Int          @default(autoincrement()) @id
+  uid           String       @unique
+  email         String       @unique
+  displayName   String
+  phoneNumber   String       @unique
   emailVerified Boolean
-  avator       File         @relation(fields: [avatorId], references: [id])
-  avatorId     Int
-  role         Role         @default(USER)
-  expertise    Expertise[]
-  jobs         Job[]
-  bids         Bid[]
-  chats        Chat[]
-  createdAt    DateTime     @default(now())
-  updatedAt    DateTime     @updatedAt
-  Chat         Chat[]       @relation("chat_author")
-  Message      Message[]
-  TokenOrder   TokenOrder[]
+  avator        File         @relation(fields: [avatorId], references: [id])
+  avatorId      Int
+  role          Role         @default(USER)
+  expertise     Expertise[]
+  jobs          Job[]
+  bids          Bid[]
+  chats         Chat[]
+  createdAt     DateTime     @default(now())
+  updatedAt     DateTime     @updatedAt
+  Chat          Chat[]       @relation("chat_author")
+  Message       Message[]
+  TokenOrder    TokenOrder[]
 }
 model Expertise {
   id        Int      @default(autoincrement()) @id
@@ -167,5 +167,5 @@
   REJECTED
   APPROVED
   COMPLETED
   ARCHIVED
-}
+}
```


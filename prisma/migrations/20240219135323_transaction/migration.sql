-- CreateTable
CREATE TABLE "Follow" (
    "id" TEXT NOT NULL,
    "digest" TEXT NOT NULL,
    "follower" TEXT NOT NULL,
    "following" TEXT NOT NULL,
    "following_id" TEXT NOT NULL,
    "following_profile" TEXT NOT NULL,
    "follower_id" TEXT NOT NULL,
    "follower_profile" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Follow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Access" (
    "id" TEXT NOT NULL,
    "digest" TEXT NOT NULL,
    "access_id" TEXT NOT NULL,
    "transaction_id" TEXT NOT NULL,
    "transaction_digest" TEXT NOT NULL,
    "profile_id" TEXT NOT NULL,
    "accessor_profile" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "package_id" TEXT NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Access_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "digest" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "public_content" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "profile_id" TEXT NOT NULL,
    "transaction_id" TEXT NOT NULL,
    "pool_id" TEXT NOT NULL,
    "package_id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "digest" TEXT NOT NULL,
    "profile_id" TEXT NOT NULL,
    "profile_pool_id" TEXT NOT NULL,
    "profile_meta_id" TEXT NOT NULL,
    "global_id" TEXT NOT NULL,
    "package_id" TEXT NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" BOOLEAN,
    "image" TEXT,
    "type" TEXT,
    "provider" TEXT NOT NULL,
    "oauth_token" TEXT,
    "oauth_token_secret" TEXT,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "address" TEXT NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL,
    "profile" TEXT,
    "status" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Follow_follower_following_type_status_key" ON "Follow"("follower", "following", "type", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Access_digest_key" ON "Access"("digest");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_digest_key" ON "Transaction"("digest");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_transaction_id_key" ON "Transaction"("transaction_id");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_pool_id_key" ON "Transaction"("pool_id");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_address_key" ON "Profile"("address");

-- CreateIndex
CREATE UNIQUE INDEX "Account_providerAccountId_provider_address_status_key" ON "Account"("providerAccountId", "provider", "address", "status");

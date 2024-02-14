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
    "type" TEXT NOT NULL DEFAULT 'follow',
    "create_at" TIMESTAMP(3) NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Follow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Unfollow" (
    "id" TEXT NOT NULL,
    "digest" TEXT NOT NULL,
    "follower" TEXT NOT NULL,
    "following" TEXT NOT NULL,
    "following_id" TEXT NOT NULL,
    "following_profile" TEXT NOT NULL,
    "follower_id" TEXT NOT NULL,
    "follower_profile" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'unfollow',
    "create_at" TIMESTAMP(3) NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Unfollow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccessBought" (
    "id" TEXT NOT NULL,
    "digest" TEXT NOT NULL,
    "access_id" TEXT NOT NULL,
    "transaction_id" TEXT NOT NULL,
    "transaction_digest" TEXT NOT NULL,
    "profile_id" TEXT NOT NULL,
    "accessor_profile" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'buy',
    "address" TEXT NOT NULL,
    "package_id" TEXT NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "AccessBought_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccessSold" (
    "id" TEXT NOT NULL,
    "digest" TEXT NOT NULL,
    "access_id" TEXT NOT NULL,
    "transaction_id" TEXT NOT NULL,
    "transaction_digest" TEXT NOT NULL,
    "profile_id" TEXT NOT NULL,
    "accessor_profile" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'sell',
    "address" TEXT NOT NULL,
    "package_id" TEXT NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "AccessSold_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "digest" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "public_content" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "profile_id" TEXT NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransactionMeta" (
    "id" TEXT NOT NULL,
    "digest" TEXT NOT NULL,
    "transaction_id" TEXT NOT NULL,
    "pool_id" TEXT NOT NULL,
    "profile_id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "package_id" TEXT NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TransactionMeta_pkey" PRIMARY KEY ("id")
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
CREATE UNIQUE INDEX "Follow_follower_following_status_key" ON "Follow"("follower", "following", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Unfollow_follower_following_status_key" ON "Unfollow"("follower", "following", "status");

-- CreateIndex
CREATE UNIQUE INDEX "AccessBought_digest_key" ON "AccessBought"("digest");

-- CreateIndex
CREATE UNIQUE INDEX "AccessBought_access_id_key" ON "AccessBought"("access_id");

-- CreateIndex
CREATE UNIQUE INDEX "AccessBought_transaction_digest_address_status_key" ON "AccessBought"("transaction_digest", "address", "status");

-- CreateIndex
CREATE UNIQUE INDEX "AccessSold_digest_key" ON "AccessSold"("digest");

-- CreateIndex
CREATE UNIQUE INDEX "AccessSold_access_id_key" ON "AccessSold"("access_id");

-- CreateIndex
CREATE UNIQUE INDEX "AccessSold_transaction_digest_address_status_key" ON "AccessSold"("transaction_digest", "address", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_digest_key" ON "Transaction"("digest");

-- CreateIndex
CREATE UNIQUE INDEX "TransactionMeta_digest_key" ON "TransactionMeta"("digest");

-- CreateIndex
CREATE UNIQUE INDEX "TransactionMeta_transaction_id_key" ON "TransactionMeta"("transaction_id");

-- CreateIndex
CREATE UNIQUE INDEX "TransactionMeta_pool_id_key" ON "TransactionMeta"("pool_id");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_address_key" ON "Profile"("address");

-- CreateIndex
CREATE UNIQUE INDEX "Account_providerAccountId_provider_address_status_key" ON "Account"("providerAccountId", "provider", "address", "status");

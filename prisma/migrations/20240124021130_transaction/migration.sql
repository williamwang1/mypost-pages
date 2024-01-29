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
    "create_at" TIMESTAMP(3) NOT NULL,
    "status" BOOLEAN NOT NULL,

    CONSTRAINT "Follow_pkey" PRIMARY KEY ("id")
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
    "address" TEXT NOT NULL,
    "package_id" TEXT NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL,
    "status" BOOLEAN NOT NULL,

    CONSTRAINT "AccessBought_pkey" PRIMARY KEY ("id")
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
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
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

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Follow_follower_following_key" ON "Follow"("follower", "following");

-- CreateIndex
CREATE UNIQUE INDEX "AccessBought_digest_key" ON "AccessBought"("digest");

-- CreateIndex
CREATE UNIQUE INDEX "AccessBought_access_id_key" ON "AccessBought"("access_id");

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
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

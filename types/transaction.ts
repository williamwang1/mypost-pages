

interface TransactionCreated {
    transaction_id: string,
    pool_id: string,
    profile_id: string,
    timestamp_ms: string
}

interface AccessBought {
    access_id: string,
    transaction_id: string,
    profile_id: string,
    price: string,
    buyer: string,
    transaction_digest: string,
    timestamp_ms: string
}

interface AccessSold {
    access_id: string,
    transaction_id: string,
    profile_id: string,
    price: string,
    seller: string,
    transaction_digest: string,
    timestamp_ms: string
}

interface TransactionMetaData {
    id: string,
    digest: string,
    transaction_id: string,
    pool_id: string,
    profile_id: string,
    address: string,
    package_id: string,
    create_at: Date,
}

interface AccesstData {
    id: string,
    digest: string,
    access_id: string,
    transaction_id: string,
    transaction_digest: string,
    profile_id: string,
    accessor_profile: string,
    price: string,
    address: string,
    package_id: string,
    create_at: Date,
    status: boolean
}



interface AccessHistory {
    id: string,
    digest: string,
    access_id: string,
    transaction_id: string,
    transaction_digest: string,
    profile_id: string,
    accessor_profile: string,
    price: string,
    type: string,
    address: string,
    package_id: string,
    create_at: Date,
    status: boolean
}

interface TransactionDetails {
    id: string,
    digest: string,
    summary: string,
    public_content: string,
    address: string,
    profile_id: string,
    pool_id: string,
    create_at: Date
}

interface TransactionList {
    id: string,
    digest: string,
    summary: string,
    public_content: string,
    address: string,
    profile_id: string,
    create_at: Date,
    transaction_id: string,
    pool_id: string,
    package_id: string,
}

export type { TransactionCreated, AccessBought, AccessSold, TransactionMetaData, AccesstData,
    TransactionDetails, TransactionList, AccessHistory}
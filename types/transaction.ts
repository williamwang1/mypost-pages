import { boolean } from "superstruct"


interface TransactionCreated {
    transaction_id: string,
    pool_id: string,
    profile_id: string,
    timestamp_ms: string
}

interface ReplyCreated {
    reply_id: string,
    pool_id: string,
    profile_id: string,
    transaction_digest: string,
    timestamp_ms: string,
}

interface RepostCreated {
    repost_id: string,
    pool_id: string,
    profile_id: string,
    transaction_digest: string,
    timestamp_ms: string,
}

interface RepostAccessBoughtEvent {
    access_id: string,
    repost_id: string,
    profile_id: string,
    pool_id: string,
    buyer: string,
    transaction_digest: string,
    repost_digest: string,
    price: string,
    timestamp_ms: string
}

interface RepostAccessSoldEvent {
    access_id: string,
    repost_id: string,
    profile_id: string,
    pool_id: string,
    seller: string,
    transaction_digest: string,
    repost_digest: string,
    price: string,
    timestamp_ms: string
}

interface ReplyAccessBoughtEvent {
    access_id: string,
    reply_id: string,
    profile_id: string,
    pool_id: string,
    buyer: string,
    transaction_digest: string,
    reply_digest: string,
    price: string,
    timestamp_ms: string
}

interface ReplyAccessSoldEvent {
    access_id: string,
    reply_id: string,
    profile_id: string,
    pool_id: string,
    seller: string,
    transaction_digest: string,
    reply_digest: string,
    price: string,
    timestamp_ms: string
}

interface RepostAccessDB {
    id:                  string,
    digest:              string,
    access_id:           string,  
    repost_id:            string, 
    repost_pool_id:       string,
    repost_digest:        string,
    transaction_digest:  string,
    repost_profile_id:    string,
    price:               string,
    type:                string,
    address:             string,
    package_id:          string,
    create_at:           Date,
    status:              boolean       
}

interface ReplyAccessDB {
    id:                  string,
    digest:              string,
    access_id:           string,  
    reply_id:            string, 
    reply_pool_id:       string,
    reply_digest:        string,
    transaction_digest:  string,
    reply_profile_id:    string,
    price:               string,
    type:                string,
    address:             string,
    package_id:          string,
    create_at:           Date,
    status:              boolean       
}

interface RepostDB {
    id: string,
    digest: string,
    transaction_digest: string,
    public_content: string,
    address: string,
    profile_id: string,
    repost_id: string,
    pool_id: string,
    package_id: string,
    repost_post_id: string,
    transaction_post_id: string,
    type: string
    create_at: Date,
}

interface ReplyDB {
    id: string,
    digest: string,
    transaction_digest: string,
    public_content: string,
    address: string,
    profile_id: string,
    reply_id: string,
    pool_id: string,
    package_id: string,
    reply_post_id: string,
    transaction_post_id: string,
    type: string
    create_at: Date,
}

interface AccessBought {
    access_id: string,
    transaction_id: string,
    profile_id: string,
    pool_id: string,
    price: string,
    buyer: string,
    transaction_digest: string,
    timestamp_ms: string
}

interface AccessSold {
    access_id: string,
    transaction_id: string,
    profile_id: string,
    pool_id: string,
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


interface AccessDB {
    id: string,
    digest: string,
    access_id: string,
    transaction_id: string,
    pool_id: string,
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

interface TransactionDB {
    id: string,
    digest: string,
    summary: string,
    public_content: string,
    address: string,
    profile_id: string,
    transaction_id: string,
    pool_id: string,
    package_id: string,
    post_id: string,
    type: string
    create_at: Date,
}

interface TransactionDBList {
    id: string,
    digest: string,
    transaction_digest: string,
    public_content: string,
    address: string,
    profile_id: string,
    transaction_id: string,
    pool_id: string,
    package_id: string,
    transaction_post_id: string,
    dependent_post_id: string,
    type: string
    create_at: Date,
}

export type { TransactionCreated, AccessBought, AccessSold, TransactionMetaData, 
    TransactionDetails, TransactionDB, AccessDB, ReplyCreated, 
    ReplyAccessBoughtEvent, ReplyAccessSoldEvent, ReplyDB, RepostDB, 
    RepostAccessDB, RepostAccessBoughtEvent, RepostAccessSoldEvent, ReplyAccessDB, RepostCreated, TransactionDBList}
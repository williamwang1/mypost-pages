
interface ProfileEvents {
    events: ProfileMetadataCreated[],
    address: string
}

interface ProfileMetadataCreated {
    id: string,
    for: string,
    pool: string,
    timestamp_ms:string
}

interface ProfileDB {
    id: string,
    address: string,
    digest: string,
    profile_id: string,
    profile_pool_id: string,
    profile_meta_id: string,
    global_id: string,
    package_id: string,
    create_at: Date,
}

interface ProfileData {
    data: ProfileObjectData,
}

interface ProfileObjectData {
    objectId: string,
    version: string,
    digest: string,
    type: string,
    owner: Owner,
    previousTransaction: string,
    storageRebate: string
    display: Display,
    content: Content,
    bcs: BCS
}

interface BCS {
    dataType: string,
    type: string,
    hasPublicTransfer: boolean,
    version: number,
    bcsBytes: string,
}

interface Content {
    dataType: string,
    type: string,
    hasPublicTransfer: boolean,
    fields: Fields
}

interface Fields {
    avatar: string,
    bio: string,
    followers: Follows,
    followings: Follows,
    id: ID,
    name: string,
    no_of_followers: string,
    no_of_followings: string,
    owner: string
}

interface Follows {
    type: string,
    fields: FollowFields,
}

interface FollowFields {
    id: ID,
    size: string
}

interface ID {
    id: string,
}

interface Owner {
    AddressOwner: string
}

interface Display {
    data: string,
    error: string
}


export type { ProfileEvents, ProfileMetadataCreated, ProfileDB, ProfileData }
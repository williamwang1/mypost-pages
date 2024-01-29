


interface FollowMetaData {
    following_id:  string,
    following_profile: string,
    follower_id:      string
    follower_profile:  string
    price:            string,
    create_at:         Date,
    deleted :           boolean
}

interface FollowData {
    id: string,
    following_id:  string,
    following_profile: string,
    follower_id:      string,
    follower_profile:  string,
    follower:          string,
    following:         string,
    price:            string,
    create_at:         Date,
    status :           boolean
}

export type { FollowMetaData, FollowData }
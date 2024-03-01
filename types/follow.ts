


interface FollowCreated {
    following_id:  string,
    following_profile: string,
    following:       string,
    follower_id:      string,
    follower_profile:  string,
    follower:          string,
    price:            string,
    timestamp_ms:     string
}

interface FollowData {
    id: string,
    digest: string,
    following_id:  string,
    following_profile: string,
    follower_id:      string,
    follower_profile:  string,
    follower:          string,
    following:         string,
    price:            string,
    type:             string,
    create_at:         Date,
    status :           boolean
}

export type { FollowCreated, FollowData }
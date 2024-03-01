import { Infer, array, boolean, coerce, integer, object, string } from "superstruct";

export const ProfileRequest = object({
  name: string(),
  global: string(),
  bio: string(),
  avatar: string()
})
export type ProfileRequest = Infer<typeof ProfileRequest>

export const FollowRequest = object({
  price: string(),
  budget: string(),
  coin_count: string(),
  protocol_destination: string(),
  global: string(),
  my_profile: string(),
  following_pool: string(),
  follower_pool: string()
})
export type FollowRequest = Infer<typeof FollowRequest>

export const UnFollowRequest = object({
  protocol_destination: string(),
  global: string(),
  my_profile: string(),
  following_pool: string(),
  follower_pool: string()
})
export type UnFollowRequest = Infer<typeof UnFollowRequest>

export const CheckProfileRequest = object({
  address: string(),
  global: string()
})

export type CheckProfileRequest = Infer<typeof CheckProfileRequest>

export const CheckProfileResult = object({
  meta_id: string(),
  pool_id: string(),
  profile_id: string(),
  exist: boolean()
})

export type CheckProfileResult = Infer<typeof CheckProfileResult>;

export const CheckProfileResponse = object({
  ...CheckProfileResult.schema,
  txDigest: string(),
});
export type CheckProfileResponse = Infer<typeof CheckProfileResponse>;

export const PublishRequest = object({
  name: string()
})
export type PublishRequest = Infer<typeof PublishRequest>

export const TransactionRequest = object({
  pool: string(),
  content: string()
})
export type TransactionRequest = Infer<typeof TransactionRequest>

export const ReplyRequest = object({
  pool: string(),
  content: string(),
  transaction_digest: string()
})
export type ReplyRequest = Infer<typeof ReplyRequest>

export const RepostRequest = object({
  pool: string(),
  content: string(),
  transaction_digest: string()
})

export type RepostRequest = Infer<typeof RepostRequest>

export const ReplyBuyRequest = object({
  price: string(),
  budget: string(),
  coin_count: string(),
  protocol_destination: string(),
  transaction_digest: string(),
  reply_digest: string(),
  pool: string()
})
export type ReplyBuyRequest = Infer<typeof ReplyBuyRequest>

export const BuyRequest = object({
  price: string(),
  budget: string(),
  coin_count: string(),
  protocol_destination: string(),
  transaction_digest: string(),
  pool: string()
})
export type BuyRequest = Infer<typeof BuyRequest>

export const SellRequest = object({
  protocol_destination: string(),
  transaction_digest: string(),
  pool: string()
})
export type SellRequest = Infer<typeof SellRequest>

export const ReplySellRequest = object({
  protocol_destination: string(),
  transaction_digest: string(),
  reply_digest: string(),
  pool: string()
})
export type ReplySellRequest = Infer<typeof ReplySellRequest>

export const RepostResponse = object({
  txDigest: string(),
  repost_id: string(),
  profile_id: string(),
  pool_id: string()
});
export type RepostResponse = Infer<typeof RepostResponse>

export const ReplyResponse = object({
  txDigest: string(),
  reply_id: string(),
  profile_id: string(),
  pool_id: string()
});
export type ReplyResponse = Infer<typeof ReplyResponse>

export const TransactionResponse = object({
  txDigest: string(),
  transaction_id: string(),
  profile_id: string(),
  pool_id: string()
});
export type TransactionResponse = Infer<typeof TransactionResponse>

export const CommonResponse = object({
  txDigest: string(),
})

export type CommonResponse = Infer<typeof CommonResponse>


export const AddRequest = object({
  x: integer(),
  y: integer(),
});
export type AddRequest = Infer<typeof AddRequest>;

export const AddResult = object({
  result: coerce(integer(), string(), (value) => parseInt(value)),
});
export type AddResult = Infer<typeof AddResult>;

export const AddResponse = object({
  ...AddResult.schema,
  txDigest: string(),
});
export type AddResponse = Infer<typeof AddResponse>;

export const RecentTxsResponse = object({
  txDigests: array(string())
});
export type RecentTxsResponse = Infer<typeof RecentTxsResponse>;

export const ProfileEventsRes = object({
  events: array(),
  address: string()
});

export type ProfileEventsRes = Infer<typeof ProfileEventsRes>

import {
  ApiError,
  WithKeyPair,
  apiTxExecMutationFn,
} from "@shinami/nextjs-zklogin/client";
import {
  UseMutationResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Struct, mask, unknown } from "superstruct";
import {
  AddRequest,
  AddResponse,
  ProfileRequest,
  PublishRequest,
  RecentTxsResponse,
  TransactionRequest,
  CheckProfileRequest,
  TransactionResponse,
  CheckProfileResponse,
  BuyRequest,
  SellRequest,
  CommonResponse,
  FollowRequest,
  UnFollowRequest,
  ReplyResponse,
  RepostResponse,
  ReplyRequest,
  ReplyBuyRequest,
  ReplySellRequest,
  RepostRequest,
  RepostBuyRequest,
  RepostSellRequest,
} from "../shared/interfaces";
import { PROFILE_MUTATE_ROUTE, PROFILE_CREATE_ROUTE, 
  TRANSACTION_MUTATE_ROUTE, PROFILe_CHECk_ROUTE, BUY_MUTATE_ROUTE, SELL_MUTATE_ROUTE, FOLLOW_MUTATE_ROUTE, UNFOLLOW_MUTATE_ROUTE, REPLY_MUTATE_ROUTE, REPOST_SELL_MUTATE_ROUTE, REPLY_BUY_MUTATE_ROUTE, REPOST_BUY_MUTATE_ROUTE, REPLY_SELL_MUTATE_ROUTE, REPOST_MUTATE_ROUTE } from '@/lib/api/constant'

/**
 * An example mutation to execute a Sui transaction.
 *
 * The mutation presents itself as a simple request / response. Under the hood, it's done in 3 steps:
 * - Call /api/add/tx to construct a sponsored transaction block.
 * - Sign the transaction block with the local ephemeral key pair.
 * - Call /api/add/exec to assemble the zkLogin signature and execute the signed transaction block.
 */
export function useAddMutation(): UseMutationResult<
  AddResponse,
  ApiError,
  AddRequest & WithKeyPair
> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: apiTxExecMutationFn({
      baseUri: () => "/api/add",
      body: ({ keyPair, ...req }) => req,
      resultSchema: AddResponse,
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["api", "recent_txs"] });
    },
  });
}

export function useProfileMutation(): UseMutationResult<
  CommonResponse,
  ApiError,
  ProfileRequest & WithKeyPair
> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: apiTxExecMutationFn({
      baseUri: () => `${PROFILE_MUTATE_ROUTE}`,
      body: ({ keyPair, ...req }) => req,
      resultSchema: CommonResponse,
    }),
    onSuccess: ({txDigest}) => {
      console.log('success ' + txDigest)
      //qc.invalidateQueries({ queryKey: ["api", "recent_txs"] });
    },
  });
}

export function usePublishMutation(): UseMutationResult<
  unknown,
  ApiError,
  WithKeyPair
> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: apiTxExecMutationFn({
      baseUri: () => `${PROFILE_CREATE_ROUTE}`,
      body: ({ keyPair, ...req }) => req,
      //resultSchema: Struct<unknown, unknown>,
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["api", "recent_txs"] });
    },
  });
}

/**
 * An example query to fetch recent transactions from the user's wallet address.
 */
export function useRecentTxsQuery() {
  return useQuery({
    queryKey: ["api", "recent_txs"],
    queryFn: async () => {
      const resp = await fetch("/api/recent_txs");
      if (resp.status !== 200)
        throw new Error(`Failed to fetch recent txs. ${resp.status}`);
      return mask(await resp.json(), RecentTxsResponse);
    },
  });
}

export function useRepostMutation(): UseMutationResult<
  RepostResponse, ApiError, RepostRequest & WithKeyPair
> {
  return useMutation({
    mutationFn: apiTxExecMutationFn({
      baseUri: () => `${REPOST_MUTATE_ROUTE}`,
      body: ({ keyPair, ...req }) => req,
      resultSchema: RepostResponse,
    })
  })
}

export function useReplyMutation(): UseMutationResult<
  ReplyResponse, ApiError, ReplyRequest & WithKeyPair
> {
  return useMutation({
    mutationFn: apiTxExecMutationFn({
      baseUri: () => `${REPLY_MUTATE_ROUTE}`,
      body: ({ keyPair, ...req }) => req,
      resultSchema: ReplyResponse,
    })
  })
}

export function useTransactionMutation(): UseMutationResult<
  TransactionResponse, ApiError, TransactionRequest & WithKeyPair
> {
  return useMutation({
    mutationFn: apiTxExecMutationFn({
      baseUri: () => `${TRANSACTION_MUTATE_ROUTE}`,
      body: ({ keyPair, ...req }) => req,
      resultSchema: TransactionResponse,
    })
  })
}

export function useFollowMutation(): UseMutationResult<
CommonResponse, ApiError, FollowRequest & WithKeyPair
> {
  return useMutation({
    mutationFn: apiTxExecMutationFn({
      baseUri: () => `${FOLLOW_MUTATE_ROUTE}`,
      body: ({ keyPair, ...req }) => req,
      resultSchema: CommonResponse,
    })
  })
}

export function useUnfollowMutation(): UseMutationResult<
CommonResponse, ApiError, UnFollowRequest & WithKeyPair
> {
  return useMutation({
    mutationFn: apiTxExecMutationFn({
      baseUri: () => `${UNFOLLOW_MUTATE_ROUTE}`,
      body: ({ keyPair, ...req }) => req,
      resultSchema: CommonResponse,
    })
  })
}

export function useReplyBuyMutation(): UseMutationResult<
CommonResponse, ApiError, ReplyBuyRequest & WithKeyPair
> {
  return useMutation({
    mutationFn: apiTxExecMutationFn({
      baseUri: () => `${REPLY_BUY_MUTATE_ROUTE}`,
      body: ({ keyPair, ...req }) => req,
      resultSchema: CommonResponse,
    })
  })
}

export function useRepostBuyMutation(): UseMutationResult<
CommonResponse, ApiError, RepostBuyRequest & WithKeyPair
> {
  return useMutation({
    mutationFn: apiTxExecMutationFn({
      baseUri: () => `${REPOST_BUY_MUTATE_ROUTE}`,
      body: ({ keyPair, ...req }) => req,
      resultSchema: CommonResponse,
    })
  })
}

export function useBuyMutation(): UseMutationResult<
CommonResponse, ApiError, BuyRequest & WithKeyPair
> {
  return useMutation({
    mutationFn: apiTxExecMutationFn({
      baseUri: () => `${BUY_MUTATE_ROUTE}`,
      body: ({ keyPair, ...req }) => req,
      resultSchema: CommonResponse,
    })
  })
}

export function useReplySellMutation(): UseMutationResult<
  CommonResponse, ApiError, ReplySellRequest & WithKeyPair
> {
  return useMutation({
    mutationFn: apiTxExecMutationFn({
      baseUri: () => `${REPLY_SELL_MUTATE_ROUTE}`,
      body: ({ keyPair, ...req }) => req,
      resultSchema: CommonResponse,
    })
  })
}

export function useRepostSellMutation(): UseMutationResult<
  CommonResponse, ApiError, RepostSellRequest & WithKeyPair
> {
  return useMutation({
    mutationFn: apiTxExecMutationFn({
      baseUri: () => `${REPOST_SELL_MUTATE_ROUTE}`,
      body: ({ keyPair, ...req }) => req,
      resultSchema: CommonResponse,
    })
  })
}

export function useSellMutation(): UseMutationResult<
  CommonResponse, ApiError, SellRequest & WithKeyPair
> {
  return useMutation({
    mutationFn: apiTxExecMutationFn({
      baseUri: () => `${SELL_MUTATE_ROUTE}`,
      body: ({ keyPair, ...req }) => req,
      resultSchema: CommonResponse,
    })
  })
}



export function useProfileCheckMutation(): UseMutationResult<
  CheckProfileResponse,
  ApiError,
  CheckProfileRequest & WithKeyPair
> {
  return useMutation({
    mutationFn: apiTxExecMutationFn({
      baseUri: () => `${PROFILe_CHECk_ROUTE}`,
      body: ({ keyPair, ...req }) => req,
      resultSchema: CheckProfileResponse,
    }),
    // onSuccess: ({txDigest}) => {
    //   console.log('success ' + txDigest)
    //   //qc.invalidateQueries({ queryKey: ["api", "recent_txs"] });
    // },
    // queryKey: ["api", "profile"],
    // queryFn: async () => {
    //   const resp = await fetch("/api/profile/get");
    //   console.log(resp)
    //   if (resp.status !== 200)
    //     throw new Error(`Failed to fetch profile events. ${resp.status}`);
    //   let json = await resp.json();
    //   console.log(json)
    // }
  })
}



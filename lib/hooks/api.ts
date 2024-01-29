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
} from "../shared/interfaces";
import { ProfileMetadataCreated, ProfileEvents } from '@/types/profile'
import { MYPOST_MOVE_PACKAGE_ID, GLOBAL_OBJECT_ID } from '@/lib/api/move'
import prisma from "@/lib/prisma";
import { PROFILE_MUTATE_ROUTE, PROFILE_CREATE_ROUTE, 
  TRANSACTION_MUTATE_ROUTE, PROFILe_CHECk_ROUTE } from '@/lib/api/constant'

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
  TransactionResponse,
  ApiError,
  ProfileRequest & WithKeyPair
> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: apiTxExecMutationFn({
      baseUri: () => `${PROFILE_MUTATE_ROUTE}`,
      body: ({ keyPair, ...req }) => req,
      resultSchema: TransactionResponse,
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



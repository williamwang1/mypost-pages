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
  TransactionResponse,
} from "../shared/interfaces";

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
      baseUri: () => "/api/profile/create",
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
      baseUri: () => "/api/profile/create",
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

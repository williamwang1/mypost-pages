import { gas, sui } from "@/lib/api/shinami";
import {MYPOST_MOVE_PACKAGE_ID} from '@/lib/api/move'
import { buildGaslessTransactionBytes } from "@shinami/clients";
import { first } from "@/lib/shared/utils";
import {
    GaslessTransactionBytesBuilder,
    InvalidRequest,
    TransactionResponseParser,
    zkLoginSponsoredTxExecHandler,
    zkLoginTxExecHandler,
} from "@shinami/nextjs-zklogin/server/pages";
import { mask, validate } from "superstruct";
import { ProfileRequest, TransactionResponse} from "@/lib/shared/interfaces";


const buildTx: GaslessTransactionBytesBuilder = async (req, { wallet }) => {
    const [error, body] = validate(req.body, ProfileRequest);
    if (error) throw new InvalidRequest(error.message);
  
    console.log("Preparing add tx for zkLogin wallet", wallet);
  
    const gaslessTxBytes = await buildGaslessTransactionBytes({
      sui,
      build: async (txb) => {
        // Source code for this example Move function:
        // https://github.com/shinamicorp/shinami-typescript-sdk/blob/90f19396df9baadd71704a0c752f759c8e7088b4/move_example/sources/math.move#L13
        txb.moveCall({
            target: `${MYPOST_MOVE_PACKAGE_ID}::profile::create_profile_pool`,
            arguments: [
                txb.pure(body.name),
                txb.object(body.global)
            ],
        });
      },
    });
    return { gaslessTxBytes, gasBudget: 500_000_000 };
};


const parseTxRes: TransactionResponseParser<TransactionResponse> = async (_, txRes) => {
    // Requires "showEvents: true" in tx response options.
    const event = first(txRes.events);
    if (!event) throw new Error("Event missing from tx response");
    console.log(JSON.stringify(txRes))
    // const result = mask(event.parsedJson, ProfileResult);
    return { txDigest: txRes.digest };
};


export default zkLoginSponsoredTxExecHandler(sui, gas, buildTx, parseTxRes, {
    showEvents: true,
    showEffects: true,
    showObjectChanges: true,
    showBalanceChanges: true,
});
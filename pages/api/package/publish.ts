import { first } from "@/lib/shared/utils";
import { gas, sui } from "@/lib/api/shinami";
import { AddRequest, AddResponse, AddResult, PublishResponse, PublishResult } from "@/lib/shared/interfaces";
import {
    GaslessTransactionBytesBuilder,
    InvalidRequest,
    TransactionResponseParser,
    zkLoginSponsoredTxExecHandler,
} from "@shinami/nextjs-zklogin/server/pages";
import { buildGaslessTransactionBytes } from "@shinami/clients";
import { mask, validate } from "superstruct";


const buildTx: GaslessTransactionBytesBuilder = async (req, { wallet }) => {
    console.log("Preparing add tx for zkLogin wallet", wallet);
    let modules = {
        modules: ['mypost'],
        dependencies: ['Sui', 'MoveStdlib']
    }
    const gaslessTxBytes = await buildGaslessTransactionBytes({
        sui,
        build: async (txb) => {
            txb.publish(modules);
        }
    })
    return { gaslessTxBytes, gasBudget: 5_000_000 };
}


/**
 * Parses the transaction response.
 */
const parseTxRes: TransactionResponseParser<PublishResponse> = async (_, txRes) => {
    // Requires "showEvents: true" in tx response options.
    const event = first(txRes.events);
    if (!event) throw new Error("Event missing from tx response");
  
    const result = mask(event.parsedJson, PublishResult);
    return { ...result, txDigest: txRes.digest };
};


export default zkLoginSponsoredTxExecHandler(sui, gas, buildTx, parseTxRes, {
    showEvents: true,
});
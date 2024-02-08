import { gas, sui } from "@/lib/api/shinami";
import { MYPOST_MOVE_PACKAGE_ID, GLOBAL_OBJECT_ID, API_HOST } from '@/lib/api/move'
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
import { SellRequest, TransactionRequest, TransactionResponse} from "@/lib/shared/interfaces";
import { ProfileMetadataCreated } from '@/types/profile'
import { FollowMetaData, FollowData } from "@/types/follow";
import { AccessBought, TransactionCreated } from "@/types/transaction";
import { AccessSold } from "@prisma/client";


const buildTx: GaslessTransactionBytesBuilder = async (req, { wallet }) => {
    const [error, body] = validate(req.body, SellRequest);
    if (error) throw new InvalidRequest(error.message);
  
    console.log("Preparing create sell tx for zkLogin wallet", wallet);
  
    const gaslessTxBytes = await buildGaslessTransactionBytes({
      sui,
      build: async (txb) => {
        // Source code for this example Move function:
        // https://github.com/shinamicorp/shinami-typescript-sdk/blob/90f19396df9baadd71704a0c752f759c8e7088b4/move_example/sources/math.move#L13
        txb.moveCall({
            target: `${MYPOST_MOVE_PACKAGE_ID}::transaction::sell`,
            arguments: [
                txb.pure.address(wallet),
                txb.pure(body.transaction_digest),
                txb.object(body.pool),
                txb.object('0x6')
            ],
        });
      },
    });
    return { gaslessTxBytes, gasBudget: 200_000_000 };
};

const parseTxRes: TransactionResponseParser<TransactionResponse> = async (_, txRes, user) => {
    // Requires "showEvents: true" in tx response options.
    const event = first(txRes.events);
    if (!event) throw new Error("Event missing from tx response");

    let accessSold = txRes.events?.at(0)?.parsedJson as AccessSold;
    let soldbody = {
        digest: txRes.digest,
        access_id: accessSold.access_id,
        transaction_id: accessSold.transaction_id,
        transaction_digest: accessSold.transaction_digest,
        profile_id: accessSold.profile_id,
        accessor_profile: accessSold.profile_id,
        price: accessSold.price,
        address: user.wallet,
        package_id: `${MYPOST_MOVE_PACKAGE_ID}`,
    }
    const accessRes = await fetch(`${API_HOST}/api/access/sell/mutatedb`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(soldbody)
    })
    let followJson = await accessRes.json()


    return { txDigest: txRes.digest };
};


export default zkLoginSponsoredTxExecHandler(sui, gas, buildTx, parseTxRes, {
    showEvents: true,
    showEffects: true,
    showObjectChanges: true,
    showBalanceChanges: true,
});
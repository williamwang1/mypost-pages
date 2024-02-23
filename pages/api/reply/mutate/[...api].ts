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
import { CommonResponse, ReplyRequest, TransactionRequest, TransactionResponse} from "@/lib/shared/interfaces";
import { AccessBought, AccesstData, ReplyCreated, TransactionCreated } from "@/types/transaction";
import { ACCESS_MUTATE_FALSE_ROUTE, ACCESS_MUTATE_ROUTE, ACCESS_SELL_FALSE_ROUTE, TRANSACTION_MUTATEDB_ROUTE } from "@/lib/api/constant";


const buildTx: GaslessTransactionBytesBuilder = async (req, { wallet }) => {
    const [error, body] = validate(req.body, ReplyRequest);
    if (error) throw new InvalidRequest(error.message);
  
    console.log("Preparing create tx for zkLogin wallet", wallet);
  
    const gaslessTxBytes = await buildGaslessTransactionBytes({
      sui,
      build: async (txb) => {
        // Source code for this example Move function:
        // https://github.com/shinamicorp/shinami-typescript-sdk/blob/90f19396df9baadd71704a0c752f759c8e7088b4/move_example/sources/math.move#L13
        txb.moveCall({
            target: `${MYPOST_MOVE_PACKAGE_ID}::reply::create`,
            arguments: [
                txb.object(body.profile_pool),
                txb.pure(body.content),
                txb.pure.u64(5000),
                txb.pure('new transction'),
                txb.pure('new reply'),
                txb.object('0x6')
            ],
        });
      },
    });
    return { gaslessTxBytes, gasBudget: 100_000_000 };
};

const parseTxRes: TransactionResponseParser<CommonResponse> = async (_, txRes, user) => {
    // Requires "showEvents: true" in tx response options.
    const event = first(txRes.events);
    if (!event) throw new Error("Event missing from tx response");

    // console.log(events?.length)
    let data = txRes.events?.at(0)?.parsedJson as ReplyCreated;
    let body = {
        digest: txRes.digest,
        summary: '',
        public_content: '',
        address: user.wallet,
        profile_id: data.profile_id,
        //transaction_id: data.transaction_id,
        pool_id: data.pool_id,
        package_id: `${MYPOST_MOVE_PACKAGE_ID}`,
        post_id: '',
        type: 'post',
        create_at: new Date()
    }
    //console.log('request body ' + JSON.stringify(body))
    // update profile data in db
    const txMetaRes = await fetch(`${API_HOST}${TRANSACTION_MUTATEDB_ROUTE}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            },
        body: JSON.stringify(body)
    })
    // console.log(txMetaRes.status)
    // console.log(txMetaRes.statusText)
    if (!txMetaRes.ok) {
        throw new Error(`Error: ${txMetaRes.statusText}`);
    }
    let profileJson = await txMetaRes.json()
    //console.log(profileJson)
    // update access data in db
    let accessBought = txRes.events?.at(1)?.parsedJson as AccessBought;
    let acessSellBody = {
        transaction_digest: accessBought.transaction_digest,
        address: accessBought.buyer,
        type: 'sell',
    }
    const sellRes = await fetch(`${API_HOST}${ACCESS_MUTATE_FALSE_ROUTE}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(acessSellBody)
    })
    let sellJson = await sellRes.json()
    let accessBoughtBody = {
        digest: txRes.digest,
        access_id: accessBought.access_id,
        transaction_id: accessBought.transaction_id,
        transaction_digest: txRes.digest,
        profile_id: accessBought.profile_id,
        accessor_profile: accessBought.profile_id,
        price: accessBought.price,
        type: 'buy',
        address: user.wallet,
        package_id: `${MYPOST_MOVE_PACKAGE_ID}`,
        create_at: new Date()
    }
    const accessRes = await fetch(`${API_HOST}${ACCESS_MUTATE_ROUTE}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(accessBoughtBody)
    })
    let followJson = await accessRes.json()


    return { txDigest: txRes.digest,  profile_id: data.profile_id, pool_id: data.pool_id};
};


export default zkLoginSponsoredTxExecHandler(sui, gas, buildTx, parseTxRes, {
    showEvents: true,
    showEffects: true,
    showObjectChanges: true,
    showBalanceChanges: true,
});
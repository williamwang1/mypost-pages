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
import { CommonResponse, ReplyBuyRequest, RepostBuyRequest } from "@/lib/shared/interfaces";
import { ReplyAccessBoughtEvent, RepostAccessBoughtEvent, TransactionCreated } from "@/types/transaction";
import {  REPLY_ACCESS_MUTATE_FALSE_ROUTE, REPLY_ACCESS_MUTATEDB, REPOST_ACCESS_MUTATE_FALSE_ROUTE, REPOST_ACCESS_MUTATEDB } from "@/lib/api/constant";


const buildTx: GaslessTransactionBytesBuilder = async (req, { wallet }) => {
    const [error, body] = validate(req.body, RepostBuyRequest);
    if (error) throw new InvalidRequest(error.message);
  
    console.log("Preparing create buy tx for zkLogin wallet", wallet);

    let coindata = await sui.getCoins({owner: wallet})

 
    const gaslessTxBytes = await buildGaslessTransactionBytes({
      sui,
      build: async (txb) => {
        // if multip coins, merget into 1 coin first
        let coinObject : any= []
        if (parseInt(body.coin_count) > 1) {
            let len = coindata.data.length;
            let i = 1;
            let base = coindata.data[0].coinObjectId;
            while (i < len) {
                let tobeMerged = coindata.data[i].coinObjectId;
                txb.mergeCoins(txb.object(base), [txb.object(tobeMerged)]);
                i = i + 1;   
            }
        }
        console.log('arguments 1st argument ' + coindata.data[0].coinObjectId + ' ')
        //txb.makeMoveVec({ objects: coinObject })
        txb.moveCall({
            target: `${MYPOST_MOVE_PACKAGE_ID}::repost::buy`,
            arguments: [
                txb.object(coindata.data[0].coinObjectId),
                txb.pure.address(wallet),
                txb.pure(body.transaction_digest),
                txb.pure(body.repost_digest),
                txb.object(body.pool),
                txb.object('0x6')
            ],
        });
      },
    });
    return { gaslessTxBytes, gasBudget: 100_000_000 };
};

const parseTxRes: TransactionResponseParser<CommonResponse> = async (req, txRes, user) => {
    // Requires "showEvents: true" in tx response options.
    const event = first(txRes.events);
    if (!event) throw new Error("Event missing from tx response");

    //console.log('in buy mutate ' + JSON.stringify(req.body))
    // update access data in db
    let accessBought = txRes.events?.at(0)?.parsedJson as RepostAccessBoughtEvent;
    let acessSellBody = {
        repost_digest: accessBought.repost_digest,
        address: accessBought.buyer,
        type: 'sell',
    }
    const sellRes = await fetch(`${API_HOST}${REPOST_ACCESS_MUTATE_FALSE_ROUTE}`, {
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
        repost_id: accessBought.repost_id,
        repost_pool_id: accessBought.pool_id,
        repost_digest: accessBought.repost_digest,
        transaction_digest: txRes.digest,
        repost_profile_id: accessBought.profile_id,
        price: accessBought.price,
        type: 'buy',
        address: user.wallet,
        package_id: `${MYPOST_MOVE_PACKAGE_ID}`,
        create_at: new Date()
    }
    //console.log('in buy mutate ' + JSON.stringify(accessBoughtBody))
    const boughtRes = await fetch(`${API_HOST}${REPOST_ACCESS_MUTATEDB}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(accessBoughtBody)
    })
    let boughtJson = await boughtRes.json()

    return { txDigest: txRes.digest };
};


export default zkLoginSponsoredTxExecHandler(sui, gas, buildTx, parseTxRes, {
    showEvents: true,
    showEffects: true,
    showObjectChanges: true,
    showBalanceChanges: true,
});
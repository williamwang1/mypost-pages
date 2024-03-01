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
import { FollowRequest, CommonResponse, } from "@/lib/shared/interfaces";
import { FollowData } from "@/types/follow";
import { FOLLOW_MUTATEDB_ROUTE, UNFOLLOW_MUTATEFALSE_ROUTE } from "@/lib/api/constant";


const buildTx: GaslessTransactionBytesBuilder = async (req, { wallet }) => {
    const [error, body] = validate(req.body, FollowRequest);
    if (error) throw new InvalidRequest(error.message);
  
    console.log("Preparing create buy tx for zkLogin wallet", wallet);

    let coindata = await sui.getCoins({owner: wallet})

 
    const gaslessTxBytes = await buildGaslessTransactionBytes({
      sui,
      build: async (txb) => {
        // if multip coins, merget into 1 coin first
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
        txb.moveCall({
            target: `${MYPOST_MOVE_PACKAGE_ID}::profile::follow`,
            arguments: [
                txb.object(coindata.data[0].coinObjectId),
                txb.pure.address(wallet),
                txb.object(body.global),
                txb.object(body.my_profile),
                txb.object(body.following_pool),
                txb.object(body.follower_pool),
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

    let followEventData = txRes.events?.at(0)?.parsedJson as FollowData;
    let body = {
        follower: followEventData.follower,
        following: followEventData.following,
        type: 'unfollow',
    }
    const sellRes = await fetch(`${API_HOST}${UNFOLLOW_MUTATEFALSE_ROUTE}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    })
    let sellJson = await sellRes.json()
    let followBody = {
        follower: followEventData.follower,
        following: followEventData.following,
        follower_profile: followEventData.follower_profile,
        follower_id: followEventData.follower_id,
        following_profile: followEventData.following_profile,
        following_id: followEventData.following_id,
        price: followEventData.price,
        type: 'follow',
        digest: txRes.digest,
        create_at: new Date()
    }
    const followRes = await fetch(`${API_HOST}${FOLLOW_MUTATEDB_ROUTE}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(followBody)
    })
    let followJson = await followRes.json()

    return { txDigest: txRes.digest };
};


export default zkLoginSponsoredTxExecHandler(sui, gas, buildTx, parseTxRes, {
    showEvents: true,
    showEffects: true,
    showObjectChanges: true,
    showBalanceChanges: true,
});
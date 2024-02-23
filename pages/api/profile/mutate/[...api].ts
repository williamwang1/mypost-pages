import { gas, sui } from "@/lib/api/shinami";
import { MYPOST_MOVE_PACKAGE_ID, GLOBAL_OBJECT_ID, API_HOST } from '@/lib/api/move'
import { buildGaslessTransactionBytes } from "@shinami/clients";
import { first } from "@/lib/shared/utils";
import prisma from "@/lib/prisma";
import {
    GaslessTransactionBytesBuilder,
    InvalidRequest,
    TransactionResponseParser,
    zkLoginSponsoredTxExecHandler,
    zkLoginTxExecHandler,
} from "@shinami/nextjs-zklogin/server/pages";
import { mask, validate } from "superstruct";
import { CommonResponse, ProfileRequest, TransactionResponse} from "@/lib/shared/interfaces";
import { ProfileMetadataCreated } from '@/types/profile'
import { FollowMetaData, FollowData } from "@/types/follow";
import { FOLLOW_MUTATEDB_ROUTE, PROFILE_MUTATEDB_ROUTE } from "@/lib/api/constant";

// interface ProfileMeataEvent {
//     id:             string
//     for:            string 
//     pool:           string
// }

const buildTx: GaslessTransactionBytesBuilder = async (req, { wallet }) => {
    const [error, body] = validate(req.body, ProfileRequest);
    if (error) throw new InvalidRequest(error.message);
  
    console.log("Preparing create profile tx for zkLogin wallet", wallet);
  
    const gaslessTxBytes = await buildGaslessTransactionBytes({
      sui,
      build: async (txb) => {
        // Source code for this example Move function:
        // https://github.com/shinamicorp/shinami-typescript-sdk/blob/90f19396df9baadd71704a0c752f759c8e7088b4/move_example/sources/math.move#L13
        txb.moveCall({
            target: `${MYPOST_MOVE_PACKAGE_ID}::profile::create_profile_pool`,
            arguments: [
                txb.pure(body.name),
                txb.pure(body.bio),
                txb.pure(body.avatar),
                txb.object(body.global),
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

    let events = txRes.events?.filter((event) => {
        let result = false
        if(event.type === `${MYPOST_MOVE_PACKAGE_ID}::profile::ProfileMetaDataCreated`) {
            result = true
        }
        //event.type == `${MYPOST_MOVE_PACKAGE_ID}::profile::ProfileMetaDataCreated`
        // let type2 = event.type.includes('::profile::ProfileMetaDataCreated')
        // let type3 = event.type.endsWith('::profile::ProfileMetaDataCreated');
        // console.log(event.type + ' ' + " " + type2 + ' ' + type3)
        return result
    })
    // console.log(events?.length)
    let data = txRes.events?.at(0)?.parsedJson as ProfileMetadataCreated;
    //console.log('profile metadata ' + JSON.stringify(data))
    let body = {
        package_id: `${MYPOST_MOVE_PACKAGE_ID}`,
        profile_id: data.for,
        profile_meta_id: data.id,
        profile_pool_id: data.pool,
        global_id: `${GLOBAL_OBJECT_ID}`,
        address: user.wallet,
        digest: txRes.digest,
        create_at: new Date()
    }
    // update profile data in db
    const profileRes = await fetch(`${API_HOST}${PROFILE_MUTATEDB_ROUTE}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            },
        body: JSON.stringify(body)
    })
    if (!profileRes.ok) {
        throw new Error(`Error: ${profileRes.status}`);
    }
    let profileJson = await profileRes.json()
    console.log('in profile mutate ' + JSON.stringify(profileJson))
    // update follow data in db
    let followEventData = txRes.events?.at(1)?.parsedJson as FollowData;
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
    if (!followRes.ok) {
        throw new Error(`Error: ${profileRes.status}`);
    }
    let followJson = await followRes.json()
    console.log('in profile mutate ' + JSON.stringify(followJson))
    return { txDigest: txRes.digest };
};


export default zkLoginSponsoredTxExecHandler(sui, gas, buildTx, parseTxRes, {
    showEvents: true,
    showEffects: true,
    showObjectChanges: true,
    showBalanceChanges: true,
});
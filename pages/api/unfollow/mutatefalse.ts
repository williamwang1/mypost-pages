
import prisma from "@/lib/prisma";
import { ProfileMedata } from "@/types/profile";
import { AccesstData } from "@/types/transaction";
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse) {

    // if (!session.user) {
    //     return res.status(401).json({ error: "Unauthorized" });
    // }
    let result;
    try {
        result = await prisma.$queryRaw`update "Follow" f
            set status = false
            where f.follower = ${req.body.follower} and f.following=${req.body.following}
            and type = ${req.body.type};`
            
        console.log('in unfollow mutate false ' + JSON.stringify(result))


        res.status(200).json( result )
      } catch (err) {
        res.status(500).json({ err })
      }

}
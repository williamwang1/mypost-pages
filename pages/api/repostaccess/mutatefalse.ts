
import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse) {

    // if (!session.user) {
    //     return res.status(401).json({ error: "Unauthorized" });
    // }
    let result;
    try {
        result = await prisma.$queryRaw`update "RepostAccess" a
            set status = false
            where a.repost_digest = ${req.body.repost_digest} and a.address=${req.body.address}
            and type = ${req.body.type};`
        console.log('in reply access mutate false ' + JSON.stringify(result))
        res.status(200).json( result )
      } catch (err) {
        res.status(500).json({ err })
      }

}
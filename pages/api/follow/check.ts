
import prisma from "@/lib/prisma";
import { Account } from "@/types/auth";
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse) {

    // if (!session.user) {
    //     return res.status(401).json({ error: "Unauthorized" });
    // }
    // console.log('in check ' + req.body.address)
    // console.log('in check ' + req.body.transaction_digest)
    try {
        //console.log('in chcek ' + req.body.address)
        let accesses = await prisma.$queryRaw`SELECT * from "Follow" f
        where f.follower=${req.body.follower} and f.following=${req.body.following}
        and f.Status=true and f.Type='follow' ORDER BY f.Create_at DESC`
        res.status(200).json( accesses )
      } catch (err) {
        res.status(500).json({ err })
      }

}
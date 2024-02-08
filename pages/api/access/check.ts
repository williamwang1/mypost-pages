
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
        // const access: any = await prisma.accessBought.findMany({
        //     where: {
        //         address: req.body.address,
        //         transaction_digest: req.body.transaction_digest,
        //         // status: true
        //         // digest:''
        //     }
        // });
        //console.log('in chcek ' + req.body.address)
        let accesses = await prisma.$queryRaw`SELECT * from "AccessBought" at 
        where at.Address=${req.body.address} 
        and at.Transaction_digest=${req.body.slug} and Status=true`
        res.status(200).json( accesses )
      } catch (err) {
        res.status(500).json({ err })
      }

}
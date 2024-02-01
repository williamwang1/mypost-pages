import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from "@/lib/prisma";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse) {
        
        let digest = req.body.slug;

        try {
            //console.log(req.body.slug)
            let transactions = await prisma.$queryRaw`select t.id, t.Digest, t.Summary, t.Public_content, t.Address, 
            t.Profile_id, t.Create_at, tm.Transaction_id, tm.Pool_id, tm.address, tm.Package_id 
            from "Transaction" t, "TransactionMeta" tm
            where t.digest = tm.digest and tm.digest=${digest};`
            
            //console.log('in get ' + JSON.stringify(transactions))

            res.status(200).json( transactions )

        } catch(err) {
            res.status(500).json({ err })
        }
    }
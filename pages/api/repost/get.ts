import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from "@/lib/prisma";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse) {
        

        try {
            //console.log(req.body.slug)
            const tx = await prisma.repost.findUnique({
                where: {
                    digest: req.body.repost_digest
                }
            })
            
            // let transactions = await prisma.$queryRaw`select t.id, t.Digest, t.Summary, t.Public_content, t.Address, 
            // t.Profile_id, t.Create_at, t.Transaction_id, t.Pool_id, t.address, t.Package_id 
            // from "Transaction" t
            // where t.digest=${digest};`
            
            console.log('in repost get ' + JSON.stringify(tx))

            res.status(200).json( tx )

        } catch(err) {
            res.status(500).json({ err })
        }
    }
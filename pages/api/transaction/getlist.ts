import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from "@/lib/prisma";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse) {
        
        let pageSzie = 5;
        let pageNumber = req.body.currentPage - 1;
        let offset = pageNumber * pageSzie;
        console.log('in transaction getlist ' + req.body.currentPage)
        try {
            //console.log('in transaction list ' + req.body.slug)
            let transactions = await prisma.$queryRaw`select t.id, t.Digest, t.Summary, t.Public_content, t.Address, 
            t.Profile_id, t.Create_at, t.Transaction_id, t.Pool_id, t.address, t.Package_id 
            from "Transaction" t
            where t.address = ${req.body.slug} order by t.Create_at desc limit ${pageSzie} offset ${offset};`
            
            //console.log('in get list' + JSON.stringify(transactions))

            res.status(200).json( transactions )

        } catch(err) {
            res.status(500).json({ err })
        }
    }
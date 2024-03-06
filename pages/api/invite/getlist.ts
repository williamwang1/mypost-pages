import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from "@/lib/prisma";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse) {
        
        let pageSzie = 20;
        let pageNumber = req.body.currentPage - 1;
        let offset = pageNumber * pageSzie;
        console.log('in invite getlist ' + req.body.currentPage)
        try {
            //console.log('in transaction list ' + req.body.slug)
            let transactions = await prisma.$queryRaw`select * 
            from "Invite" i
            where i.create_by = ${req.body.address} order by i.Create_at desc limit ${pageSzie} offset ${offset};`
            
            //console.log('in get list' + JSON.stringify(transactions))

            res.status(200).json( transactions )

        } catch(err) {
            res.status(500).json({ err })
        }
    }
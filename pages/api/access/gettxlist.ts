import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from "@/lib/prisma";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse) {
        
        let pageSize = 20;
        let pageNumber = req.body.currentPage - 1;
        let offset = pageNumber * pageSize;
        console.log('in access lit ' + req.body.currentPage)
        try {
            //console.log(req.body.slug)
            let accesses = await prisma.$queryRaw`SELECT *
            FROM "Access" at where at.Transaction_digest = ${req.body.slug}
            ORDER BY at.Create_at DESC
            LIMIT ${pageSize} OFFSET ${offset};`

            //console.log('in get list' + JSON.stringify(accesses))

            res.status(200).json( accesses )

        } catch(err) {
            res.status(500).json({ err })
        }
    }
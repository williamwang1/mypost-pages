import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from "@/lib/prisma";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse) {
        
        let pageSzie = 5;
        let pageNumber = req.body.currentPage - 1;
        let offset = pageNumber * pageSzie;

        try {
            //console.log(req.body.slug)
            let followers = await prisma.$queryRaw`select * from "Follow" f
            where f.following = ${req.body.slug} and f.status=true order by f.Create_at desc limit ${pageSzie} offset ${offset};`
            
            //console.log('in get list' + JSON.stringify(followers))

            res.status(200).json( followers )

        } catch(err) {
            res.status(500).json({ err })
        }
    }
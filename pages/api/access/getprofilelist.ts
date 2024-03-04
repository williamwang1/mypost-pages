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
            // let accesses = await prisma.$queryRaw`SELECT *
            // FROM "Access" at where at.Address = ${req.body.slug}
            // ORDER BY at.Create_at DESC
            // LIMIT ${pageSize} OFFSET ${offset};`

            let accesses = await prisma.$queryRaw`select a.id, a.digest, a.transaction_digest as transaction_digest, a.transaction_digest as dependent_digest,
            a.profile_id, a.transaction_id, a.access_id, a.pool_id, a.package_id, a.price, a.address, a.type, a.create_at
            from "Access" a
            where a.Address = ${req.body.slug} and a.Status = true
            union all
            select ra.id, ra.digest, ra.reply_digest as transaction_digest, ra.transaction_digest as dependent_digest, 
            ra.reply_profile_id as profile_id, ra.reply_id as transaction_id, ra.access_id, ra.reply_pool_id as pool_id, ra.package_id, ra.price, ra.address,
            ra.type, ra.create_at
            from "ReplyAccess" ra
            where ra.Address = ${req.body.slug} and ra.Status = true
            union all
            select raa.id, raa.digest, raa.repost_digest as transaction_digest, raa.transaction_digest as dependent_digest, 
            raa.repost_profile_id as profile_id, raa.repost_id as transaction_id, raa.access_id, raa.repost_pool_id as pool_id, raa.package_id, raa.price,
            raa.address, raa.type, raa.create_at
            from "RepostAccess" raa
            where raa.Address = ${req.body.slug} and raa.Status = true
            order by create_at desc limit ${pageSize} offset ${offset};`
            
            //console.log('in get list' + JSON.stringify(accesses))

            res.status(200).json( accesses )

        } catch(err) {
            res.status(500).json({ err })
        }
    }
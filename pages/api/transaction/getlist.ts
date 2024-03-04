import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from "@/lib/prisma";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse) {
        
        let pageSzie = 20;
        let pageNumber = req.body.currentPage - 1;
        let offset = pageNumber * pageSzie;
        console.log('in transaction getlist ' + req.body.currentPage)
        try {
            //console.log('in transaction list ' + req.body.slug)
            let transactions = await prisma.$queryRaw`select t.id, t.digest, t.digest as transaction_digest, t.public_content, t.address,
            t.profile_id, t.transaction_id, t.pool_id, t.package_id, t.post_id as transaction_post_id,
            t.post_id as dependent_post_id, t.type, t.create_at
            from "Transaction" t
            where address = ${req.body.slug}
            union all
            select r.id, r.digest, r.transaction_digest, r.public_content, r.address,
            r.profile_id, r.reply_id as transaction_id, r.pool_id, r.package_id, r.transaction_post_id,
            r.reply_post_id as dependent_post_id, r.type, r.create_at
            from "Reply" r
            where address = ${req.body.slug}
            union all
            select rp.id, rp.digest, rp.transaction_digest, rp.public_content, rp.address,
            rp.profile_id, rp.repost_id as transaction_id, rp.pool_id, rp.package_id, rp.transaction_post_id,
            rp.repost_post_id as dependent_post_id, rp.type, rp.create_at
            from "Repost" rp
            where address = ${req.body.slug} 
            order by create_at desc limit ${pageSzie} offset ${offset};`
            
            //console.log('in get list' + JSON.stringify(transactions))

            res.status(200).json( transactions )

        } catch(err) {
            res.status(500).json({ err })
        }
    }
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from "@/lib/prisma";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse) {
        let digest = req.body.digest
        try {
            console.log('in transaction get ' + digest)
            // if (type === 'post') {
            //     tx = await prisma.transaction.findUnique({
            //         where: {
            //             digest: req.body.digest
            //         }
            //     })
            // } else if (type === 'reply') {
            //     tx = await prisma.reply.findUnique({
            //         where: {
            //             digest: req.body.digest
            //         }
            //     })
            // } else if (type === 'repost') {
            //     tx = await prisma.repost.findUnique({
            //         where: {
            //             digest: req.body.digest
            //         }
            //     })
            // } else {
            //     tx = await prisma.transaction.findUnique({
            //         where: {
            //             digest: req.body.digest
            //         }
            //     })
            // }

            let transaction = await prisma.$queryRaw`select t.id, t.digest, t.digest as transaction_digest, t.public_content, t.address,
            t.profile_id, t.transaction_id, t.pool_id, t.package_id, t.post_id as transaction_post_id,
            t.post_id as dependent_post_id, t.type, t.create_at
            from "Transaction" t
            where digest = ${req.body.digest}
            union all
            select r.id, r.digest, r.transaction_digest, r.public_content, r.address,
            r.profile_id, r.reply_id as transaction_id, r.pool_id, r.package_id, r.transaction_post_id,
            r.reply_post_id as dependent_post_id, r.type, r.create_at
            from "Reply" r
            where digest = ${req.body.digest}
            union all
            select rp.id, rp.digest, rp.transaction_digest, rp.public_content, rp.address,
            rp.profile_id, rp.repost_id as transaction_id, rp.pool_id, rp.package_id, rp.transaction_post_id,
            rp.repost_post_id as dependent_post_id, rp.type, rp.create_at
            from "Repost" rp
            where digest = ${req.body.digest} `
            
            
            // let transactions = await prisma.$queryRaw`select t.id, t.Digest, t.Summary, t.Public_content, t.Address, 
            // t.Profile_id, t.Create_at, t.Transaction_id, t.Pool_id, t.address, t.Package_id 
            // from "Transaction" t
            // where t.digest=${digest};`
            
            //console.log('in tansaction get ' + JSON.stringify(tx))

            res.status(200).json( transaction )

        } catch(err) {
            res.status(500).json({ err })
        }
    }
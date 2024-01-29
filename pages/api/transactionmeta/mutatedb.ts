
import prisma from "@/lib/prisma";
import { ProfileMedata } from "@/types/profile";
import { TransactionMetaData } from "@/types/transaction";
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse) {

    // if (!session.user) {
    //     return res.status(401).json({ error: "Unauthorized" });
    // }
    let result;
    try {
        const tx: TransactionMetaData | null = await prisma.transactionMeta.findUnique({
            where: {
                digest: req.body.digest,
            }
        });
        console.log('mutatedb transaction meata db ' + JSON.stringify(tx))
        if (tx) {
            result = await prisma.transactionMeta.update({
                where: {
                    digest: tx.digest
                },
                data: {
                    package_id: req.body.package_id,
                    profile_id: req.body.profile_id,
                    pool_id: req.body.pool_id,
                    transaction_id: req.body.transaction_id,
                    digest: req.body.digest,
                    address: req.body.address,
                }
            })
        } else {
            result = await prisma.transactionMeta.create({
                data: {
                    package_id: req.body.package_id,
                    profile_id: req.body.profile_id,
                    pool_id: req.body.pool_id,
                    transaction_id: req.body.transaction_id,
                    digest: req.body.digest,
                    address: req.body.address,
                    create_at: new Date()
                }
            })
            //console.log(JSON.stringify(result))
        }
        res.status(200).json( result )
      } catch (err) {
        res.status(500).json({ err })
      }

}

import prisma from "@/lib/prisma";
import { ProfileMedata } from "@/types/profile";
import { TransactionData } from "@/types/transaction";
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse) {

    // if (!session.user) {
    //     return res.status(401).json({ error: "Unauthorized" });
    // }
    let result;
    try {
        console.log('address in transaction mutatedb ' + req.body.address)
        const transaction: TransactionData | null = await prisma.transaction.findUnique({
            where: {
                digest: req.body.digest,
            }
        });
        console.log('mutatedb transaction db ' + JSON.stringify(transaction))
        if (transaction) {
            result = await prisma.transaction.update({
                where: {
                    digest: transaction.digest
                },
                data: {
                    profile_id: req.body.profile_id,
                    summary: req.body.summary,
                    public_content: req.body.public_content,
                    address: req.body.address,
                }
            })
        } else {
            result = await prisma.transaction.create({
                data: {
                    digest: req.body.digest,
                    profile_id: req.body.profile_id,
                    summary: req.body.summary,
                    public_content: req.body.public_content,
                    address: req.body.address,
                    create_at: new Date()
                }

            })
        }
        res.status(200).json( result )
      } catch (err) {
        res.status(500).json({ err })
      }

}
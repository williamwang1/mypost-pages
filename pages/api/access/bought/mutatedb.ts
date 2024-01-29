
import prisma from "@/lib/prisma";
import { ProfileMedata } from "@/types/profile";
import { AccessBoughtData } from "@/types/transaction";
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse) {

    // if (!session.user) {
    //     return res.status(401).json({ error: "Unauthorized" });
    // }
    let result;
    try {
        // console.log(req.body.address)
        const access: AccessBoughtData | null = await prisma.accessBought.findUnique({
            where: {
                digest: req.body.digest,
            }
        });
        console.log('mutatedb accessbought db ' + JSON.stringify(access))
        if (access) {
            result = await prisma.accessBought.update({
                where: {
                    digest: access.digest
                },
                data: {
                    access_id: req.body.access_id,
                    package_id: req.body.package_id,
                    transaction_id: req.body.transaction_id,
                    transaction_digest: req.body.transaction_digest,
                    profile_id: req.body.profile_id,
                    accessor_profile: req.body.accessor_profile,
                    price: req.body.price,
                    address: req.body.address,
                }
            })
        } else {
            result = await prisma.accessBought.create({
                data: {
                    digest: req.body.digest,
                    access_id: req.body.access_id,
                    package_id: req.body.package_id,
                    transaction_id: req.body.transaction_id,
                    transaction_digest: req.body.transaction_digest,
                    profile_id: req.body.profile_id,
                    accessor_profile: req.body.accessor_profile,
                    price: req.body.price,
                    address: req.body.address,
                    create_at: new Date(),
                    status: true
                }

            })
        }
        res.status(200).json( result )
      } catch (err) {
        res.status(500).json({ err })
      }

}
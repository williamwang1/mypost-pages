
import prisma from "@/lib/prisma";
import { ProfileMedata } from "@/types/profile";
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse) {

    // if (!session.user) {
    //     return res.status(401).json({ error: "Unauthorized" });
    // }
    let result;
    try {
        console.log(req.body.address)
        const profile: ProfileMedata | null = await prisma.profile.findUnique({
            where: {
                address: req.body.address,
            }
        });
        console.log('mutatedb profile db ' + JSON.stringify(profile))
        if (profile) {
            result = await prisma.profile.update({
                where: {
                    id: profile.id
                },
                data: {
                    digest: req.body.digest,
                    package_id: req.body.package_id,
                    profile_id: req.body.profile_id,
                    profile_meta_id: req.body.profile_meta_id,
                    profile_pool_id: req.body.profile_pool_id,
                    global_id: req.body.global_id
                }
            })
        } else {
            result = await prisma.profile.create({
                data: {
                    digest: req.body.digest,
                    package_id: req.body.package_id,
                    profile_id: req.body.profile_id,
                    profile_meta_id: req.body.profile_meta_id,
                    profile_pool_id: req.body.profile_pool_id,
                    global_id: req.body.global_id,
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
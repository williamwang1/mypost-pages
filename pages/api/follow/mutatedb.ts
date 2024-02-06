
import prisma from "@/lib/prisma";
import { ProfileMedata } from "@/types/profile";
import { FollowData } from "@/types/follow";
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from "next-auth";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse) {

    // if (!session.user) {
    //     return res.status(401).json({ error: "Unauthorized" });
    // }
    let result;
    try {
        let followers: FollowData[] = await prisma.$queryRaw`select * from "Follow" f
        where f.following = ${ req.body.following} and f.follower = ${req.body.follower} and f.status=true order by f.Create_at desc`
        // const follow: FollowData | null = await prisma.follow.findUnique({
        //     where: {
        //         // follower_following: {
        //         //     follower: req.body.follower,
        //         //     following: req.body.following
        //         // }
        //         follower_following_status: {
        //             follower: req.body.follower,
        //             following: req.body.following,
        //             status: true
        //         }
                
        //     }
        // });
        console.log('mutate follow db ' + JSON.stringify(followers))
        if (followers && followers.length > 1) {
            result = await prisma.follow.update({
                where: {
                    id: followers[0].id
                },
                data: {
                    follower_profile: req.body.follower_profile,
                    follower_id: req.body.follower_id,
                    following_profile: req.body.following_profile,
                    following_id: req.body.following_id,
                    price: req.body.price
                }
            })
        } else {
            result = await prisma.follow.create({
                data: {
                    follower: req.body.follower,
                    digest: req.body.digest,
                    following: req.body.following,
                    follower_profile: req.body.follower_profile,
                    follower_id: req.body.follower_id,
                    following_profile: req.body.following_profile,
                    following_id: req.body.following_id,
                    price: req.body.price,
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
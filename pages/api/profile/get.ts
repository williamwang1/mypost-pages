
import prisma from "@/lib/prisma";
import { Account } from "@/types/auth";
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from "next-auth";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse) {

    // if (!session.user) {
    //     return res.status(401).json({ error: "Unauthorized" });
    // }
    
    try {
        const profile: any = await prisma.profile.findUnique({
            where: {
                address: req.body.slug,
            }
        });
        console.log('in profile get api ' + JSON.stringify(profile))
        res.status(200).json( profile )
      } catch (err) {
        res.status(500).json({ err })
      }

}
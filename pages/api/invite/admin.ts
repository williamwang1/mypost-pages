
import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse) {

    // if (!req.session.user) {
    //     return res.status(401).json({ error: "Unauthorized" });
    // }
    let result;
    try {
            result = await prisma.invite.create({
                data: {
                    create_by: 'admin',
                    create_at: new Date()
                }
            })
       // }
        res.status(200).json( result )
      } catch (err) {
        res.status(500).json({ err })
      }

}
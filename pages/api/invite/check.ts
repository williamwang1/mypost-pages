
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
            let code = await prisma.invite.findUnique({
                        where: {
                            id: req.body.code,
                        }
                    })
            console.log('in invite check ' + JSON.stringify(code))
            result = await prisma.invite.update({
                where: {
                    id: req.body.code
                },
                data: {
                    code:             req.body.code,
                    update_by:        req.body.address,
                    update_at:        new Date(),
                    used:             true
                }
            })
       // }
        res.status(200).json( code )
      } catch (err) {
        res.status(500).json({ err })
      }

}
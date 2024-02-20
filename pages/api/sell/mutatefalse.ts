
import prisma from "@/lib/prisma";
import { ProfileMedata } from "@/types/profile";
import { AccesstData } from "@/types/transaction";
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse) {

    // if (!session.user) {
    //     return res.status(401).json({ error: "Unauthorized" });
    // }
    let result;
    try {
        result = await prisma.$queryRaw`update "Access" a
            set status = false
            where a.transaction_digest = ${req.body.transaction_digest} and a.address=${req.body.address}
            and type = ${req.body.type};`
            
        console.log('in sell mutate false ' + JSON.stringify(result))
        // const sold: AccesstData[] | null = await prisma.access.findMany({
        //     where: {
        //         transaction_digest: req.body.transaction_digest,
        //         address: req.body.address,
        //         type: req.body.type
        //     }
        // });

        // if (sold) {
        //     await prisma.access.update({
        //         where: {
        //           transaction_digest_type_address_status: {
        //             transaction_digest: req.body.transaction_digest,
        //             address: req.body.address,
        //             type: 'sell',
        //             status: true
        //         } 
        //         },
        //         data: {
        //             status: false
        //         }
        //     })
        // }
        res.status(200).json( result )
    } catch (err) {
        res.status(500).json({ err })
    }

}
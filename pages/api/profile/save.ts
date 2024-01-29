import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from 'next'
import { GLOBAL_OBJECT_ID, MYPOST_MOVE_PACKAGE_ID } from "@/lib/api/move";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse) {
        let body = req.body;
        try {
            let created = await prisma.profile.create({
                data : {
                    profile_meta_id: body.id,
                    address: body.address,
                    profile_id: body.for,
                    profile_pool_id: body.pool,
                    global_id: `${GLOBAL_OBJECT_ID}`,
                    package_id: `${MYPOST_MOVE_PACKAGE_ID}`,
                    create_at: new Date()
                }
            })
            res.status(201).json( 'ok' )
        } catch (err) {
            res.status(500).json({ err })
        }
    }

import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse) {

    // if (!session.user) {
    //     return res.status(401).json({ error: "Unauthorized" });
    // }
    let result;
    try {

        if (req.method === 'POST') {
            const {
                digest,
                access_id,
                repost_id,
                repost_pool_id,
                repost_digest,
                transaction_digest,
                repost_profile_id,
                price,
                type,
                address,     
                package_id,   
                create_at,
            } = req.body;
            console.log('in repost access mutatedb ' + JSON.stringify(req.body))
        
            try {
              const tx = await prisma.repostAccess.upsert({
                where: {
                  // Use your @@unique fields here as a composite identifier
                  digest: digest
                },
                update: {
                  access_id,
                  repost_id,
                  repost_pool_id,
                  repost_digest,
                  transaction_digest,
                  repost_profile_id,
                  price,
                  type,
                  address,     
                  package_id,   
                  create_at,
                },
                create: {
                  // Fields to create a new account if it doesn't exist
                  digest,
                  access_id,
                  repost_id,
                  repost_pool_id,
                  repost_digest,
                  transaction_digest,
                  repost_profile_id,
                  price,
                  type,
                  address,     
                  package_id,   
                  create_at,
                },
              });
              res.status(200).json(tx);
            } catch (error) {
              console.error("Failed to upsert account:", error);
              res.status(500).json({ error: "Failed to upsert transaction" });
            }
        } else {
            // Handle any other HTTP methods
            res.setHeader('Allow', ['POST']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
        }
        res.status(200).json( result )
      } catch (err) {
        res.status(500).json({ err })
      }

}
import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse) {


    // if (!session.user) {
    //     return res.status(401).json({ error: "Unauthorized" });
    // }
    //console.log('in transaction mutatedb ' + req.body.address)
    // let address = req.body.address;
    // let accountId = req.body.providerAccountId;
    // let provider = req.body.provider;
    if (req.method === 'POST') {
        const {
            digest,
            summary,
            public_content,
            address,
            profile_id,
            transaction_id, 
            pool_id,      
            package_id,   
            post_id, 
            type,
            create_at,
        } = req.body;
        console.log('in transaction save or update ' + JSON.stringify(req.body))
    
        try {
          const tx = await prisma.transaction.upsert({
            where: {
              // Use your @@unique fields here as a composite identifier
              digest: digest
            },
            update: {
              // Fields to update if the account exists
              summary,
              public_content,
              address,
              profile_id,
              transaction_id, 
              pool_id,      
              package_id,   
              post_id, 
              type,
              create_at,
            },
            create: {
              // Fields to create a new account if it doesn't exist
              digest,
              summary,
              public_content,
              address,
              profile_id,
              transaction_id, 
              pool_id,      
              package_id,   
              post_id, 
              type,
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

}
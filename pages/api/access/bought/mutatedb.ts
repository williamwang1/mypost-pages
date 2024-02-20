
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
        const sold: AccesstData | null = await prisma.access.findUnique({
            where: {
                transaction_digest_type_address_status: {
                    transaction_digest: req.body.digest,
                    address: req.body.address,
                    type: 'sell',
                    status: true
                } 
            }
        });
        console.log('in buy mutatedb ' + JSON.stringify(sold))
        if (sold) {
            await prisma.access.update({
                where: {
                  transaction_digest_type_address_status: {
                    transaction_digest: req.body.digest,
                    address: req.body.address,
                    type: 'sell',
                    status: true
                } 
                },
                data: {
                    status: false
                }
            })
        } else {
            res.status(500).json({ error: "Failed to upsert transaction" });
        }
        if (req.method === 'POST') {
            const {
                digest,
                access_id,
                transaction_id,
                transaction_digest,
                profile_id,
                accessor_profile,
                price,
                type,
                address,     
                package_id,   
                create_at,
            } = req.body;
            console.log('in buy save or update ' + JSON.stringify(req.body))
        
            try {
              const tx = await prisma.access.upsert({
                where: {
                  // Use your @@unique fields here as a composite identifier
                  transaction_digest_type_address_status: {
                    transaction_digest: digest,
                    address: address,
                    type: 'buy',
                    status: true
                  } 
                },
                update: {
                  // Fields to update if the account exists
                  digest,
                  access_id,
                  transaction_id,
                  transaction_digest,
                  profile_id,
                  accessor_profile,
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
                  transaction_id,
                  transaction_digest,
                  profile_id,
                  accessor_profile,
                  type,
                  price,
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
        // console.log(req.body.address)
        // const access: AccessBoughtData | null = await prisma.accessBought.findUnique({
        //     where: {
        //         digest: req.body.digest,
        //     }
        // });
        // console.log('mutatedb accessbought db ' + JSON.stringify(access))
        // if (access) {
        //     result = await prisma.accessBought.update({
        //         where: {
        //             digest: access.digest
        //         },
        //         data: {
        //             access_id: req.body.access_id,
        //             package_id: req.body.package_id,
        //             transaction_id: req.body.transaction_id,
        //             transaction_digest: req.body.transaction_digest,
        //             profile_id: req.body.profile_id,
        //             accessor_profile: req.body.accessor_profile,
        //             price: req.body.price,
        //             address: req.body.address,
        //         }
        //     })
        // } else {
        //     result = await prisma.accessBought.create({
        //         data: {
        //             digest: req.body.digest,
        //             access_id: req.body.access_id,
        //             package_id: req.body.package_id,
        //             transaction_id: req.body.transaction_id,
        //             transaction_digest: req.body.transaction_digest,
        //             profile_id: req.body.profile_id,
        //             accessor_profile: req.body.accessor_profile,
        //             price: req.body.price,
        //             address: req.body.address,
        //             create_at: new Date(),
        //             status: true
        //         }

        //     })
        // }
        res.status(200).json( result )
      } catch (err) {
        res.status(500).json({ err })
      }

}


import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse) {


    // if (!session.user) {
    //     return res.status(401).json({ error: "Unauthorized" });
    // }
    console.log('in account list ' + req.body.address)
    let address = req.body.address;
    let accountId = req.body.providerAccountId;
    let provider = req.body.provider;
    if (req.method === 'POST') {
        const {
          name,
          email,
          emailVerified,
          image,
          type,
          provider,
          oauth_token,
          oauth_token_secret,
          providerAccountId,
          refresh_token,
          access_token,
          expires_at,
          token_type,
          scope,
          id_token,
          session_state,
          address,
          create_at,
          profile,
          status,
        } = req.body;
        console.log('in account save or update ' + JSON.stringify(req.body))
    
        try {
          const account = await prisma.account.upsert({
            where: {
              // Use your @@unique fields here as a composite identifier
              providerAccountId_provider_address_status: {
                providerAccountId: req.body.providerAccountId,
                provider: req.body.provider,
                address: address,
                status: true
              },
            },
            update: {
              // Fields to update if the account exists
              name,
              email,
              emailVerified,
              image,
              type,
              oauth_token,
              oauth_token_secret,
              refresh_token,
              access_token,
              expires_at,
              token_type,
              scope,
              id_token,
              create_at,
              profile,
              session_state,
            },
            create: {
              // Fields to create a new account if it doesn't exist
              name,
              email,
              emailVerified,
              image,
              type,
              provider,
              oauth_token,
              oauth_token_secret,
              providerAccountId,
              refresh_token,
              access_token,
              expires_at,
              token_type,
              scope,
              id_token,
              session_state,
              address,
              create_at,
              profile,
              status,
            },
          });
          res.status(200).json(account);
        } catch (error) {
          console.error("Failed to upsert account:", error);
          res.status(500).json({ error: "Failed to upsert account" });
        }
      } else {
        // Handle any other HTTP methods
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
      }

}
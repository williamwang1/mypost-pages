// 'use server'
import prisma from "@/lib/prisma";
import { getSession, authOptions } from "../auth/[...nextauth]";
import { Account } from "@/types/auth";
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from "next-auth";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions);

    // if (!session.user) {
    //     return res.status(401).json({ error: "Unauthorized" });
    // }
    
    try {
        const accounts: Account[] = await prisma.account.findMany();
        res.status(200).json( accounts )
      } catch (err) {
        res.status(500).json({ err })
      }

}
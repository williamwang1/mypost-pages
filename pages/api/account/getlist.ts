// 'use server'
import prisma from "@/lib/prisma";
import { getSession, authOptions } from "../auth/[...nextauth]";
import { Account } from "@/types/auth";
import type { NextApiRequest, NextApiResponse } from 'next'



export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse) {


    // if (!session.user) {
    //     return res.status(401).json({ error: "Unauthorized" });
    // }
    //console.log('in account list ' + req.body.slug)
    let address = req.body.slug
    try {
        let accounts = await prisma.$queryRaw`select *
        from "Account" a where address = ${address} and status =true`
        //const accounts: Account[] = await prisma.account.findMany();
        res.status(200).json( accounts )
      } catch (err) {
        res.status(500).json({ err })
      }

}
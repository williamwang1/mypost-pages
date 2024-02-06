// 'use server'
import prisma from "@/lib/prisma";
import { getSession, authOptions } from "../auth/[...nextauth].ts.bk";
import { Account } from "@/types/auth";
import type { NextApiRequest, NextApiResponse } from 'next'



export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse) {


    // if (!session.user) {
    //     return res.status(401).json({ error: "Unauthorized" });
    // }
    console.log('in account list ' + req.body.email)
    let email = req.body.email
    try {
        let accounts = await prisma.$queryRaw`select u.email, u.image, a.id as "AccountId", a.type,
        a.provider, a.status 
        from "User" u, "Account" a
        where a."userId" = u.id and u.email = ${email} and a.status = true;
        `
        //const accounts: Account[] = await prisma.account.findMany();
        res.status(200).json( accounts )
      } catch (err) {
        res.status(500).json({ err })
      }

}
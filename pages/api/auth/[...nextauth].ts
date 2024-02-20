import prisma from "@/lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { getServerSession, type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import TwitterProvider from 'next-auth/providers/twitter';
import { Session } from "@/types/auth";
import {Profile} from '@/types/auth';
import NextAuth from "next-auth";
import type { NextApiRequest, NextApiResponse } from "next"
import { API_HOST } from "@/lib/api/move";
import { ACCOUNT_MUTATE_ROUTE } from "@/lib/api/constant";

let address = ''
let provider = ''
let providerAccountId = ''

export const authOptions: NextAuthOptions = {
    //adapter: PrismaAdapter(prisma),
    providers: [
      TwitterProvider({
        clientId: process.env.TWITTER_CLIENT_ID as string,
        clientSecret: process.env.TWITTER_CLIENT_SECRET as string,
       // version: "2.0",
        authorization: {
          url: 'https://api.twitter.com/oauth/authorize',
          params: {
            force_login: 'true',
          },
        },
      })
    ],
    session: {
      strategy: "jwt"
    },
    jwt: {
      maxAge: 60 * 3,
    },
    callbacks: {
      async signIn({ user, account, profile}) {
          // console.log('in sigin callback ' + JSON.stringify(user))
          //console.log('in sigin callback ' + JSON.stringify(account))
          // console.log('in sigin callback ' + JSON.stringify(profile))
          // console.log('in sigin callback ' + JSON.stringify(email))
          provider = account?.provider as string
          providerAccountId = account?.providerAccountId as string
          let accountBody = {
            name: user.name,
            email: user.email,
            emailVerified: false,
            image: user.image,
            type: account?.type,
            provider: provider,
            oauth_token: account?.oauth_token,
            oauth_token_secret: account?.oauth_token_secret,
            providerAccountId: providerAccountId,
            refresh_token: account?.refresh_token,
            access_token: account?.access_token,
            expires_at: account?.expires_at,
            token_type: account?.token_type,
            scope: account?.scope,
            id_token: account?.id_token,
            session_state: account?.session_state,
            address: address,
            create_at: new Date(),
            profile: JSON.stringify(profile),
            status: true
          }
          await fetch(`${API_HOST}${ACCOUNT_MUTATE_ROUTE}`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(accountBody),
          })
          return true
      },
      async jwt({ token, account, profile}) {
        if (account) {
          //console.log(account.provider)
          switch (account.provider) {
            case 'google':

              token.id_token = account.id_token
              break;
            case 'twitter':
              // Add custom data from Twitter account
              // console.log(JSON.stringify(profile))
              //console.log('in jwt callback ' + JSON.stringify(token))
             // console.log('in jwt callback ' + JSON.stringify(account))
              // console.log('in jwt callback ' + JSON.stringify(profile))
              provider = account?.provider as string
              providerAccountId = account?.providerAccountId as string
              let p: Profile | undefined = profile;
              token.provider = account.provider;
              token.profile = p;
              break;
          }
        }
  
        return token
      },
      async session({ session , user, token}) {
        //console.log('Token ' + JSON.stringify(token.maxEpoch))
        // console.log(ephemeralKeyPair.getPublicKey().toSuiPublicKey());
        // console.log(randomness);
        //console.log('in session callback ' + JSON.stringify(session))
        session.id_token = token.id_token as string;
        session.profile = token.profile as Profile;

        return Promise.resolve(session);
      }
    }
  }
  
export function getSession() {
    return getServerSession(authOptions) as Promise<Session>;
}

//export default NextAuth(authOptions)

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  if (req.body.callbackUrl as string) {
    address = req.body.callbackUrl.split('/').pop()
  }

  //console.log('in nextauth ' + JSON.stringify(req.body.address))

  return await NextAuth(req, res, authOptions)
}
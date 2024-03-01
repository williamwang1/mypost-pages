import { TwitterApi } from 'twitter-api-v2';
import type { NextApiRequest, NextApiResponse } from 'next';
import { API_HOST } from '@/lib/api/move';
import { ACCOUNT_LIST_ROUTE, PROFILE_GET_ROUTE } from '@/lib/api/constant';
import { Account } from "@/types/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Extract the tweet text from the request body
    const { text, post_id, slug } = req.body;
    if (!text) {
      return res.status(400).json({ message: 'Tweet text is required' });
    }
    const accountsdb = await fetch(`${API_HOST}${ACCOUNT_LIST_ROUTE}`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug }),
    })
    const accounts: Account[] = await accountsdb.json()

    // Initialize the Twitter client
    const twitterClient = new TwitterApi({
      appKey: process.env.TWITTER_CLIENT_ID as string,
      appSecret: process.env.TWITTER_CLIENT_SECRET as string,
      accessToken: accounts[0].oauth_token as string,
      accessSecret: accounts[0].oauth_token_secret as string
    });

    const rwClient = twitterClient.readWrite;
    // Post the tweet
    const response = await rwClient.v2.reply(text, post_id);
    console.log('in twiiter api ' + JSON.stringify(response))
    res.status(200).json({ success: true, data: response });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

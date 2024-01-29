// pages/api/encrypt.ts
import type { NextApiRequest, NextApiResponse } from 'next';
const VAULT_SERVER_ADDRESS = "localhost:8200"
const VAULT_TOKEN = "hvs.CAESIDpFK7lH1ywkwx0cJLx2vdbMmQkpw5uhD23Pikotd5DbGh4KHGh2cy56d2E1WVhyVDRNOHRRVHNOYUNEMlhkMGs"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const text = req.body;

  try {
    const vaultResponse = await fetch(`http://${VAULT_SERVER_ADDRESS}/v1/transit/encrypt/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Vault-Token': `${VAULT_TOKEN}`
      },
      body: JSON.stringify({ plaintext: Buffer.from(text).toString('base64') })
    });

    const json = await vaultResponse.json();
    //console.log('encrypt output ' + json.data.ciphertext)
    res.status(200).json(json.data);
  } catch (error) {
    res.status(500).json({ error: error });
  }
}

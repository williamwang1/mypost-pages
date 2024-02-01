// pages/api/encrypt.ts
import type { NextApiRequest, NextApiResponse } from 'next';
const VAULT_SERVER_ADDRESS = "localhost:8200"
const VAULT_TOKEN = "hvs.CAESIDpFK7lH1ywkwx0cJLx2vdbMmQkpw5uhD23Pikotd5DbGh4KHGh2cy56d2E1WVhyVDRNOHRRVHNOYUNEMlhkMGs"

const VAULT_ADDR = 'https://sample-cluster-public-vault-02709b99.0c293c21.z1.hashicorp.cloud:8200';
const VAULT_NAMESPACE = 'admin'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const text = req.body;
  //console.log('in descrypt ' + text)
  try {
    const authResponse = await fetch(`${VAULT_ADDR}/v1/auth/approle/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Vault-Namespace': `${VAULT_NAMESPACE}`
      },
      body: JSON.stringify({ 
        role_id: "9a37a802-c919-34f1-c783-569d42435c53", 
        secret_id: "1bb56d4e-cbe7-345f-c338-ca369af6d962"
      })
    })
    const auth = await authResponse.json()
    //console.log('in descrypt ' + JSON.stringify(auth))
    const descrypRes = await fetch(`${VAULT_ADDR}/v1/transit/decrypt/sample-key`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Vault-Token': auth.auth.client_token,
        'X-Vault-Namespace': `${VAULT_NAMESPACE}`
      },
      body: JSON.stringify({ciphertext: text})
    });
    const decryptJSON = await descrypRes.json()
    //console.log('decrypt output ' + JSON.stringify(decryptJSON))

    //const json = await vaultResponse.json();
    //console.log(res.data)
    
    res.status(200).json(decryptJSON.data);
  } catch (error) {
    res.status(500).json(error);
  }
}

import { Session, Profile } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
    export interface Session {
      user: {
        id: string;
        name: string;
        username: string;
        email: string;
        image: string;
      };
      expires: Date;
      id_token: string;
      profile: Profile;
    }
}

declare module "next-auth" {
    export interface Profile {
      profile_image_url_https: string
      description: string
    }
}

interface Account {
  id: string,
  name: string,
  email: string | null,
  emailVerified: boolean | null,
  image: string | null,
  type: string | null,
  provider: string,
  oauth_token: string | null,
  oauth_token_secret: string | null,
  providerAccountId: string,
  refresh_token: string | null;
  access_token: string | null;
  expires_at: number | null;
  token_type: string | null;
  scope: string | null;
  id_token: string | null;
  session_state: string | null,
  address: string,
  create_at: string,
  status: boolean

}


// account: {
//   id: string;
//   userId: string;
//   type: string;
//   provider: string;
//   providerAccountId: string;
//   refresh_token: string | null;
//   access_token: string | null;
//   expires_at: number | null;
//   token_type: string | null;
//   scope: string | null;
//   id_token: string | null;
//   session_state

export type { Session, Profile, Account };

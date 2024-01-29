import { sui } from "@/lib/hooks/sui";
import React, {useState} from 'react';
import {
  FACEBOOK_CLIENT_ID,
  GOOGLE_CLIENT_ID,
  TWITCH_CLIENT_ID,
} from "@/lib/shared/openid";
import { first } from "@/lib/shared/utils";
import {
  getFacebookAuthUrl,
  getGoogleAuthUrl,
  getTwitchAuthUrl,
  relativeToCurrentEpoch,
  withNewZkLoginSession,
} from "@shinami/nextjs-zklogin/client";
import { useRouter } from "next/router";
import { Google, LoadingDots } from "@/components/icons";
import Auth from "./Auth";
import { API_HOST } from "@/lib/api/move";



export default withNewZkLoginSession(
    () => relativeToCurrentEpoch(sui),
    ({ session }) => {
        const router = useRouter();
        const redirectTo = first(router.query.redirectTo);
        const callbackBaseUrl = new URL("authzk/", window.location.origin);
        const [signInClicked, setSignInClicked] = useState(false);
        const {  } =session

        const handleGoogle = () => {
            router.replace(
              getGoogleAuthUrl(
                session,
                GOOGLE_CLIENT_ID!,
                new URL("google", callbackBaseUrl),
                'http://localhost:3000/auth'
              )
            );
        }
    
        // Render sign-in options based on what's configured.
        return (
          <>
            {GOOGLE_CLIENT_ID && (
            <div>
                {/* <button
                  onClick={() => {
                    router.replace(
                      getGoogleAuthUrl(
                        session,
                        GOOGLE_CLIENT_ID!,
                        new URL("google", callbackBaseUrl),
                        redirectTo
                      )
                    );
                  }}
                >
                  Sign in with Google
                </button> */}
                <div className='flex flex-1 flex-col items-center mt-16'>
                <div className='mt-2 text-2xl font-bold leading-relaxed'>Login or Signup</div>
                <div className='mt-5'>
                    <button className='bg-sky-500 py-3 px-20 rounded-3xl hover:bg-sky-800' onClick={() => router.push('/auth')}>
                        <span className='text-white text-sm font-semibold leading-relaxed'>Passkey</span>
                    </button>
                </div>
                <div className="mt-5">
                    <button
                        disabled={signInClicked}
                        className={`${
                            signInClicked
                            ? "cursor-not-allowed bg-sky-500 py-3 px-12 rounded-3xl "
                            : "bg-sky-500 py-3 px-8 rounded-3xl hover:bg-sky-800"
                        } flex w-full items-center justify-center space-x-3 text-sm transition-all duration-75 focus:outline-none`}
                        onClick={() => {
                            setSignInClicked(true);
                            // signIn("google", { callbackUrl: 'http://localhost:3000/account' });
                            // handleGoogle
                            console.log(callbackBaseUrl)
                            router.replace(
                                getGoogleAuthUrl(
                                session,
                                GOOGLE_CLIENT_ID!,
                                new URL("google", callbackBaseUrl),
                                `${API_HOST}/account`
                                ), `${API_HOST}/account`
                            );
                        }}
                    >
                    {signInClicked ? (
                        <LoadingDots color="#808080"/>
                    ) : (
                        <>
                        <Google className="h-2 w-2" />
                        <p className='text-white text-sm font-semibold leading-relaxed'>Sign In with Google</p>
                        </>
                    )}
                    </button>
                </div>
                {/* <div className='mt-5'>
                <ConnectWallet/>
                </div> */}
                </div>
            </div>
            )}
            {FACEBOOK_CLIENT_ID && (
              <div>
                <button
                  onClick={() => {
                    router.replace(
                      getFacebookAuthUrl(
                        session,
                        FACEBOOK_CLIENT_ID!,
                        new URL("facebook", callbackBaseUrl),
                        redirectTo
                      )
                    );
                  }}
                >
                  Sign in with Facebook
                </button>
              </div>
            )}
            {/* {TWITCH_CLIENT_ID && (
              <div>
                <button
                  onClick={() => {
                    router.replace(
                      getTwitchAuthUrl(
                        session,
                        TWITCH_CLIENT_ID!,
                        new URL("twitch", callbackBaseUrl),
                        redirectTo
                      )
                    );
                  }}
                >
                  Sign in with Twitch
                </button>
              </div>
            )} */}
          </>
        );
    }
)
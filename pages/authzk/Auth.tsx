'use client'
import React, {useState} from 'react';
import { useRouter } from 'next/navigation'
import { useSession, signIn, signOut } from "next-auth/react"
import { Google, LoadingDots } from "@/components/icons";
//import ConnectWallet from '@/components/ConnectWallet';
import {
  ZkLoginSession
} from "@shinami/nextjs-zklogin/client";
export default function Auth() {
    const router = useRouter()
    const [signInClicked, setSignInClicked] = useState(false);

    const handleClick = () => {
        console.log()
    }

   // const { data: session } = useSession()
  // if (session) {
  //   return (
  //     <>
  //       Signed in as {JSON.stringify(session)} <br />
  //       <button onClick={() => signOut()}>Sign out</button>
  //     </>
  //   )
  // }

    return (
        <React.Fragment>
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
                    signIn("google", { callbackUrl: 'http://localhost:3000/account' });
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
        </React.Fragment>
    )
}

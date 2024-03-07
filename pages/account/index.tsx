import AccountAdd from "@/components/AccountAdd";
import AccountHeader from "@/components/AccountHeader";
import { ZkLoginSession, withZkLoginSessionRequired } from "@shinami/nextjs-zklogin/client";
import { ProfileMetadataCreated, ProfileDB, ProfileData } from "@/types/profile";
import Image from "next/image";
import React, {useEffect, useState} from 'react'
import { Account } from "@/types/auth";
import { useSession } from "next-auth/react";
import { useProfileMutation, useProfileCheckMutation } from "@/lib/hooks/api";
import { Router, useRouter } from "next/router";
import { Google, LoadingDots } from "@/components/icons";
import { GLOBAL_OBJECT_ID } from "@/lib/api/move";
import { GetServerSideProps } from 'next';
import { API_HOST } from '@/lib/api/move';
import { ACCOUNT_LIST_ROUTE, PROFILE_GET_ROUTE } from '@/lib/api/constant';
import { getFaucetHost, requestSuiFromFaucetV0 } from '@mysten/sui.js/faucet';


export const getServerSideProps: GetServerSideProps = async (context) => {
    const address = context.query.address
    const metadatadb = await fetch(`${API_HOST}${PROFILE_GET_ROUTE}`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address }),
    })
    const metadata: ProfileDB = await metadatadb.json()

    const accountsdb = await fetch(`${API_HOST}${ACCOUNT_LIST_ROUTE}`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
    })
    // console.log('in profile summary' + JSON.stringify(accountsdb))
    const accounts: Account[] = await accountsdb.json()

    return { props: { accounts, metadata } };
}

function NewAccount ({accounts, session, metadata} : {accounts: Account[], metadata: ProfileDB, session: any}) {
    const { isLoading, user, localSession } = session;
    const router = useRouter();
    const accountSession = useSession();

    useEffect(() => {
        // Always do navigations after the first render
        router.push(`/account/${user.wallet}?address=${user.wallet}&redirectTo=`)
    }, [router, user.wallet])


    const getToken =async () => {
        await requestSuiFromFaucetV0({
            host: getFaucetHost('testnet'),
             recipient: '0x90f82b8043b5570461cad52ac132141403d763da69eb3fd46f34051324b7182b',
        }).then((r) => console.log(r)).catch(e => console.log(e))
    }

    return (
        <div className='container h-screen px-10 py-5 flex flex-col flex-1 justify-between'>
            <div className=''>
                <AccountHeader user={user}/>
                <div>Redirecting</div>
            </div>
            <div className='flex flex-col gap-y-2 fixed bottom-0 w-4/5'>
                {/* <div className="flex flex-1 justify-between w-full">
                    <button className="px-4 py-2 bg-white rounded-md border border-gray-300 justify-center items-center gap-2.5 inline-flex text-sm font-semibold leading-6 text-gray-900">
                        Back
                    </button>
                    {button}
                </div> */}
                <div className='ext-gray-900 text-normal font-bold leading-relaxed border-b-2 pb-2'>Account Supported</div>
                <div className='flex flex-1 gap-x-10'>
                    {/* <div className='rounded-full w-20 h-20'> */}
                    <Image alt='Twitter' src='/images/twitter.png' width={40} height={40} />
                    {/* </div> */}
                </div>
            </div>
        </div>
    )
}

export default withZkLoginSessionRequired(NewAccount);

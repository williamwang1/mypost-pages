import AccountAdd from "@/components/AccountAdd";
import AccountHeader from "@/components/AccountHeader";
import { ZkLoginSession, withZkLoginSessionRequired } from "@shinami/nextjs-zklogin/client";
import { ProfileMetadataCreated, ProfileMedata, ProfileData } from "@/types/profile";
import Image from "next/image";
import React, {useEffect, useState} from 'react'
import { Account } from "@/types/auth";
import { useSession } from "next-auth/react";
import { useProfileMutation, useProfileCheckMutation } from "@/lib/hooks/api";
import { Router, useRouter } from "next/router";
import { Google, LoadingDots } from "@/components/icons";
import { GLOBAL_OBJECT_ID, MYPOST_MOVE_PACKAGE_ID } from "@/lib/api/move";
import { GetServerSideProps } from 'next';
import { API_HOST } from '@/lib/api/move';
import { ACCOUNT_LIST_ROUTE, PROFILE_GET_ROUTE, PROFILE_MUTATEDB_ROUTE } from '@/lib/api/constant';
import { getFaucetHost, requestSuiFromFaucetV0 } from '@mysten/sui.js/faucet';
import { getServerSession } from "next-auth";

const accounts = [
    {id: 1, address: 'addressxxxxxxxx1', timestamp: 'joined 11 Sep 2021', status: 'synced'},
    // {id: 2, address: 'addressxxxxxxxx2', timestamp: 'joined 11 Sep 2021', status: 'added'},
    // {id: 3, address: 'addressxxxxxxxx3', timestamp: 'joined 11 Sep 2021', status: 'in sync'},
    // {id: 4, address: 'addressxxxxxxxx4', timestamp: 'joined 11 Sep 2021', status: 'failed'},
]
const fetcher = (...args: any) => fetch({...args}).then((res) => res.json())

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { slug } = context.params as { slug: string };
    const metadatadb = await fetch(`${API_HOST}${PROFILE_GET_ROUTE}`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug }),
    })
    const metadata: ProfileMedata = await metadatadb.json()

    const accountsdb = await fetch(`${API_HOST}${ACCOUNT_LIST_ROUTE}`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
    })
    const accounts: Account[] = await accountsdb.json()

    if (metadata && metadata.profile_id && accounts.length > 0) {
        return {
            redirect: {
              destination: `${API_HOST}/profile`, // Redirect destination
              permanent: true, // Temporary redirect
            },
        }
    }



    return { props: { accounts, metadata} };
}

function NewAccount ({session, metadata} : { metadata: ProfileMedata, session: any}) {
    const { isLoading, user, localSession } = session;

    const [data, setData] = useState<Account[]>([])
    const [isDataLoading, setDataLoading] = useState(true);
    const [check, setCheck] = useState(true)
    const router = useRouter();
    const [clicked, setClicked] = useState(false);
    const accountSession = useSession();
    const {mutateAsync: profile, isPending: isCreating } = useProfileMutation()
    const {mutateAsync: profileCheck, isPending: isChecking} = useProfileCheckMutation()
    const [accounts, setAccounts] = useState<Account[]>([])
    let image = "https://abs.twimg.com/sticky/default_profile_images/default_profile.png";
    if (accountSession.data?.profile.profile_image_url_https) {
        image = accountSession.data?.user.image
    }
    let username = 'mm'
    if(accountSession.data?.user.name) {
        username = accountSession.data?.user.name
    }
    let bio = ''
    if (accountSession.data?.profile?.description) {
        bio = accountSession.data?.profile?.description
    }
    let expire = accountSession.data?.expires;
    let expireDate = new Date(expire + '').toLocaleDateString();
    let status = accountSession.status;
    let email = accountSession.data?.user.email;

    useEffect(() => {
        let fectchData = async () => {
            console.log('in account fetch ' + email)
            const accountsdb = await fetch(`${API_HOST}${ACCOUNT_LIST_ROUTE}`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            })
            const accounts: Account[] = await accountsdb.json()
            console.log(JSON.stringify(accounts))
            setAccounts(accounts)
        }
        fectchData()
    },[email])


    const handleNext = async (e: any) => {
        e.preventDefault();
        setClicked(true)
        let check = await profileCheck({
            keyPair: localSession.ephemeralKeyPair,
            global: `${GLOBAL_OBJECT_ID}`,
            address: `${user.wallet}`
            
        })
        console.log('in check profile ' + JSON.stringify(check))
        if (check.exist) {
            //sync db and onchain on profile meta event if failed to save into db
            let body = {
                package_id: `${MYPOST_MOVE_PACKAGE_ID}`,
                profile_id: check.profile_id,
                profile_meta_id: check.meta_id,
                profile_pool_id: check.pool_id,
                global_id: `${GLOBAL_OBJECT_ID}`,
                address: user.wallet,
                create_at: new Date()
            }
            const profileRes = await fetch(`${API_HOST}${PROFILE_MUTATEDB_ROUTE}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    },
                body: JSON.stringify(body)
            })
            if (!profileRes.ok) {
                throw new Error(`Error: ${profileRes.status}`);
            }
            let profileJson = await profileRes.json()
        } else {
            const result = await profile({
                name: username,
                bio: bio,
                avatar: image,
                global: `${GLOBAL_OBJECT_ID}`,
                keyPair: localSession.ephemeralKeyPair,
            });
            console.log('create on-chain profile' + JSON.stringify(result))
        }
        router.push(`/profile/${user.wallet}`)
    }

    let next = null
    if (clicked) {
        next = <LoadingDots/>
    } else {
        next = <span>Next</span>
    }
    
    let button = (<button disabled className="px-6 py-2 bg-sky-900 rounded-md border justify-center items-center text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500">
                    Next
                </button>)
    if (accounts) {
        if (accounts.length > 0) {
            button = (<div className="px-6 py-2 bg-sky-400 rounded-md border justify-center items-center text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
                    onClick={handleNext}
                    >
                    {next}
                </div>)
        }
    } 

    const handleCheck = async () => {
        let check = await profileCheck({
            keyPair: localSession.ephemeralKeyPair,
            global: `${GLOBAL_OBJECT_ID}`,
            address: `${user.wallet}`
            
        })
        console.log(JSON.stringify(check.exist))
        return check;
    }

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
                <div className='grid grid-cols-1'>
                {accounts?.map((a: Account) => (
                    <div key={a.id} className='flex flex-1 gap-x-3 mt-3 items-center'>
                        <div className='w-12 h-12'>
                            <Image alt='Avatar' src={'' + image}  width={40} height={40} className="rounded-full"/>
                        </div>
                        <div className='flex flex-1 justify-between items-center'>
                            <div>
                                <div className="text-normal leading-relaxed ">{username}</div>
                                <div className='text-xs text-pretty text-slate-900 leading-relaxed'>
                                    expires at <time dateTime={expire + ''}>{expireDate}</time>
                                </div>
                            </div>
                            <div>
                                <div className="text-normal font-semibold">{a.provider}</div>
                                <div className="text-xs text-pretty text-slate-900 leading-relaxed ">{status}</div>
                            </div>
                            
                        </div>
                    </div> 
                ))}
                </div>
                <AccountAdd user={user}/>
            </div>
            <div className='flex flex-col gap-y-2 fixed bottom-0 w-4/5'>
                <div className="flex flex-1 justify-between w-full">
                    <button className="px-4 py-2 bg-white rounded-md border border-gray-300 justify-center items-center gap-2.5 inline-flex text-sm font-semibold leading-6 text-gray-900">
                        Back
                    </button>
                    {button}
                </div>
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

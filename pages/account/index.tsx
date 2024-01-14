import AccountAdd from "@/components/AccountAdd";
import AccountHeader from "@/components/AccountHeader";
import { withZkLoginSessionRequired } from "@shinami/nextjs-zklogin/client";
import Image from "next/image";
import React, {useEffect, useState} from 'react'
import { Account } from "@/types/auth";
import { useSession } from "next-auth/react";
import { useProfileMutation } from "@/lib/hooks/api";
import { Router, useRouter } from "next/router";
// import useSWR from 'swr';

const accounts = [
    {id: 1, address: 'addressxxxxxxxx1', timestamp: 'joined 11 Sep 2021', status: 'synced'},
    // {id: 2, address: 'addressxxxxxxxx2', timestamp: 'joined 11 Sep 2021', status: 'added'},
    // {id: 3, address: 'addressxxxxxxxx3', timestamp: 'joined 11 Sep 2021', status: 'in sync'},
    // {id: 4, address: 'addressxxxxxxxx4', timestamp: 'joined 11 Sep 2021', status: 'failed'},
]

const fetcher = (...args: any) => fetch({...args}).then((res) => res.json())

export default withZkLoginSessionRequired(({ session }) => {
    const { isLoading, user, localSession } = session;
    const [data, setData] = useState<Account[]>([])
    const [isDataLoading, setDataLoading] = useState(true)
    const router = useRouter();
    const accountSession = useSession();
    const {mutateAsync: profile, isPending: isCreating } = useProfileMutation()
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

    useEffect(() => {
        fetch('/api/account/load')
          .then((res) => res.json())
          .then((data) => {
            setData(data)
            //setDataLoading(false)
          })
    }, [])
    const handleNext = async (e: any) => {
        e.preventDefault();
        const result = await profile({
            name: username,
            bio: bio,
            avatar: image,
            global: '0x01cbfcad318f5d4012493169c4e1e8f51338b2c2471c36afaf8785409db254ac',
            keyPair: localSession.ephemeralKeyPair,
          });
        console.log(result)
        router.push('/profile')
    }
    
    let button = (<button disabled className="px-6 py-2 bg-sky-900 rounded-md border justify-center items-center text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500">
                    Next
                </button>)
    if (data) {
        if (data.length > 0) {
            button = (<div className="px-6 py-2 bg-sky-400 rounded-md border justify-center items-center text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
                    onClick={handleNext}
                    >
                    Next
                </div>)
        }
    } 

    //const { data, error } = useSWR<Account[], Error>('/api/account/load', fetcher)

    return (
        <div className='container h-screen px-10 py-5 flex flex-col flex-1 justify-between'>
            <div className=''>
                <AccountHeader user={user}/>
                <div className='grid grid-cols-1'>
                {data?.map((a) => (
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
                {/* {JSON.stringify(accountSession)} */}
            </div>
            <div className='flex flex-col gap-y-2 fixed bottom-0 w-4/5'>
                <div className="flex flex-1 justify-between w-full">
                    <button className="px-4 py-2 bg-white rounded-md border border-gray-300 justify-center items-center gap-2.5 inline-flex text-sm font-semibold leading-6 text-gray-900">
                        Back
                    </button>
                    {/* <div className="px-6 py-2 bg-sky-400 rounded-md border justify-center items-center text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500">
                        Next
                    </div> */}
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
})
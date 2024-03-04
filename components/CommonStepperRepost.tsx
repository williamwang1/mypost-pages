import React, { Fragment, useState } from "react";
import { Tab } from '@headlessui/react';
import { Account } from "@/types/auth";
import Tiptap from "./TipTap";
import { ProfileDB } from "@/types/profile";
import { useRepostMutation } from '@/lib/hooks/api';
import { API_HOST, MYPOST_MOVE_PACKAGE_ID } from "@/lib/api/move";
import { REPLY_MUTATEDB_ROUTE, REPOST_MUTATEDB_ROUTE, TRANSACTION_MUTATEDB_ROUTE, TWEET_REPLY_ROUTE, TWEET_REPOST_ROUTE } from "@/lib/api/constant";
import {useRouter} from "next/router";
import { LoadingDots } from "@/components/icons";
import { TransactionDB } from "@/types/transaction";


export default function CommonStepperRepost({accounts, digest, transactionDigest, step, onBackChange, 
    session, paid, metadata, free, tx}
    : 
    {accounts: Account[], step: number, transactionDigest: string,
        onBackChange: (newStep: number) => void, 
        digest: string, session: any, 
        paid: string, metadata: ProfileDB, free: string, tx: TransactionDB}) {
    const { isLoading, user, localSession } = session;
    const [clicked, setClicked] = useState(false);
    const router = useRouter()
    //const {mutateAsync: transaction, isPending: isCreating } = useTransactionMutation()
    const {mutateAsync: repost, isPending: isCreating } = useRepostMutation()

    let tabs: any[] = [];
    accounts.map((a) => {
        let id = 1;
        let tab = {
            id: id,
            name: a.provider
        }
        tabs.push(tab)
        id = id + 1;
    })



    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setClicked(true)
        const encryptRes = await fetch('/api/encrypt', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(paid),
        })
    
        const enpaid = await encryptRes.json();
        // console.log(enpaid.ciphertext)
        // let text = enpaid.ciphertext

        let txmetadata = await repost({
            keyPair: localSession.ephemeralKeyPair,
            pool: metadata.profile_pool_id,
            content: enpaid.ciphertext,
            transaction_digest: digest
        })

        let text = free +  '\n' + `www.mypost.money/repost/${ txmetadata.txDigest }`
        let slug = `${user.wallet}`;
        let post_id = tx.post_id
        console.log('in repost before twitter repost ' + JSON.stringify(tx))
        const response = await fetch(`${TWEET_REPOST_ROUTE}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text, post_id, slug }),
          });
        let tweetRes = await response.json()
        console.log('in repost post data after twitter repost ' + JSON.stringify(tweetRes))
        // console.log('in transaction post data ' + JSON.stringify(tweetRes.data.data.id))
        let txbody = {
            digest: txmetadata.txDigest,
            transaction_digest: digest,
            public_content: free,
            address: `${user.wallet}`,
            profile_id: metadata.profile_id,
            repost_id: txmetadata.repost_id,
            pool_id: txmetadata.pool_id,
            package_id: `${MYPOST_MOVE_PACKAGE_ID}`,
            repost_post_id: tweetRes.data.rest_id,
            transaction_post_id: post_id,
            type: 'repost',
            create_at: new Date()
        }
        await fetch(`${API_HOST}${REPOST_MUTATEDB_ROUTE}`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(txbody),
        })
        router.push('/profile')
        //   if (data.success) {
        //     console.log('Tweet posted successfully:', data.data.id);
        //   } else {
        //     console.error('Failed to post tweet:', data.message);
        //   }
    }

    let submit = null
    if (paid && paid.length > 0) {
        if (clicked) {
            submit = <button
            type="button"
            className="px-6 py-2 bg-sky-400 rounded-md border justify-center items-center text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
                >
                    <LoadingDots/>
            </button>
            
        } else {
            submit = <button
            type="button"
            className="px-6 py-2 bg-sky-400 rounded-md border justify-center items-center text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
            onClick={handleSubmit}
                >
                    Submit
                </button>
        }
    } else {
        submit = <button
            type="button"
            className="px-6 py-2 bg-sky-200 disabled rounded-md border justify-center items-center text-sm font-semibold text-white shadow-sm "
                >
                   Submit
                </button>
    }

    return (
    <React.Fragment>
            <div className='bg-white shadow-md rounded-xl px-2'>
                <Tab.Group defaultIndex={0} >
                    <Tab.List className='flex flex-1 gap-x-2 mt-4'>
                        {tabs.map((tab) => (
                            <Tab as={Fragment} key={tab.id}>
                                {({ selected }) =>                         
                                    <button className={ selected ? 'text-sky-400 text-normal font-bold border-b-2 border-sky-500 focus:outline-none' : 'text-gray-900 text-normal font-normal leading-relaxed' }
                                        // onClick={() => router.push(`${tab}`)}
                                    >
                                    {tab.name}
                                    </button>
                                }
                            </Tab>
                        ))}
                    </Tab.List>
                    <Tab.Panels className='pt-2'>
                        {tabs.map((tab) => (
                            <Tab.Panel key={tab.id}>
                                {/* <div className="mt-2">
                                    <label>{summary}</label>
                                </div> */}
                                <div className='mt-2 pb-2'>
                                    <Tiptap content={transactionDigest} readOnly={true} onChange={undefined} />
                                </div>
                            </Tab.Panel>
                        ))}
                    </Tab.Panels>
                </Tab.Group>
            </div>
            <div className="flex mt-4 gap-x-2">
                <label htmlFor="price" className="text-base font-bold leading-6 text-gray-900">
                    Price
                </label>
                <label htmlFor="price" className="text-base font-normal leading-6 text-gray-500">
                    0
                </label>
                <label htmlFor="price" className="text-base font-bold leading-6 text-gray-900">
                    SUI
                </label>
                <a href='' target='_blank' className='text-sky-500 text-sm underline'>Learn more</a>
            </div>
            <div className="flex flex-col flex-1 mt-5">
                <div className="flex justify-between mt-28 px-4 mb-16">
                    <button type="button" 
                        className="px-4 py-2 bg-white rounded-md border border-gray-300 justify-center items-center gap-2.5 inline-flex text-sm font-semibold leading-6 text-gray-900"
                        onClick={() => onBackChange(step - 1)}
                    >
                        Back
                    </button>
                    {/* <button
                        type="button"
                        className="px-6 py-2 bg-sky-400 rounded-md border justify-center items-center text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
                        onClick={handleSubmit}
                    >
                        {submit}
                    </button> */}
                    {submit}
                </div>
            </div>
        </React.Fragment>
    )
}
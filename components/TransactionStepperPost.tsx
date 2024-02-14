import React, { Fragment, useState } from 'react' ;
import StepperPreview from "./StepperPost";
import { Tab } from '@headlessui/react';
import { Account } from "@/types/auth";
import dynamic from 'next/dynamic';
import { Google, LoadingDots } from "@/components/icons";
import { useTransactionMutation } from '@/lib/hooks/api';
import { ProfileMedata } from '@/types/profile';
import { ACCOUNT_LIST_ROUTE, PROFILE_GET_ROUTE, TRANSACTION_MUTATEDB_ROUTE } from '@/lib/api/constant';
import { API_HOST } from '@/lib/api/move';
import { useRouter } from 'next/navigation'
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
import Tiptap from './TipTap';
import PriceTooltip from './PriceTooltip';


export default function TransactionStepperPost({accounts, step, onBackChange , summary, digest, session, paid, metadata, free}
    : 
    {accounts: Account[], step: number, 
        onBackChange: (newStep: number) => void, 
        summary: string, digest: string, session: any, 
        paid: string, metadata: ProfileMedata, free: string}) {
    const { isLoading, user, localSession } = session;
    const router = useRouter()
    const [clicked, setClicked] = useState(false);
    const {mutateAsync: transaction, isPending: isCreating } = useTransactionMutation()

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


        let txmetadata = await transaction({
            keyPair: localSession.ephemeralKeyPair,
            pool: metadata.profile_pool_id,
            content: enpaid.ciphertext
        })

        let text = summary + '\n' + free +  '\n' + `Check this out: https://mypost.money/transaction/${ txmetadata.txDigest }`

        const response = await fetch('/api/tweet', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text }),
          });
        let txbody = {
            digest: txmetadata.txDigest,
            profile_id: metadata.profile_id,
            summary: summary,
            public_content: free,
            address: `${user.wallet}`,
        }
        let tx = await fetch(`${API_HOST}${TRANSACTION_MUTATEDB_ROUTE}`, {
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
            className="px-6 py-2 bg-sky-800 disabled rounded-md border justify-center items-center text-sm font-semibold text-white shadow-sm "
                >
                   Disabled
                </button>
    }

    return (
        <div className='px-2'>
                 <StepperPreview/>
                 <div className="grid grid-cols-6 mt-2">
                     {/* <div className="col-start-1 col-end-7">
                         <label htmlFor="summary" className="block text-base font-bold leading-6 text-gray-900">
                             Summary
                         </label>
                         <div className="mt-2">
                             <label>{summary}</label>
                         </div>
                     </div> */}
                 </div>
                 <div className='bg-white shadow-md'>
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
                                <div className="mt-2">
                                    <label>{summary}</label>
                                </div>
                                <div className='mt-2 pb-2'>
                                    <Tiptap content={digest} readOnly={true} onChange={undefined} />
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
                    <div className=''>
                    {/* <QuestionMarkCircleIcon className='h-5 w-5 shrink-0 text-sky-500'/> */}
                    <PriceTooltip/>
                    </div>
                    
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
            </div>
    )
}
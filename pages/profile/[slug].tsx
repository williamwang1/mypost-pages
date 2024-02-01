import Nav from "@/components/Nav";
import React, { Fragment, useState, useRef } from 'react' ;
import { SuiEvent, SuiObjectData, SuiObjectResponse } from "@mysten/sui.js/client";
import { withZkLoginSessionRequired, ZkLoginSession } from "@shinami/nextjs-zklogin/client";
import { sui } from '@/lib/api/shinami'
import { ProfileMetadataCreated, ProfileMedata, ProfileData } from "@/types/profile";
import { Tab } from '@headlessui/react'
import { useRouter } from 'next/navigation'
import MyTransactions from '@/components/MyTransactions';
import MyAssets from '@/components/MyAssets';
import MyFollowings from '@/components/MyFollowings';
import MyFollowers from '@/components/MyFollowers';
import { API_HOST } from '@/lib/api/move';
import { ACCOUNT_LIST_ROUTE, PROFILE_GET_ROUTE } from '@/lib/api/constant';
import { Account } from '@/types/auth';
import { GetServerSideProps, NextPage } from 'next';
import ProfileSummary from "@/components/ProfileSummary";

export const getServerSideProps: GetServerSideProps = async (context) => {
    // Extract the id from context.params
    const { slug } = context.params as { slug: string };
  
    // Fetch data using the id or perform other server-side operations
    const metadatadb = await fetch(`${API_HOST}${PROFILE_GET_ROUTE}`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug }),
    })
    const metadata: ProfileMedata = await metadatadb.json()
    
    const profiledata: SuiObjectResponse = await sui.getObject({
        id: metadata.profile_id,
        options: { showBcs: true, showContent: true, showDisplay: true, showOwner: true, showPreviousTransaction: true, showStorageRebate: true, showType: true } 
    })
    const profilepool: SuiObjectResponse = await sui.getObject({
        id: metadata.profile_pool_id,
        options: { showBcs: true, showContent: true, showDisplay: true, showOwner: true, showPreviousTransaction: true, showStorageRebate: true, showType: true } 
    })

    const accountsdb = await fetch(`${API_HOST}${ACCOUNT_LIST_ROUTE}`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
    })

    const accounts: Account[] = await accountsdb.json()
    
    // const transactionsdb = await fetch(`${API_HOST}/api/transactionmeta/getlist`, {
    //     method: 'POST',
    //     headers: {
    //     'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ slug }),
    // })

    // const transactions = await transactionsdb.json();
    // console.log(JSON.stringify(transactionsdb))

    return { props: { metadata,  profiledata , profilepool, accounts, slug } };
};

const tabs = [
    {id: 0, name: 'Transactions'},
    // {id: 2, name: 'Assets', component: <MyAssets/>, url: '/profile/asset'},
    {id: 1, name: 'Followings'},
    {id: 2, name: 'Followers'},
]

function Profile({metadata, session, profiledata, profilepool, accounts, slug} 
    : 
    {metadata: ProfileMedata, profiledata: SuiObjectResponse, 
        session: ZkLoginSession, profilepool: SuiObjectResponse, 
        accounts: Account[], transactions: any, slug: string}) {
    const { user, localSession } = session;
    const router = useRouter();
    const [activeIndex, setActiveIndex] = useState(0);
    if (profiledata.error) {
        return <div>profile not found</div>
    }
    if (profilepool.error) {
        return <div>profile pool not found</div>
    }
    if (!metadata) {
        return <div>profile not found</div>
    }

    return (
        <Nav bottomIndex={4} leftIndex={-1} user={user}>
            <ProfileSummary summary={profiledata.data} pool={profilepool.data} metadata={metadata} accounts={accounts} user={user}/>
            <div className='bg-white shadow-md'>
                <Tab.Group defaultIndex={activeIndex} >
                    <Tab.List className='flex flex-1 justify-between mt-4 px-2'>
                        {tabs.map((tab) => (
                        <Tab as={Fragment} key={tab.id}>
                            {({ selected }) =>                         
                                <button className={ selected ? 'text-sky-400 text-normal font-bold border-b-2 border-sky-500 focus:outline-none' : 'text-gray-900 text-normal font-normal leading-relaxed' }
                                    //onClick={() => router.push(`${tab.url}`)}
                                    onClick={() => {
                                        console.log(tab.id)
                                        setActiveIndex(tab.id)
                                    }}
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
                            {tab.id == 0 && (
                                <MyTransactions slug={slug}/>
                            )}
                            {tab.id == 1 && (
                                <MyFollowings slug={slug}/>
                            )}
                            {tab.id == 2 && (
                                <MyFollowers slug={slug}/>
                            )}

                        </Tab.Panel>
                    ))}
                    </Tab.Panels>
                </Tab.Group>
            </div>
            
            {/* {JSON.stringify(data)} */}
            {/* {JSON.stringify(filteredtsx)} */}
        </Nav>
        
    )
}



export default withZkLoginSessionRequired(Profile);
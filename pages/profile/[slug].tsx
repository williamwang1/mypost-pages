import Nav from "@/components/Nav";
import React, { Fragment, useState, useRef, useEffect } from 'react' ;
import { withZkLoginSessionRequired, ZkLoginSession } from "@shinami/nextjs-zklogin/client";
import { ProfileDB } from "@/types/profile";
import { Tab } from '@headlessui/react'
import { useRouter } from 'next/navigation'
import MyTransactions from '@/components/MyTransactions';
import MyFollowings from '@/components/MyFollowings';
import MyFollowers from '@/components/MyFollowers';
import { API_HOST } from '@/lib/api/move';
import { ACCOUNT_LIST_ROUTE, PROFILE_GET_ROUTE } from '@/lib/api/constant';
import { Account } from '@/types/auth';
import { GetServerSideProps, NextPage } from 'next';
import ProfileSummary from "@/components/ProfileSummary";
import MyAcesses from "@/components/MyAcesses";
import axios from "axios";

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
    const metadata: ProfileDB = await metadatadb.json();
    console.log('in profile ' + JSON.stringify(metadata))
    if (!metadata) {
        return {
            redirect: {
              destination: `${API_HOST}/account`, // Redirect destination
              permanent: true, // Temporary redirect
            },
        }
    }
    
    const accountsdb = await fetch(`${API_HOST}${ACCOUNT_LIST_ROUTE}`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
    })

    const accounts: Account[] = await accountsdb.json()
    

    return { props: { metadata, accounts, slug } };
};

const tabs = [
    {id: 0, name: 'Transactions'},
    {id: 1, name: 'Acesses'},
    {id: 2, name: 'Followings'},
    {id: 3, name: 'Followers'}
]

function Profile({metadata, session, accounts, slug} 
    : 
    {metadata: ProfileDB, profiledata: any, 
        session: ZkLoginSession, profilepool: any, 
        accounts: Account[], transactions: any, slug: string}) {
    const { user, localSession } = session;
    const router = useRouter();
    const [activeIndex, setActiveIndex] = useState(0);
    const [followermeta, setFollowerMeta] = useState<any>({})
    let current_user = user?.wallet;
    let bottomIndex = 4
    if (slug !== current_user) {
        bottomIndex = -1
    }


    return (
        <Nav bottomIndex={bottomIndex} leftIndex={-1} user={user}>
            <ProfileSummary followingmeta={metadata} accounts={accounts} session={session} slug={slug}/>
            <div className='bg-white shadow-md'>
                <Tab.Group defaultIndex={activeIndex} >
                    <Tab.List className='flex flex-1 justify-between mt-4 px-2'>
                        {tabs.map((tab) => (
                        <Tab as={Fragment} key={tab.id}>
                            {({ selected }) =>                         
                                <button className={ selected ? 'text-sky-400 text-normal font-bold border-b-2 border-sky-500 focus:outline-none' : 'text-gray-900 text-normal font-normal leading-relaxed' }
                                    //onClick={() => router.push(`${tab.url}`)}
                                    onClick={() => {
                                        //console.log(tab.id)
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
                                <MyAcesses slug={slug}/>
                            )}
                            {tab.id == 2 && (
                                <MyFollowings slug={slug}/>
                            )}
                            {tab.id == 3 && (
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
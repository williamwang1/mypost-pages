
import Nav from "@/components/Nav";
import React, { Fragment, useState, useRef } from 'react' ;
import { GetServerSideProps, NextPage } from 'next';
import { withZkLoginSessionRequired, ZkLoginSession } from "@shinami/nextjs-zklogin/client";
import { Tab } from '@headlessui/react'

export const getServerSideProps: GetServerSideProps = async (context) => {

    return {props: {}}
}

const tabs = [
    {id: 0, name: 'Following'},
    // {id: 2, name: 'Assets', component: <MyAssets/>, url: '/profile/asset'},
    {id: 1, name: 'For you'},
]

function Wallet({session} : {session: any}) {
    const { isLoading, user, localSession } = session;
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <Nav bottomIndex={1} leftIndex={-1} user={user}>
        <div>Balance</div>
        <div className="flex justify-around gap-x-3">
            <div>
                Send
            </div>
            <div>
                Receive
            </div>
            <div>
                Swap
            </div>
            <div>
                Buy
            </div>
        </div>
        <Tab.Group defaultIndex={activeIndex} >
            <Tab.List className='flex flex-1 justify-around mt-4 px-2'>
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
                        // <MyTransactions slug={slug}/>
                        <h1>Following</h1>
                    )}
                    {tab.id == 1 && (
                        // <MyFollowings slug={slug}/>
                        <h1>For you</h1>
                    )}

                </Tab.Panel>
            ))}
            </Tab.Panels>
        </Tab.Group>
        </Nav>
    )
}


export default withZkLoginSessionRequired(Wallet);
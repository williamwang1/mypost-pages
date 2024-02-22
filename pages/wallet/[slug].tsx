
import Nav from "@/components/Nav";
import React, { Fragment, useState, useRef } from 'react' ;
import { GetServerSideProps, NextPage } from 'next';
import { withZkLoginSessionRequired, ZkLoginSession } from "@shinami/nextjs-zklogin/client";
import { Tab } from '@headlessui/react'
import { sui } from '@/lib/api/shinami'
import { SUI_MIST } from '@/lib/constant';
import MyTokens from "@/components/MyTokens";
import WalletButton from "@/components/WalletButton";

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { slug } = context.params as { slug: string };

    let balance = await sui.getBalance({
        owner: slug,
        coinType: '0x2::sui::SUI' 
    })

    return {props: { balance, slug}}
}

const tabs = [
    {id: 0, name: 'Tokens'},
    // {id: 2, name: 'Assets', component: <MyAssets/>, url: '/profile/asset'},
    {id: 1, name: 'Assets'},
]

function Wallet({session, balance, slug} : {session: any, balance: any, slug: string}) {
    const { isLoading, user, localSession } = session;
    const [activeIndex, setActiveIndex] = useState(0);

    let _balance = ''
    if (balance) {
        let balanceint = parseInt(balance.totalBalance)
        _balance = ( balanceint / SUI_MIST).toFixed(4)
    }

    return (
        <Nav bottomIndex={1} leftIndex={-1} user={user}>
        <div className="font-normal text-gray-500 text-center mt-5 text-base">Balance</div>
        <div className="font-bold text-center mt-2 text-2xl">{_balance}</div>
        <WalletButton session={session}/>
        {/* <div className="flex justify-around gap-x-3 mt-5">
            <button className='bg-sky-400 rounded-3xl px-2 py-2 hover:bg-sky-800'>
                <span className='text-center text-white text-normal font-semibold leading-relaxed px-2'>Deposit</span>
            </button>
            <button className='bg-sky-400 rounded-3xl px-2 hover:bg-sky-800'>
                <span className='text-center text-white text-normal font-semibold leading-relaxed px-2 py-3'>Withdraw</span>
            </button>
            <button className='bg-sky-400 rounded-3xl px-2 hover:bg-sky-800'>
                <span className='text-center text-white text-normal font-semibold leading-relaxed px-2 py-3'>Swap</span>
            </button>
            <button className='bg-sky-400 rounded-3xl px-2 hover:bg-sky-800'>
                <span className='text-center text-white text-normal font-semibold leading-relaxed px-2'>Buy</span>
            </button>
        </div> */}
        <Tab.Group defaultIndex={activeIndex} >
            <Tab.List className='flex flex-1 justify-around mt-6 px-2'>
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
                        <MyTokens slug={slug}/>
                        
                    )}
                    {tab.id == 1 && (
                        // <MyFollowings slug={slug}/>
                        <h1>Assets</h1>
                    )}

                </Tab.Panel>
            ))}
            </Tab.Panels>
        </Tab.Group>
        </Nav>
    )
}


export default withZkLoginSessionRequired(Wallet);
import Nav from "@/components/Nav";
import React, { Fragment, useState, useRef } from 'react' ;
import { GetServerSideProps, NextPage } from 'next';
import { withZkLoginSessionRequired, ZkLoginSession } from "@shinami/nextjs-zklogin/client";
import { Tab } from '@headlessui/react'
import MyHomeFollowing from "@/components/MyHomeFollowing";
import MyHomeRecommend from "@/components/MyHomeRecommend";

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { slug } = context.params as { slug: string };
    return {props: {slug}}
}

const tabs = [
    {id: 0, name: 'Following'},
    // {id: 2, name: 'Assets', component: <MyAssets/>, url: '/profile/asset'},
    // {id: 1, name: 'Recommend'},
]


function Home({session, slug}: {session: any, slug: string}) {
    const { isLoading, user, localSession } = session;
    const [activeIndex, setActiveIndex] = useState(0);
    const [loading, setLoading] = useState(false)

    const handleLoadingChange = (load: boolean) => {
        setLoading(true)
    }

    if (loading) {
        return <div>Loading</div>
    }

    return (
    <Nav bottomIndex={0} leftIndex={-1} user={user}>
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
                        <MyHomeFollowing slug={slug} />
                    )}
                    {/* {tab.id == 1 && (
                        <MyHomeRecommend slug={slug}/>
                    )} */}

                </Tab.Panel>
            ))}
            </Tab.Panels>
        </Tab.Group>
    </Nav>
    )
}
export default withZkLoginSessionRequired(Home);
import React, { Fragment, useState, useEffect } from 'react' ;
import { withZkLoginSessionRequired } from "@shinami/nextjs-zklogin/client";
import { useSession } from "next-auth/react"
import { Tab } from '@headlessui/react'
import { useRouter } from 'next/navigation'
import MyTransactions from '@/components/MyTransactions';
import MyAssets from '@/components/MyAssets';
import MyFollowings from '@/components/MyFollowings';
import MyFollowers from '@/components/MyFollowers';
import ProfileSummary from '@/components/ProfileSummary';
import Nav from '@/components/Nav';



export default withZkLoginSessionRequired(({session }) => {
    const { isLoading, user, localSession } = session;
    let [isOpen, setIsOpen] = useState(false)
    const [redirectURL, setRedirectURl] = useState('');

    const router = useRouter();

    const { data: accountsession, status } = useSession()

    useEffect(() => {
        // Always do navigations after the first render
        router.push(`/profile/${user.wallet}`)
    }, [router, user.wallet])


    return (
        <Nav bottomIndex={4} leftIndex={-1} user={user}>
            {/* <ProfileSummary/> */}
            {/* <div className='bg-white shadow-md'>
                <Tab.Group defaultIndex={0} >
                    <Tab.List className='flex flex-1 justify-evenly mt-4'>
                        {tabs.map((tab) => (
                        <Tab as={Fragment} key={tab.id}>
                            {({ selected }) =>                         
                                <button className={ selected ? 'text-sky-400 text-normal font-bold border-b-2 border-sky-500 focus:outline-none' : 'text-gray-900 text-normal font-normal leading-relaxed' }
                                    onClick={() => router.push(`${tab.url}`)}
                                >
                                {tab.name}
                                </button>
                            }
                        </Tab>
                        ))}
                    </Tab.List>
                    <Tab.Panels className='pt-2'>
                    {tabs.map((tab) => (
                        <Tab.Panel key={tab.id}>{tab.component}</Tab.Panel>
                    ))}
                    </Tab.Panels>
                </Tab.Group>
            </div> */}
            <div>Redirecting....</div>
        </Nav>
    )
})
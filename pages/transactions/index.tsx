import React, { Fragment, useState, useEffect } from 'react' ;
import { ZkLoginSession, withZkLoginSessionRequired } from "@shinami/nextjs-zklogin/client";
import Nav from '@/components/Nav';
// import Transaction from '@/components/TransactionHelper';
import StepperPaid from '@/components/StepperPaid';
import StepperPublic from '@/components/StepperPublic';
import StepperPreview from '@/components/StepperPost';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation'
import { Tab } from '@headlessui/react';
import { GetServerSideProps } from 'next';
import { ACCOUNT_LIST_ROUTE, PROFILE_GET_ROUTE } from '@/lib/api/constant';
import { API_HOST } from '@/lib/api/move';
import { Account } from "@/types/auth";



// const tabs = [
//     {id: 1, name: 'Twiiter', component: <h1></h1>, url: '/profile'},
//     // {id: 2, name: 'Assets', component: <h1></h1>, url: '/profile/asset'},
//     {id: 2, name: 'Followings', component: <h1></h1>, url: '/profile/following'},
//     {id: 3, name: 'Followers', component: <h1></h1>, url: '/profile/follower'},
// ]

export const getServerSideProps: GetServerSideProps = async (context) => {
    const accountsdb = await fetch(`${API_HOST}${ACCOUNT_LIST_ROUTE}`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
    })
    const accounts: Account[] = await accountsdb.json()

    // if (accounts.length === 0) {
    //     return {
    //         redirect: {
    //           destination: `${API_HOST}/account`, // Redirect destination
    //           permanent: true, // Temporary redirect
    //         },
    //     }
    // }
    //console.log(JSON.stringify(accounts))


    return { props: { accounts } };
}

function Transaction({session, accounts} : {session: ZkLoginSession, accounts: Account[]}) {
    const { isLoading, user, localSession } = session;
    const [step, setStep] = useState(1)
    const [summary, setSummary] = React.useState('');
    const [free, setFree] = React.useState('');
    const [digest, setDigest] = React.useState('');
    const [paid, setPaid] = React.useState('');
    const [price, setPrice] = React.useState(1);
    const  modules  = {
        toolbar: [
            [{ font: [] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ color: [] }, { background: [] }],
            [{ script:  "sub" }, { script:  "super" }],
            ["blockquote", "code-block"],
            [{ list:  "ordered" }, { list:  "bullet" }],
            [{ indent:  "-1" }, { indent:  "+1" }, { align: [] }],
            ["link", "image", "video"],
            ["clean"],
        ],
    };
    let tabs: any[] = [];
    accounts.map((a) => {
        let id = 1;
        let tab = {
            id: id,
            name: a.provider
        }
        tabs.push(tab)
        let dummy = {
            id: 2,
            name: 'facebook'
        }
        tabs.push(dummy)
        id = id + 1;
    })
    const router = useRouter()

    const handleFreeChange = (event: any) => {
        // console.log(event)
        setFree(event.target.value)
    }

    const handlePaiChange = (value: any) => {
        console.log(value)
        setPaid(value)
    }

    const handleNext = () => {
        setStep(step + 1);
    }

    const handlePaiNext = () => {
        let digest = free + '<br/><br/>' + "<a href='www.mypost.money/transaction/<transaction digest>'>transaction digest</h1>"
        setDigest(digest);
        setStep(step + 1);
    }

    const handleBack = () => {
        setStep(step - 1);
    }
    const handleSubmit = () => {
        
    }
    const handleSummary = (event: any) => {
        // console.log(event.target.value)
        setSummary(event.target.value)
    }
    const handlePrice = (event: any) => {
        setPrice(event.target.value)
    }

    let stepper = (
        <div className='px-2'>
            <StepperPublic/>
            <div className="grid grid-cols-6 mt-2">
                <div className="col-start-1 col-end-7">
                    <label htmlFor="summary" className="block text-base font-bold leading-6 text-gray-900">
                        Summary
                    </label>
                    <div className="mt-2">
                        <textarea
                        id="summary"
                        name="summary"
                        rows={1}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6"
                        value={summary}
                        onChange={handleSummary}
                        />
                    </div>
                </div>
            </div>
            <div className="flex flex-col flex-1 mt-5">
                <label htmlFor="content" className="block text-base font-bold leading-6 text-gray-900">
                    Public Content
                </label>
                {/* <div className='mt-2'>
                   <QuillNoSSRWrapper theme="snow" modules={modules} value={content} onChange={handleContentChange} className='h-48 max-h-60'/>
                </div> */}
                <div className="mt-2">
                    <textarea
                    id="summary"
                    name="summary"
                    rows={5}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6"
                    value={free}
                    onChange={handleFreeChange}
                    />
                </div>
                <div className="flex justify-between mt-28 px-4 mb-16">
                    <button type="button" 
                        className="px-4 py-2 bg-white rounded-md border border-gray-300 justify-center items-center gap-2.5 inline-flex text-sm font-semibold leading-6 text-gray-900"
                        onClick={() => router.push('/home')}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="px-6 py-2 bg-sky-400 rounded-md border justify-center items-center text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
                        onClick={handleNext}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    )
    if (step == 2) {
        stepper = (
            <div className='px-2'>
                <StepperPaid/>
                <div className="flex flex-1 items-center mt-2 gap-x-2">
                    <label htmlFor="price" className="text-base font-bold leading-6 text-gray-900">
                        Price
                    </label>
                    <label htmlFor="price" className="text-base font-normal leading-6 text-gray-500">
                        0.01
                    </label>
                    <label htmlFor="price" className="text-base font-bold leading-6 text-gray-900">
                        SUI
                    </label>
                </div>
                <div className="flex flex-col flex-1 mt-5">
                    

                    {/* <div className="relative mt-2 rounded-md shadow-sm">
                        <input
                        type="number"
                        name="price"
                        id="price"
                        className="block rounded-md border-0 py-1.5 text-center text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 text-sm leading-6"
                        placeholder="0.00"
                        aria-describedby="price-currency"
                        value={price}
                        onChange={handlePrice}
                        />
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                            <span className="text-gray-500 text-sm" id="price-currency">
                                SUI
                            </span>
                        </div>
                    </div> */}
                
                    <div className="flex justify-between mt-28 px-4 mb-16">
                        <button type="button" 
                            className="px-4 py-2 bg-white rounded-md border border-gray-300 justify-center items-center gap-2.5 inline-flex text-sm font-semibold leading-6 text-gray-900"
                            onClick={handleBack}
                        >
                            Back
                        </button>
                        <button
                            type="button"
                            className="px-6 py-2 bg-sky-400 rounded-md border justify-center items-center text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
                            onClick={handlePaiNext}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        )
    }
    if (step == 3) {
        stepper = (
            <div className='px-2'>
                <StepperPreview/>
                <div className="grid grid-cols-6 mt-2">
                    <div className="col-start-1 col-end-7">
                        <label htmlFor="summary" className="block text-base font-bold leading-6 text-gray-900">
                            Summary
                        </label>
                        <div className="mt-2">
                            <label>{summary}</label>
                        </div>
                    </div>
                </div>
                <div className='bg-white shadow-md'>
                    <Tab.Group defaultIndex={0} >
                        <Tab.List className='flex flex-1 justify-evenly mt-4'>
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
                                {/* {tab.component} */}
                                {/* <div className='mt-2'>
                                    <QuillNoSSRWrapper theme="bubble" modules={modules} value={content} className='h-20'/>
                                </div> */}
                                {/* <label>{free}</label> */}
                                {/* <div className='mt-2 pb-2'>
                                    <QuillNoSSRWrapper theme="bubble" modules={modules} value={digest} className='h-20'/>
                                </div> */}
                            </Tab.Panel>
                        ))}
                        </Tab.Panels>
                    </Tab.Group>
                </div>
                <div className="flex flex-1 items-center mt-2 gap-x-2">
                    <label htmlFor="price" className="text-base font-bold leading-6 text-gray-900">
                        Price
                    </label>
                    <label htmlFor="price" className="text-base font-normal leading-6 text-gray-500">
                        0.01
                    </label>
                    <label htmlFor="price" className="text-base font-bold leading-6 text-gray-900">
                        SUI
                    </label>
                </div>
                <div className="flex flex-col flex-1 mt-5">

                    <div className="flex justify-between mt-28 px-4 mb-16">
                        <button type="button" 
                            className="px-4 py-2 bg-white rounded-md border border-gray-300 justify-center items-center gap-2.5 inline-flex text-sm font-semibold leading-6 text-gray-900"
                            onClick={handleBack}
                        >
                            Back
                        </button>
                        <button
                            type="button"
                            className="px-6 py-2 bg-sky-400 rounded-md border justify-center items-center text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
                            onClick={handleSubmit}
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    useEffect(() => {
        // Always do navigations after the first render
        router.push(`/transactions/${user?.wallet}`)
    }, [router, user?.wallet])

    return (
        <Nav bottomIndex={2} leftIndex={-1} user={user}>
            {/* {stepper} */}
            <div>Redirecting</div>
        </Nav>
    )
}


export default withZkLoginSessionRequired(Transaction);
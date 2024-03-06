import React, { Fragment, useState, useRef } from 'react' ;
import { ZkLoginSession, withZkLoginSessionRequired } from "@shinami/nextjs-zklogin/client";
import Nav from '@/components/Nav';
import { ProfileDB } from "@/types/profile";
import { useRouter } from 'next/navigation'
import { GetServerSideProps } from 'next';
import { ACCOUNT_LIST_ROUTE, PROFILE_GET_ROUTE, TRANSACTION_MUTATEDB_ROUTE } from '@/lib/api/constant';
import { API_HOST } from '@/lib/api/move';
import { Account } from "@/types/auth";
import TransactionStepperPublic from '@/components/TransactionStepperPublic';
import TransactionStepperPaid from '@/components/TransactionStepperPaid';
import TransactionStepperPost from '@/components/TransactionStepperPost';
import { useSession } from 'next-auth/react';


export const getServerSideProps: GetServerSideProps = async (context) => {
    const { slug } = context.params as { slug: string };
    const metadatadb = await fetch(`${API_HOST}${PROFILE_GET_ROUTE}`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug }),
    })
    const metadata: ProfileDB = await metadatadb.json()

    const accountsdb = await fetch(`${API_HOST}${ACCOUNT_LIST_ROUTE}`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug }),
    })
    const accounts: Account[] = await accountsdb.json()

    if (accounts.length === 0) {
        return {
            redirect: {
              destination: `${API_HOST}/accountnotfound`, // Redirect destination
              permanent: true, // Temporary redirect
            },
        }
    }
    //console.log(JSON.stringify(metadata))


    return { props: { accounts, metadata } };
}

function Transactions({session, accounts, metadata } : {session: any, accounts: Account[], metadata: ProfileDB}) {
    const { isLoading, user, localSession } = session;
    const [step, setStep] = useState(1)
    const [summary, setSummary] = React.useState('summary');
    const [free, setFree] = React.useState('');
    const [digest, setDigest] = React.useState('');
    const [paid, setPaid] = React.useState('');
    const [price, setPrice] = React.useState(1);
    const accountSession = useSession();
    let email = accountSession.data?.user.email;


    const handleFreeChange = (newFree: string, limit: number) => {
        // console.log(event)
        if (newFree.length < limit) {
            setFree(newFree)
        }
        
        //setFree(event.target.value)
    }

    const handlePaiChange = (value: any) => {
        //console.log(value)
        setPaid(value)
    }

    const handlePublicNext = (newStep: number) => {
        setStep(newStep)
        //setStep(step + 1);
    }

    const onPaidNextChange = (newDigest: string, newStep: number) => {
        let digest = free + '<br/>' + "<a href='www.mypost.money/transaction/<transaction digest>'>transaction digest</h1>"
        setDigest(newDigest);
        setStep(newStep);
    }

    const handleBack = (newStep: number) => {
        setStep(newStep);
    }

    const handleSummaryChange = (newSummary: string) => {
        setSummary(newSummary)
    }
    const handlePrice = (event: any) => {
        setPrice(event.target.value)
    }

    let stepper = (
        <TransactionStepperPublic summary={summary} handleSummary={handleSummaryChange} 
        free={free} handleFree={handleFreeChange} 
        step={step} handleStepChange={handlePublicNext}/>
    )
    if (step == 2) {
        stepper = (
        <TransactionStepperPaid paid={paid} onPaidChange={handlePaiChange} 
        step={step} free={free} onBackChange={handleBack} 
        onPaidNextChange={onPaidNextChange}/>
        )
    }
    if (step == 3) {
        stepper = (
            <TransactionStepperPost accounts={accounts} 
            step={step} onBackChange={handleBack} 
            summary={summary} digest={digest} 
            session={session} paid={paid} 
            metadata={metadata} free={free}/>
        )
    }

    return (
        <Nav bottomIndex={2} leftIndex={-1} user={user}>
            {stepper}
        </Nav>
    )
}


export default withZkLoginSessionRequired(Transactions);
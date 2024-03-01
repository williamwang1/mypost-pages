import React, { Fragment, useState, useRef } from 'react' ;
import { ZkLoginSession, withZkLoginSessionRequired } from "@shinami/nextjs-zklogin/client";
import Nav from '@/components/Nav';
import { ProfileDB } from "@/types/profile";
import { useRouter } from 'next/navigation'
import { GetServerSideProps } from 'next';
import { ACCOUNT_LIST_ROUTE, PROFILE_GET_ROUTE, TRANSACTION_GET, TRANSACTION_MUTATEDB_ROUTE } from '@/lib/api/constant';
import { API_HOST } from '@/lib/api/move';
import { Account } from "@/types/auth";
import { useSession } from 'next-auth/react';
import ReplyStepperPublic from '@/components/ReplyStepperPublic';
import ReplyStepperPaid from '@/components/ReplyStepperPaid';
import ReplyStepperPost from '@/components/ReplyStepperPost';
import { TransactionDB } from '@/types/transaction';


export const getServerSideProps: GetServerSideProps = async (context) => {
    //console.log('in replies ' + JSON.stringify(context.query))
    const { slug, digest } = context.query as { slug: string, digest: string };
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

    const txdb = await fetch(`${API_HOST}${TRANSACTION_GET}`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ digest }),
    })
    const tx = await txdb.json()

    // if (accounts.length === 0) {
    //     return {
    //         redirect: {
    //           destination: `${API_HOST}/account`, // Redirect destination
    //           permanent: true, // Temporary redirect
    //         },
    //     }
    // }
    //console.log(JSON.stringify(metadata))


    return { props: { accounts, metadata, digest, tx } };
}

function Replies({session, accounts, metadata, digest, tx } 
    :
    {session: any, accounts: Account[], metadata: ProfileDB, digest: string, tx: TransactionDB}) {
    const { isLoading, user, localSession } = session;
    const [step, setStep] = useState(1)
    const [summary, setSummary] = React.useState('summary');
    const [free, setFree] = React.useState('');
    const [transactionDigest, setTransactionDigest] = React.useState('');
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
        setTransactionDigest(newDigest);
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
        <ReplyStepperPublic free={free} handleFree={handleFreeChange} 
        step={step} handleStepChange={handlePublicNext} digest={digest}/>
    )
    if (step == 2) {
        stepper = (
            <ReplyStepperPaid paid={paid} onPaidChange={handlePaiChange} 
            step={step} free={free} onBackChange={handleBack} 
            onPaidNextChange={onPaidNextChange} digest={digest}/>
        )
    }
    if (step == 3) {
        stepper = (
            <ReplyStepperPost accounts={accounts} 
            step={step} onBackChange={handleBack} 
            summary={summary} digest={digest} transactionDigest={transactionDigest}
            session={session} paid={paid} 
            metadata={metadata} free={free} tx={tx}/>
        )
    }

    return (
        <Nav bottomIndex={2} leftIndex={-1} user={user}>
            {stepper}
        </Nav>
    )
}


export default withZkLoginSessionRequired(Replies);
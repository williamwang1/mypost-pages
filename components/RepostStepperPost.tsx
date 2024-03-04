import React, { Fragment, useState } from 'react' ;
import StepperPreview from "./StepperPost";
import { Account } from "@/types/auth";
import { ProfileDB } from '@/types/profile';
import { TransactionDB } from '@/types/transaction';
import RepostContentHeader from './RepostContentHeader';
import CommonStepperRepost from './CommonStepperRepost';


export default function RepostStepperPost({accounts, step, onBackChange, summary, digest, transactionDigest, 
    session, paid, metadata, free, tx}
    : 
    {accounts: Account[], step: number, 
        onBackChange: (newStep: number) => void, 
        summary: string, digest: string, transactionDigest: string,
        session: any, 
        paid: string, metadata: ProfileDB, free: string, tx: TransactionDB}) {
    const { isLoading, user, localSession } = session;


    return (
        <div className='px-2'>
            <StepperPreview/>
            <RepostContentHeader digest={digest}/>
            <CommonStepperRepost accounts={accounts} digest={digest} transactionDigest={transactionDigest} step={step} 
            onBackChange={onBackChange} session={session} paid={paid} metadata={metadata} free={free} tx={tx}/>
    </div>

    )
}
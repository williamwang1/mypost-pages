import React, { Fragment, useState, useEffect } from 'react' ;
import { ZkLoginSession, withZkLoginSessionRequired } from "@shinami/nextjs-zklogin/client";
import Nav from '@/components/Nav';
import StepperPaid from '@/components/StepperPaid';
import StepperPublic from '@/components/StepperPublic';
import StepperPreview from '@/components/StepperPost';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation'
import { Account } from "@/types/auth";


function Transaction({session} : {session: ZkLoginSession}) {
    const { isLoading, user, localSession } = session;
    const router = useRouter()

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
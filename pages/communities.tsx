import React, { Fragment, useState, useEffect } from 'react' ;
import { withZkLoginSessionRequired } from "@shinami/nextjs-zklogin/client";
import Nav from '@/components/Nav';
import { useRouter } from 'next/router';

export default withZkLoginSessionRequired(({session }) => {
    const { isLoading, user, localSession } = session;
    const router = useRouter();

    // useEffect(() => {
    //     // Always do navigations after the first render
    //     router.push(`/airdrop/${user.wallet}`)
    // }, [router, user.wallet])

    return (
        <Nav bottomIndex={-1} leftIndex={2} user={user}>
            <h1>Coming Soon</h1>
        </Nav>
    )
})
import React, { useEffect } from 'react' ;
import { withZkLoginSessionRequired } from "@shinami/nextjs-zklogin/client";
import Nav from '@/components/Nav';
import { useRouter } from "next/router";

export default withZkLoginSessionRequired(({session }) => {

    const { isLoading, user, localSession } = session;
    const router = useRouter();

    useEffect(() => {
        // Always do navigations after the first render
        router.push(`/wallet/${user.wallet}`)
    }, [router, user.wallet])

    return (
        <Nav bottomIndex={1} leftIndex={-1} user={user}>
            Redirecting
        </Nav>
    )
})
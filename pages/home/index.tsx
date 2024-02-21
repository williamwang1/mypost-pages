import { withZkLoginSessionRequired } from "@shinami/nextjs-zklogin/client";
import Nav from '@/components/Nav';
import { Router, useRouter } from "next/router";
import React, {useEffect, useState} from 'react'

export default withZkLoginSessionRequired(({session }) => {
    const { isLoading, user, localSession } = session;
    const router = useRouter();

    useEffect(() => {
        // Always do navigations after the first render
        router.push(`/home/${user.wallet}`)
    }, [router, user.wallet])

    return (
        <Nav bottomIndex={0} leftIndex={-1} user={user}>
            Redirecting
        </Nav>
    )
})
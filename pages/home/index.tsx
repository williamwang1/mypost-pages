import React, { Fragment, useState, useRef } from 'react' ;
import { withZkLoginSessionRequired } from "@shinami/nextjs-zklogin/client";
import Nav from '@/components/Nav';

export default withZkLoginSessionRequired(({session }) => {
    const { isLoading, user, localSession } = session;

    return (
        <Nav bottomIndex={0} leftIndex={-1} user={user}>
            Home
        </Nav>
    )
})
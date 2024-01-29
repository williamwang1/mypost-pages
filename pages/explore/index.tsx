import React, { Fragment, useState, useRef } from 'react' ;
import { withZkLoginSessionRequired } from "@shinami/nextjs-zklogin/client";
import BottomNav from "@/components/BottomNav";
import LayoutHeader from "@/components/LayoutHeader";
import Nav from '@/components/Nav';

export default withZkLoginSessionRequired(({session }) => {
    const { isLoading, user, localSession } = session;

    return (
        <Nav bottomIndex={3} leftIndex={-1} user={user}>
            Explore
        </Nav>
    )
})
'use client'
import React, { Fragment, useState, useRef } from 'react';
import { useRouter } from 'next/navigation'
import { Session } from "next-auth";
import { ZkLoginUser } from '@shinami/nextjs-zklogin';
import UserDropdown from './UserDropdown';




export default function AccountHeader({ user }: { user: ZkLoginUser}) {
    const router = useRouter()
    
    return (
        <div className='flex flex-1 gap-x-1 border-b-2 items-center justify-between pb-2'>
            <div className='text-gray-900 text-normal font-bold leading-relaxed'>
                Accounts
            </div>
            {/* <div className='flex flex-1 items-center justify-end'> */}
            <UserDropdown user={user}/>
            {/* </div> */}
        </div>
    )
}
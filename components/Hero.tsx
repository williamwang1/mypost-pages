'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { TypeAnimation } from 'react-type-animation';
import { AUTH_API_BASE, LOGIN_PAGE_PATH } from "@shinami/nextjs-zklogin";

export default function Hero() {

    const router = useRouter()
    return (
        <div className="flex flex-col flex-1 items-center gap-10 w-screen">
            <div className='mt-40 flex flex-1 flex-col items-center gap-y-3'>
                <TypeAnimation
                    sequence={[
                        // Same substring at the start will only be typed out once, initially
                        'Moneitize your any post',
                        2000, 
                        'Moneitize any content',
                        2000, 
                        'In any social media',
                        2000
                    ]}
                    wrapper="div"
                    speed={60}
                    style={{ fontSize: '1.875rem', lineHeight: '2.25rem', fontWeight: '700', letterSpacing: '-0.025e'}}
                    repeat={Infinity}
                    />
                <div className="text-3xl text-sky-500 font-bold tracking-tight leading-none dark:text-white">10x and more</div>
            </div>

            <button className='bg-sky-500 py-1 px-4 rounded-lg hover:bg-sky-800' onClick={() => router.push(`${LOGIN_PAGE_PATH}`)}>
                <span className='text-white text-sm font-semibold leading-relaxed'>Get Started</span>
            </button>
        </div>
    )
}
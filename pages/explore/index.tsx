import React, { Fragment, useState, useRef } from 'react' ;
import { withZkLoginSessionRequired } from "@shinami/nextjs-zklogin/client";
import BottomNav from "@/components/BottomNav";
import LayoutHeader from "@/components/LayoutHeader";

export default withZkLoginSessionRequired(({session }) => {
    const { isLoading, user, localSession } = session;

    return (
        <div className='container h-screen px-2 py-5 flex flex-col flex-1 justify-between'>
            <div className=''>
                <LayoutHeader index={1} user={user}/>
            </div>
            <div className='flex flex-col gap-y-2 fixed bottom-0 w-full bg-white shadow-2xl'>
                {/* <div className="flex flex-1 justify-evenly">
                    <div>Home

                    </div>
                    <div>Home</div>
                    <div>Home</div>
                    <div>Home</div>
                </div> */}
                <BottomNav index={2}/>
            </div>
        </div>
    )
})
import { trucateAddress } from '@/lib/shared/utils';
import * as Toast from '@radix-ui/react-toast';
import { ClipboardDocumentIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useRef, useState } from 'react';
import Tiptap from './TipTap';
import { ReplyDB, RepostDB } from '@/types/transaction';
import RepostContentHeader from './RepostContentHeader';

export default function RepostContent({repost, repostonchain, session,
    unlock, onUnlockchange, bought }
    :
    {repost: RepostDB, repostonchain: any, session: any,
        unlock: boolean, onUnlockchange: (lock: boolean) => void, bought: boolean}) {
    const { isLoading, user, localSession } = session;
    const [open, setOpen] = useState(false);
    const [loading, setLoaiding] = useState(true);
    const [noaccessOpen, setNoAcessOpen] = useState(false)
    const timerRef = React.useRef(0);
    //const [unlock, setUnlock] = useState(false);
    const [plaintext, setPlaintext] = useState('');
    //const [bought, setBought] = useState(false);
    let encrypt_content = repostonchain?.data?.content?.fields?.content

    const handleDigestCopy = () => {
        navigator.clipboard.writeText(repost.digest) // Write text to clipboard
          .then(() => {
            setOpen(false);
            window.clearTimeout(timerRef.current);
            timerRef.current = window.setTimeout(() => {
            setOpen(true);
          }, 100);
          })
          .catch(err => {
            console.error("Failed to copy text: ", err);
            // alert("Failed to copy text. Please try again.");
          });
    };

    const handleClick = async () => {
        //console.log('in transction slug ' + JSON.stringify(bought))
        if(bought) {
            //console.log('eligible to decrypt')
            const decryptRes = await fetch('/api/decrypt', {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(encrypt_content),
            })
            let data = await decryptRes.json();
            setPlaintext(atob(data.plaintext)) ;
            //console.log(plaintext)
            onUnlockchange(true)
        } else {
            //TODO show pop-up to buy
            console.log('no access')
            setNoAcessOpen(false);
            window.clearTimeout(timerRef.current);
            timerRef.current = window.setTimeout(() => {
            setNoAcessOpen(true);
        })
        }
    }

    let private_content = (
        <Toast.Provider swipeDirection="right">
            <div className='overflow-hidden break-words max-w-full underline hover:text-gray-500' onClick={handleClick}>
                <Tiptap content={encrypt_content} readOnly={true} onChange={undefined}/>
            </div>
            <Toast.Root         
                open={noaccessOpen}
                onOpenChange={setNoAcessOpen} className='fixed bottom-18 right-8 z-50 flex gap-x-2 items-center shadow-lg bg-sky-500 text-white rounded-xl'>
                <Toast.Description className='font-bold px-2 py-1'>Please buy first !</Toast.Description>
            </Toast.Root>
            <Toast.Viewport />
        </Toast.Provider>
    )

    if (unlock) {
        private_content = <Tiptap content={plaintext} readOnly={true} onChange={undefined}/>
    }

    // if (loading) {
    //     return(<div>Loading</div>)
    // }

    return (
        <div className='mt-5 text-gray-900 leading-relaxed text-base w-4/5'>
            <RepostContentHeader digest={repost.transaction_digest}/>
            <div className='flex gap-x-2 items-center'>
                <div className='flex text-clip font-bold'>
                {trucateAddress(repost.digest)}
                </div>
                <Toast.Provider swipeDirection="right">
                    <button  onClick={handleDigestCopy}>
                        <ClipboardDocumentIcon className="h-4 w-4 flex-none font-bold text-gray-500 hover:text-gray-800" aria-hidden="true"/>
                    </button>
                    <Toast.Root         
                        open={open}
                        onOpenChange={setOpen} className='fixed bottom-18 right-8 z-50 flex gap-x-2 items-center shadow-lg bg-sky-500 text-white rounded-xl'>
                        <Toast.Description className='font-bold px-2 py-1'>copied!</Toast.Description>
                        {/* <Toast.Close aria-label="Close" className='font-bold text-xl'>
                            <span aria-hidden>×</span>
                        </Toast.Close> */}
                    </Toast.Root>
                    <Toast.Viewport />
                </Toast.Provider>
            </div>
            <div className='flex text-clip break-words max-w-full overflow-hidden'>
                {repost.public_content}
            </div>
            {private_content}
        </div>
    )
}
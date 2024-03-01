import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import { trucateAddress } from '@/lib/shared/utils';
import * as Toast from '@radix-ui/react-toast';
import { useState } from "react";
import React from "react";
import Tiptap from '@/components/TipTap';
import { TransactionDB } from "@/types/transaction";


export default function TransactionContent({txonchain, tx, transaction_digest, unlock, onUnlockChange, bought } 
    : 
    {txonchain: any, tx: TransactionDB, transaction_digest: string, unlock: boolean
        onUnlockChange: (unlock: boolean) => void, bought: boolean}) {
    const [open, setOpen] = useState(false);
    const timerRef = React.useRef(0);
    const [noaccessOpen, setNoAcessOpen] = useState(false)
    const [plaintext, setPlaintext] = useState('');

    let encrypt_content = txonchain?.data?.content?.fields?.content
    let public_content = tx.public_content;

    const handleDigestCopy = () => {
        navigator.clipboard.writeText(transaction_digest) // Write text to clipboard
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
            onUnlockChange(true)
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

    return (
        <div className='mt-5 text-gray-900 leading-relaxed text-base w-4/5'>
        <div className='flex gap-x-2 items-center'>
            <div className='flex text-clip font-bold'>
            {trucateAddress(transaction_digest)}
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
        
        <div className='flex text-clip overflow-hidden break-words max-w-full'>
        {public_content}
        </div>
        {private_content}
        {/* {JSON.stringify(pooldata.data.content.fields)} */}
    </div>  
    )
}
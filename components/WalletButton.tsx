import {Drawer} from 'vaul';
import Image from 'next/image';
import React, { useState } from "react"
import QRCode from "react-qr-code";
import { trucateAddress } from '@/lib/shared/utils';
import { ClipboardDocumentIcon, InformationCircleIcon } from '@heroicons/react/24/outline'
import * as Toast from '@radix-ui/react-toast';

export default function WalletButton({session}: {session: any}) {

    const { isLoading, user, localSession } = session;

    const [depositConfirm, setDepositConfirm] = useState(false)
    const [open, setOpen] = React.useState(false);
    const timerRef = React.useRef(0);

    let address = user.wallet; 

    const handleCopyClick = () => {
        navigator.clipboard.writeText(address) // Write text to clipboard
          .then(() => {
            //console.log("Text copied to clipboard:", address);
            setOpen(false);
            window.clearTimeout(timerRef.current);
            timerRef.current = window.setTimeout(() => {
            setOpen(true);
          }, 100);
            //alert(address);
          })
          .catch(err => {
            console.error("Failed to copy text: ", err);
            // alert("Failed to copy text. Please try again.");
          });
      };

    return (
        <div className="flex justify-around gap-x-3 mt-5">
            <Drawer.Root>
                <Drawer.Trigger>
                    <div className='bg-sky-400 rounded-3xl px-2 py-2 hover:bg-sky-800' onClick={() => setDepositConfirm(true)}>
                        <span className='text-center text-white text-normal font-semibold leading-relaxed px-2'>Deposit</span>
                    </div>
                </Drawer.Trigger>
                <Drawer.Portal> 
                    <Drawer.Overlay className="fixed inset-0 bg-black/40" />
                    <Drawer.Content className="bg-white flex rounded-t-[10px] h-[60%] fixed bottom-0 left-0 right-0">
                        <div className='w-screen bg-white flex flex-col items-center gap-y-2'>
                            <div className='font-bold text-xl mt-2'>Deposit</div>
                            <QRCode value={address} size={196}/>
                            <div className='flex items-start gap-x-2 px-4'>
                                <InformationCircleIcon className="w-8 h-8 text-red-500"/>
                                <div className="text-red-500 text-base">Only supports receive with SUI. Sending other tokens may result in a loss of funds.</div>
                            </div>
                            <div className='flex gap-x-2'>
                                <div>{trucateAddress(address)}</div>
                                <Toast.Provider swipeDirection="right">
                                    <button  onClick={handleCopyClick}>
                                        <ClipboardDocumentIcon className="h-5 w-5 flex-none font-bold text-gray-500 align-middle hover:text-gray-800" aria-hidden="true"/>
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
                        </div>
                    </Drawer.Content>
                </Drawer.Portal>
            </Drawer.Root>
            <button className='bg-sky-400 rounded-3xl px-2 hover:bg-sky-800'>
                <span className='text-center text-white text-normal font-semibold leading-relaxed px-2 py-3'>Withdraw</span>
            </button>
            <button className='bg-sky-200 rounded-3xl px-2 disabled'>
                <span className='text-center text-white text-normal font-semibold leading-relaxed px-2 py-3'>Swap</span>
            </button>
            <button className='bg-sky-200 rounded-3xl px-2 disabled'>
                <span className='text-center text-white text-normal font-semibold leading-relaxed px-2'>Buy</span>
            </button>
        </div>
    )
}
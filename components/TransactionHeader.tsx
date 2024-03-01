import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { trucateAddress } from '@/lib/shared/utils';
import * as Toast from '@radix-ui/react-toast';
import { ClipboardDocumentIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline';

export default function TransactionHeader({profiledata} : {profiledata: any}) {

    const [addressOpen, setAddressOpen] = useState(false)
    const timerRef = React.useRef(0);

    let avatar =''
    let name =''
    let address = ''
    if (profiledata) {
        avatar = profiledata?.data?.content?.fields?.avatar
        name = profiledata?.data?.content?.fields?.name
        address = profiledata?.data?.content?.fields?.owner
    }

    const handleAddressCopy = () => {
        navigator.clipboard.writeText(address) // Write text to clipboard
        .then(() => {
          setAddressOpen(false);
          window.clearTimeout(timerRef.current);
          timerRef.current = window.setTimeout(() => {
          setAddressOpen(true);
        }, 100);
        })
        .catch(err => {
          console.error("Failed to copy text: ", err);
          // alert("Failed to copy text. Please try again.");
        });
    }
    
    return (
        <div className='flex justify-between'>
        <div className='flex gap-x-2'>
            <Image src={avatar} alt='WW' width={50} height={50} className='rounded-full border-white'/>
            <div>
                <div className='text-sm font-semibold leading-6 text-gray-900'>{name}</div>
                {/* <div className='text-gray-500 text-xs font-normal leading-relaxed'>{trucateAddress(address)}</div> */}
                <div className='flex gap-x-2 items-center'>
                    {/* <div className='flex text-clip'>
                    {trucateAddress(address)}
                    </div> */}
                    <div className='text-gray-500 text-xs font-normal leading-relaxed'>{trucateAddress(address)}</div>
                    <Toast.Provider swipeDirection="right">
                        <button  onClick={handleAddressCopy}>
                            <ClipboardDocumentIcon className="h-4 w-4 flex-none font-bold text-gray-500 hover:text-gray-800" aria-hidden="true"/>
                        </button>
                        <Toast.Root         
                            open={addressOpen}
                            onOpenChange={setAddressOpen} className='fixed bottom-18 right-8 z-50 flex gap-x-2 items-center shadow-lg bg-sky-500 text-white rounded-xl'>
                            <Toast.Description className='font-bold px-2 py-1'>copied!</Toast.Description>
                            {/* <Toast.Close aria-label="Close" className='font-bold text-xl'>
                                <span aria-hidden>×</span>
                            </Toast.Close> */}
                        </Toast.Root>
                        <Toast.Viewport />
                    </Toast.Provider>
                </div>
            </div>
        </div>
        <button>
            <EllipsisVerticalIcon className='w-8 h-8 text-slate-700'/>
        </button>
    </div>
    )
}
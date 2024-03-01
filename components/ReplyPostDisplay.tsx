import { ProfileDB } from "@/types/profile"
import React, { useState, useEffect } from "react"
import Image from 'next/image';
import * as Toast from '@radix-ui/react-toast';
import { useRouter } from 'next/navigation';
import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import { trucateAddress } from "@/lib/shared/utils";
import { ReplyDB, TransactionDB } from "@/types/transaction";
import { SUI_MIST } from '@/lib/constant';
import { sui } from "@/lib/api/shinami";


export default function ReplyPostDisplay ({txprofile, tx}
    : 
    {txprofile: any, tx: TransactionDB}) {
    const [txAddressOpen, setTxAddressOpen] = useState(false)
    const timerRef = React.useRef(0);
    const [txPoolData, setTxPoolData] = useState<any>()
    const [loading, setLoaiding] = useState(true);
    const router = useRouter();
    let txNumberofBought = txPoolData?.data?.content?.fields.no_of_accessors
    let _currentTxPrice = txPoolData?.data?.content?.fields.price
    let currentTxPrice = ''
    if (_currentTxPrice) {
        let price = parseInt(_currentTxPrice)
        currentTxPrice = ( price / SUI_MIST).toFixed(4)
    }
    let txavatar = ''
    let txname = ''
    let txaddress = ''
    if (txprofile) {
        txavatar = txprofile?.data?.content?.fields?.avatar
        txname = txprofile?.data?.content?.fields?.name
        txaddress = txprofile?.data?.content?.fields?.owner
    }

    const handleTxAddressCopy = () => {
        navigator.clipboard.writeText(txaddress) // Write text to clipboard
        .then(() => {
          setTxAddressOpen(false);
          window.clearTimeout(timerRef.current);
          timerRef.current = window.setTimeout(() => {
          setTxAddressOpen(true);
        }, 100);
        })
        .catch(err => {
          console.error("Failed to copy text: ", err);
          // alert("Failed to copy text. Please try again.");
        });
    }

    useEffect(() => {
        const fetchData = async () => {

            let txpooldata: any = await sui.getObject({
                id: tx.pool_id,
                options: { showBcs: true, showContent: true, showDisplay: true, showOwner: true, showPreviousTransaction: true, showStorageRebate: true, showType: true } 
            })
            setTxPoolData(txpooldata);
            
            // if (data) {
            //     console.log('in transaction ' + txs[0].pool_id)
            //     console.log('in transaction ' + JSON.stringify(data?.data?.content?.fields.price))
            //     //console.log('in transaction ' + data?.data?.content?.fields.no_of_accessors)
            // }
            setLoaiding(false);
        }
        fetchData()
    }, [tx.pool_id])

    if(loading) {
        return <div>Loading</div>
    }

    return (
        <div className='bg-white shadow-lg rounded-xl border-2 mt-2 hover:bg-slate-100' onClick={() => router.push(`/transaction/${tx.digest}`)}>
        <div className='p-2'>
            <div className='flex gap-x-2'>
                <Image src={txavatar} alt='WW' width={25} height={25} className='rounded-full border-white'/>
                <div className='text-sm font-semibold leading-6 text-gray-900'>{txname}</div>
                <div className='flex gap-x-2 items-center'>
                    <div className='text-gray-500 text-xs font-normal leading-relaxed'>{trucateAddress(txaddress)}</div>
                    <Toast.Provider swipeDirection="right">
                        <button  onClick={handleTxAddressCopy}>
                            <ClipboardDocumentIcon className="h-4 w-4 flex-none font-bold text-gray-500 hover:text-gray-800" aria-hidden="true"/>
                        </button>
                        <Toast.Root         
                            open={txAddressOpen}
                            onOpenChange={setTxAddressOpen} className='fixed bottom-18 right-8 z-50 flex gap-x-2 items-center shadow-lg bg-sky-500 text-white rounded-xl'>
                            <Toast.Description className='font-bold px-2 py-1'>copied!</Toast.Description>
                            {/* <Toast.Close aria-label="Close" className='font-bold text-xl'>
                                <span aria-hidden>×</span>
                            </Toast.Close> */}
                        </Toast.Root>
                        <Toast.Viewport />
                    </Toast.Provider>
                </div>
            </div>
            <div className='mt-2 truncate'>
                {tx.public_content}
            </div>
            <div className='flex items-center justify-between'>
                <div className='mt-2 text-xs text-gray-500' >
                    created at <time>{tx.create_at?.toString().substring(0,10)}</time>
                </div>
                <div className='flex gap-x-2 mx-1 items-center'>
                        <div className='text-sky-500 text-base font-medium leading-relaxed'>{txNumberofBought}</div>
                        <div className='text-base font-semibold leading-relaxed text-gray-400'>bought</div>
                </div>
                <div className='bg-white rounded-3xl flex items-center px-2 gap-x-2'>
                    <Image src='/images/sui.png' alt='WW' width={25} height={25} className='py-1'/>
                    <span className='text-center text-sky-500 text-base font-medium leading-relaxed'>{currentTxPrice}</span>
                </div>
            </div>
        </div>
    </div> 
    )
}
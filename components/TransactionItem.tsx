import { TransactionList } from "@/types/transaction";
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { sui } from '@/lib/api/shinami';
import Image from 'next/image';
import { SUI_MIST } from '@/lib/constant';
import { trucateAddress } from "@/lib/shared/utils";
import * as Toast from '@radix-ui/react-toast';
import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";


export default function TransactionItem({t, onLoadingChange} : {t: TransactionList, onLoadingChange: (loading: boolean) => void}) {
    const router = useRouter()
    let timestamp = <time>{t.create_at.toString().substring(0,10)}</time>;
    const [pool, setPool] = useState<any>()
    const [open, setOpen] = useState(false);
    const timerRef = React.useRef(0);
    let price = pool?.data?.content?.fields?.price;
    if (price > 0) {
      price = (price / SUI_MIST).toFixed(4)
    }

    useEffect(() => {
      const fetchData = async () => {
        let pooldata = await sui.getObject({
          id: t.pool_id,
          options: { showBcs: true, showContent: true, showDisplay: true, showOwner: true, showPreviousTransaction: true, showStorageRebate: true, showType: true } 
        })
        setPool(pooldata)
      }
      fetchData()
    }, [t.pool_id])

    const handleClick = () => {
      onLoadingChange(true)
      router.push(`/transaction/${t.digest}`)
    }

    const handleCopyClick = () => {
      navigator.clipboard.writeText(t.digest) // Write text to clipboard
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
      <li key={t.id} className="relative flex justify-between gap-x-6 hover:bg-gray-50">
          <div className='flex flex-col px-3 py-2'>
            <div className="flex flex-1 gap-x-2 items-center">
              <div className='text-sm font-semibold leading-6 text-gray-900'>{trucateAddress(t.digest)}</div>
              <div className="text-sm text-slate-500">{t.type}</div>
              <Toast.Provider swipeDirection="right">
                <button  onClick={handleCopyClick}>
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
            <div onClick={handleClick}>
            <div className='text-sm leading-relaxed text-gray-900 mt-2 break-all truncate'>
              {t.public_content}
            </div>
            <div className="flex flex-1 gap-x-4">
              {/* <p className="text-sm leading-6 text-gray-900">{t.account}</p> */}
                <p className="mt-1 text-xs leading-5 text-gray-500">
                  created {timestamp}
                  {/* submitted <time dateTime={t.create_at}>{t.create_at}</time> */}
                </p>
                <div className="mt-1 text-xs leading-5 text-sky-500 flex items-center gap-x-1">
                    {pool?.data?.content?.fields?.no_of_accessors}
                    <span className="text-xs leading-5 text-gray-500">bought</span>
                </div>
                <div className="mt-1 text-xs leading-5 text-gray-500 flex items-center gap-x-1">
                    <Image src='/images/sui.png' alt='WW' width={20} height={20} className=''/>
                    <span className='text-center text-sky-500 text-xs leading-relaxed'>{price}</span>
                    
                </div>
            </div>
            </div>

          </div>
          <div className="flex shrink-0 items-center gap-x-4">
            <ChevronRightIcon className="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />
          </div>
      </li>
    )
}
import Image from 'next/image';
import { ChevronRightIcon, EllipsisVerticalIcon } from '@heroicons/react/20/solid'
import React, { useEffect, useState , useRef} from 'react'
import { sui } from '@/lib/api/shinami'
import { SUI_MIST } from '@/lib/constant';

export default function TokenItem({item, slug} : {item: any, slug: string}) {
    let [balance, setBalance] = useState<any>({})

    useEffect(() => {
        const getBalacne = async () => {
            let balance = await sui.getBalance({
                owner: slug,
                coinType: '0x2::sui::SUI' 
            })
            setBalance(balance)
        }
        getBalacne()
    }, [slug])

    let _balance = ''
    if (balance) {
        let balanceint = parseInt(balance.totalBalance)
        _balance = ( balanceint / SUI_MIST).toFixed(4)
    }

    return (
        <div className="flex justify-between items-center group hover:bg-slate-100 py-2">
            <div className='flex gap-x-4 items-center'>
                <Image src={item.imageURL} alt='WW' width={25} height={25} className='py-1'/>
                <span className='font-bold text-gray-500'>SUI</span>
                <span className='text-center text-sky-500 text-base font-medium leading-relaxed'>{_balance}</span>
            </div>
            <div>
                <ChevronRightIcon className="h-5 w-5 flex-none text-gray-400 align-middle" aria-hidden="true"/>
            </div>
        </div>
    )
}
import { sui } from '@/lib/api/shinami'
import { SUI_MIST } from '@/lib/constant'
import { trucateAddress } from '@/lib/shared/utils'
import { AccessDB } from '@/types/transaction'
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'


export default function AccessItem({ item, onLoadingChange }: {item: AccessDB,  onLoadingChange: (loading: boolean) => void }) {
    const [profile, setProfile] = useState<any>()

    useEffect(() => {
        const getData = async () => {
            let data: any = await sui.getObject({
                id: item.profile_id,
                options: { showBcs: true, showContent: true, showDisplay: true, showOwner: true, showPreviousTransaction: true, showStorageRebate: true, showType: true } 
            })
            setProfile(data);
        }
        getData()
    }, [item.profile_id])

    let avatar = ''
    let name = ''
    let address = ''
    if (profile) {
        avatar = profile?.data?.content?.fields?.avatar
        name = profile?.data?.content?.fields?.name
        address =  trucateAddress(profile?.data?.content?.fields?.owner)
    }
    let price = parseInt(item.price)
    let decimalPrice = '0'
    if (price > 0) {
        decimalPrice = (price / SUI_MIST).toFixed(4)
    }

    return (
        <div key={item.id} className="relative flex group justify-between gap-x-2 items-center hover:bg-gray-50">
            <div className='flex gap-x-2 items-center'>
                <div>
                    <Image src={avatar} alt='WW' width={30} height={30} className='rounded-full border-white'/>
                </div>
                <div className='py-2 text-sm text-gray-500 truncate'>
                    {name}
                </div>
                <div className='py-2 text-sm text-gray-500 truncate'>
                    {address}
                </div>
                <div className='py-2 text-sm text-gray-500 truncate'>
                    {item.type}
                </div>
            </div>
            <div className='flex gap-x-2 items-center justify-between'>
                <div className='flex gap-x-2 items-center'>
                    <Image src='/images/sui.png' alt='WW' width={25} height={25} className='rounded-full border-white py-2'/>
                    <div className='py-2 text-sm text-gray-500 truncate'>
                        {decimalPrice}
                    </div>
                </div>
                <div>
                <ChevronRightIcon className='w-5 h-5 text-gray-500'/>
                </div>
            </div>
        </div>    
    )
}
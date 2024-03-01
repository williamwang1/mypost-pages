import { PROFILE_GET_ROUTE } from '@/lib/api/constant'
import { API_HOST } from '@/lib/api/move'
import { sui } from '@/lib/api/shinami'
import { SUI_MIST } from '@/lib/constant'
import { trucateAddress } from '@/lib/shared/utils'
import { ProfileDB } from '@/types/profile'
import { AccessDB, ReplyAccessDB } from '@/types/transaction'
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import Image from 'next/image'
import { useEffect, useState } from 'react'


export default function TransactionHistoryItem({reply}: {reply: ReplyAccessDB}) {
    const [profile, setProfile] = useState<any>()
    let avatar = ''
    let name = ''
    let address = ''
    if (profile) {
        avatar = profile?.data?.content?.fields?.avatar
        name = profile?.data?.content?.fields?.name
        address =  trucateAddress(profile?.data?.content?.fields?.owner)
    }
    let price = parseInt(reply.price)
    let decimalPrice = '0'
    if (price > 0) {
        decimalPrice = (price / SUI_MIST).toFixed(4)
    }
    useEffect(() => {
        const getData = async () => {
            let body = {
                slug: reply.address
            }
            const accessorProfileDB = await fetch(`${API_HOST}${PROFILE_GET_ROUTE}`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            })
            const accessorProfile : ProfileDB = await accessorProfileDB.json();
            
            let data: any = await sui.getObject({
                id: accessorProfile.profile_id,
                options: { showBcs: true, showContent: true, showDisplay: true, showOwner: true, showPreviousTransaction: true, showStorageRebate: true, showType: true } 
            })
            setProfile(data);
        }
        getData()
    }, [reply.address])
    return (
        <div key={reply.id} className="relative flex group justify-between gap-x-2 items-center hover:bg-gray-50">
            <div className='flex gap-x-2 items-center'>
                <div>
                    <Image src={avatar} alt='WW' width={30} height={30} className='rounded-full border-white'/>
                </div>
                <div className='py-2 text-sm text-gray-500 truncate'>
                    {name}
                </div>
                <div className='py-2 text-sm text-gray-500 truncate'>
                    {reply.address.substring(0, 6) + '...'}
                </div>
                <div className='py-2 text-sm text-gray-500 truncate'>
                    {reply.type}
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
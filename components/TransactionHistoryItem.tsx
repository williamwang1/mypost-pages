import { AccessHistory } from '@/types/transaction'
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import Image from 'next/image'


export default function TransactionHistoryItem({transaction, profile}: {transaction: AccessHistory, profile: any}) {
    let avatar = profile?.data?.content?.fields?.avatar
    let name = profile?.data?.content?.fields?.name
    let address = profile?.data?.content?.fields?.owner
    return (
        <li key={transaction.id} className="relative flex group justify-between gap-x-2 items-center hover:bg-gray-50">
            <div className='flex gap-x-2 items-center'>
                <div>
                    <Image src={avatar} alt='WW' width={30} height={30} className='rounded-full border-white'/>
                </div>
                <div className='py-2 text-sm text-gray-500 truncate'>
                    {name}
                </div>
                <div className='py-2 text-sm text-gray-500 truncate max-w-20'>
                    {transaction.address}
                </div>
                <div className='py-2 text-sm text-gray-500 truncate'>
                    {transaction.type}
                </div>
            </div>
            <div className='flex gap-x-2 items-center'>
                <div className='flex flex-1 gap-x-2 items-center'>
                    <Image src='/images/sui.png' alt='WW' width={25} height={25} className='rounded-full border-white py-2'/>
                    <div className='py-2 text-sm text-gray-500 truncate'>
                        {transaction.price}
                    </div>
                </div>
                <div>
                <ChevronRightIcon className='w-5 h-5 text-gray-500'/>
                </div>
            </div>
        </li>    
    )
}
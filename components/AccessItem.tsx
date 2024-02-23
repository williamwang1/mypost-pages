import { SUI_MIST } from '@/lib/constant'
import { AccessHistory } from '@/types/transaction'
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import Image from 'next/image'


export default function AccessItem({transaction, profile}: {transaction: AccessHistory, profile: any}) {
    let avatar = profile?.data?.content?.fields?.avatar
    let name = profile?.data?.content?.fields?.name
    // let address = profile?.data?.content?.fields?.owner
    let price = parseInt(transaction.price)
    let decimalPrice = '0'
    if (price > 0) {
        decimalPrice = (price / SUI_MIST).toFixed(4)
    }
    return (
        <div key={transaction.id} className="relative flex group justify-between gap-x-2 items-center hover:bg-gray-50">
            <div className='flex gap-x-2 items-center'>
                <div>
                    <Image src={avatar} alt='WW' width={30} height={30} className='rounded-full border-white'/>
                </div>
                <div className='py-2 text-sm text-gray-500 truncate'>
                    {name}
                </div>
                <div className='py-2 text-sm text-gray-500 truncate'>
                    {transaction.address}
                </div>
                <div className='py-2 text-sm text-gray-500 truncate'>
                    {transaction.type}
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
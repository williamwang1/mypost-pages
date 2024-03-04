import Image from 'next/image';
import { SUI_MIST } from '@/lib/constant';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { sui } from '@/lib/api/shinami';
import { ReplyDB, RepostDB } from '@/types/transaction';

export default function RepostFooter ({repost, poolData, onPoolDataChange} 
    : 
    {repost: RepostDB, poolData: any, onPoolDataChange: (poolData: any) => void}) {

    const [loading, setLoaiding] = useState(true);
    let numberofBought = poolData?.data?.content?.fields.no_of_accessors
    let _currentPrice = poolData?.data?.content?.fields.price
    let currentPrice = ''
    if (_currentPrice) {
        let price = parseInt(_currentPrice)
        currentPrice = ( price / SUI_MIST).toFixed(4)
    }
    // useEffect(() => {
    //     const fetchData = async () => {

    //         let data: any = await sui.getObject({
    //             id: repost.pool_id,
    //             options: { showBcs: true, showContent: true, showDisplay: true, showOwner: true, showPreviousTransaction: true, showStorageRebate: true, showType: true } 
    //         })
    //         onPoolDataChange(data);
            
    //         // if (data) {
    //         //     console.log('in transaction ' + txs[0].pool_id)
    //         //     console.log('in transaction ' + JSON.stringify(data?.data?.content?.fields.price))
    //         //     //console.log('in transaction ' + data?.data?.content?.fields.no_of_accessors)
    //         // }
    //         setLoaiding(false);
    //     }
    //     fetchData()
    // }, [onPoolDataChange, repost.pool_id])

    // if (loading) {
    //     return <div>Footer Loading</div>
    // }

    return (
        <div className='flex items-center justify-between mt-2'>
            <div className='mt-2 text-xs text-gray-500' >
                created at <time>{repost.create_at?.toString().substring(0,10)}</time>
            </div>
            <div className='flex gap-x-2 mx-1 items-center'>
                    <div className='text-sky-500 text-base font-medium leading-relaxed'>{numberofBought}</div>
                    <div className='text-base font-semibold leading-relaxed text-gray-400'>bought</div>
            </div>
            <div className='bg-white rounded-3xl flex items-center px-2 gap-x-2'>
                <Image src='/images/sui.png' alt='WW' width={25} height={25} className='py-1'/>
                <span className='text-center text-sky-500 text-base font-medium leading-relaxed'>{currentPrice}</span>
            </div>
    </div>
    )
}
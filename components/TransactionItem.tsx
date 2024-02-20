import { TransactionList } from "@/types/transaction";
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { sui } from '@/lib/api/shinami';
import Image from 'next/image';
import { SUI_MIST } from '@/lib/constant';


export default function TransactionItem({t} : {t: TransactionList}) {
    const router = useRouter()
    let timestamp = <time>{t.create_at.toString().substring(0,10)}</time>;
    const [pool, setPool] = useState<any>()
    const [loading, setLoading] = useState(false)
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
      setLoading(true)
      router.push(`/transaction/${t.digest}`)
    }

    if (loading) {
      return (
        <div>Loaidng</div>
      )
    }

    return (
      <li key={t.id} className="relative flex group justify-between gap-x-6 hover:bg-gray-50" onClick={handleClick}>
          <div className='flex flex-col px-3 py-2'>
            <div className='text-sm font-semibold leading-6 text-gray-900 truncate max-w-xs'>{t.digest}</div>
            <p className='text-sm leading-relaxed text-gray-900 mt-2 break-all'>
              {t.summary}
            </p>
            <div className="flex justify-between">
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
          <div className="flex shrink-0 items-center gap-x-4">
            <ChevronRightIcon className="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />
          </div>
      </li>
    )
}
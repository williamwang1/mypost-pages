import { TransactionData } from "@/types/transaction";
import { ChevronRightIcon } from '@heroicons/react/20/solid'


export default function TransactionItem({t} : {t: TransactionData}) {

    return (
        <li key={t.id} className="relative flex group justify-between gap-x-6 hover:bg-gray-50">
          <div className='flex flex-col px-3 py-2'>
            <div className='text-sm font-semibold leading-6 text-gray-900 truncate max-w-xs'>{t.digest}</div>
            <p className='text-sm leading-relaxed text-gray-900 mt-2 break-all'>
              {t.summary}
            </p>
            <div className="flex flex-col">
              {/* <p className="text-sm leading-6 text-gray-900">{t.account}</p> */}
              {t.create_at ? (
                <p className="mt-1 text-xs leading-5 text-gray-500">
                  submitted <time>{t.create_at}</time>
                  {/* submitted <time dateTime={t.create_at}>{t.create_at}</time> */}
                </p>
              ) : (
                <div className="mt-1 flex items-center gap-x-1.5">
                  <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </div>
                  <p className="text-xs leading-5 text-gray-500">submitted just now</p>
                </div>
              )}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-x-4">
            <ChevronRightIcon className="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />
          </div>
      </li>
    )
}
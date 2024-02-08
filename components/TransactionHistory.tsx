import { ChevronRightIcon } from '@heroicons/react/20/solid'
import React, { useEffect, useState, useRef } from 'react'
import { API_HOST } from '@/lib/api/move';
import { useRouter } from 'next/navigation'
import { ACCESS_HISTORY_LIST_ROUTE, ACCESS_CHECK_ROUTE } from '@/lib/api/constant'
import InfiniteScroll from "react-infinite-scroll-component";
import { AccessHistory } from '@/types/transaction';
import TransactionHistoryItem from './TransactionHistoryItem';
import { useBuyMutation } from '@/lib/hooks/api';
import { sui } from '@/lib/api/shinami';
import { TransactionList } from '@/types/transaction';
import { AlignHorizontalDistributeCenterIcon } from 'lucide-react';


export default function TransactionHistory({slug, profile, session, pool, txs}: 
  {slug: string, profile: any, session: any, pool: any, txs: TransactionList[]}) {
    const { isLoading, user, localSession } = session;
    const [items, setItems] = useState<AccessHistory[]>([]);
    const [hasMore, setHasMore] = useState(true);

    const [page, setPage] = useState(1);
    const isInitialRender = useRef(true);
    const [loading, setLoading] = useState(true)
    let price = pool?.data?.content?.fields.price;


    const fetchData = async (currentPage: number) => {
        //console.log('in fectch data ' + currentPage)
        setLoading(true); 
        try {
          const accessdb = await fetch(`${API_HOST}${ACCESS_HISTORY_LIST_ROUTE}`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ slug, currentPage }),
          })
          const newData : AccessHistory[] = await accessdb.json();
          // let checkBody = {
          //   slug: slug,
          //   address: user.wallet
          // }
          // const accessCheckB = await fetch(`${API_HOST}${ACCESS_CHECK_ROUTE}`, {
          //   method: 'POST',
          //   headers: {
          //   'Content-Type': 'application/json',
          //   },
          //   body: JSON.stringify(checkBody),
          // })
          // const accessCheck : AccessHistory[] = await accessCheckB.json();
          // console.log('in history client ' + JSON.stringify(accessCheck))
          // if (accessCheck.length > 0) {
          //     setBought(true)
          // }
          //console.log('in fetch data ' + JSON.stringify(newData))
          if (newData.length === 0) {
            setHasMore(false);
          } else {
            //console.log('tx history ' + JSON.stringify(newData))
            setItems((prevItems) => [...prevItems, ...newData]);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          // Handle error appropriately
        } finally {
          setLoading(false); // Set loading to false after fetching data
        }
    
    }


    useEffect(() => {
        if (isInitialRender.current) {
            isInitialRender.current = false;
            return;
          }
        fetchData(page);

    }, [page])


    return (
        <div className=' bg-white w-auto h-auto mt-2'>
            <div className='mt-2 flex justify-between items-center'>
                <div className='text-black text-lg font-bold leading-7'>
                    Trading History
                </div>
            </div>
            <InfiniteScroll
                dataLength={items.length}
                next={() => setPage((prevPage) => prevPage + 1)}
                hasMore={hasMore}
                loader={loading && <h1>Loading...</h1>}
                endMessage={
                <p style={{ textAlign: 'center' }}>
                    <b>no more data</b>
                </p>
                }
            >
                <div
                role="list"
                className="divide-y divide-gray-100 mt-2 overflow-hidden bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl"
                 >
                    {items && items.map((transaction) => (
                        <TransactionHistoryItem transaction={transaction} key={transaction.id} profile={profile}/>
                    ))}
                </div>
            </InfiniteScroll>
            
        {/* </table> */}
        </div>
    )
}
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import React, { useEffect, useState, useRef } from 'react'
import { API_HOST } from '@/lib/api/move';
import { useRouter } from 'next/navigation'
import { ACCESS_HISTORY_LIST_ROUTE } from '@/lib/api/constant'
import InfiniteScroll from "react-infinite-scroll-component";
import { AccessHistory } from '@/types/transaction';
import TransactionHistoryItem from './TransactionHistoryItem';
import { AlignHorizontalDistributeCenterIcon } from 'lucide-react';

const transactions = [
    {
        id: '2DTbJx...bgBkqseddddddddddddd',
        name: 'william.wang',
        //address: '0xer343ffd..............',
        type: 'buy',
        price: '2.34',
        
        // timestamp: '3rd Nov 2023',
        // status: 'confirmed',
      },
    // More transactions...
]

const headers = [
    'Profile',
    'Name',
    // 'Address',
    'Type',
    'Price',

    // 'Timestamp',
    // 'Status'
]

export default function TransactionHistory({slug, profile}: {slug: string, profile: any}) {
    const [items, setItems] = useState<AccessHistory[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const isInitialRender = useRef(true);
    const [loading, setLoading] = useState(true)

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
        {/* <table className="min-w-full divide-y divide-gray-300">
            <thead>
                <tr>
                    {headers.map((header) => (
                        <th
                            scope="col"
                            className="whitespace-nowrap py-2 text-left text-sm font-semibold text-gray-900"
                            key={header}
                        >
                            {header}
                        </th>
                    ))}
                </tr>
            </thead> */}
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
                <ul
                role="list"
                className="divide-y divide-gray-100 mt-2 overflow-hidden bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl"
                 >
                    {items && items.map((transaction) => (
                        <TransactionHistoryItem transaction={transaction} key={transaction.id} profile={profile}/>
                    ))}
                </ul>
            </InfiniteScroll>
            
        {/* </table> */}
        </div>
    )
}
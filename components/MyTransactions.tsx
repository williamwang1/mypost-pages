import React, { useState, useEffect, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import TransactionItem from "./TransactionItem";
import { API_HOST } from '@/lib/api/move';
import { TransactionList } from "@/types/transaction";

const MyTransactions = ({slug}: {slug: string}) => {
  const [items, setItems] = useState<TransactionList[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const isInitialRender = useRef(true);

  const fetchData = async (currentPage: number) => {
    //console.log('in fectch data ' + currentPage)
    const transactionsdb = await fetch(`${API_HOST}/api/transactionmeta/getlist`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug, currentPage }),
      })
  
      const newData : TransactionList[] = await transactionsdb.json();
      //console.log('in fetch data ' + JSON.stringify(newData))
      if (newData.length === 0) {
        setHasMore(false);
      } else {
        setItems((prevItems) => [...prevItems, ...newData]);
      }
  }

  useEffect(() => {
    if (isInitialRender.current) {
        isInitialRender.current = false;
        return;
      }
    fetchData(page);
  }, [page]);


  return (
    <InfiniteScroll
      dataLength={items.length}
      next={() => setPage((prevPage) => prevPage + 1)}
      hasMore={hasMore}
      loader={<div>Loading</div>}
    >
      <ul
        role="list"
        className="divide-y divide-gray-100 mt-2 overflow-hidden bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl mb-14"
      >
            {items &&
              items.map((item) => <TransactionItem key={item.id} t={item}/>)}
      </ul>
    </InfiniteScroll>
  );
};

export default MyTransactions;
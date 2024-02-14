import React, { useState, useEffect, useRef, useCallback } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import TransactionItem from "./TransactionItem";
import { API_HOST } from '@/lib/api/move';
import { TransactionList } from "@/types/transaction";

const MyTransactions = ({slug}: {slug: string}) => {
  const [items, setItems] = useState<TransactionList[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const isInitialRender = useRef(true);
  const [loading, setLoading] = useState(true);

  const fetchData = async (currentPage: number) => {
    //console.log('in fectch data ' + currentPage)
    setLoading(true); 
    try {
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
      setPage((prevPage) => prevPage + 1)
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
    const getData = async (currentPage: number) => {
      //console.log('in fectch data ' + currentPage)
      setLoading(true); 
      try {
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
        setPage((prevPage) => prevPage + 1)
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle error appropriately
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    }
    getData(1);
  }, [slug]);


  return (
    <InfiniteScroll
      dataLength={items.length}
      next={() => fetchData(page)}
      hasMore={hasMore}
      loader={loading && <div>Loading</div>}
      endMessage={
        <p style={{ textAlign: 'center' }}>
          <b>no more data</b>
        </p>}
    >
      <div
        role="list"
        className="divide-y divide-gray-100 mt-2 overflow-hidden bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl"
      >
            {items &&
              items.map((item) => <TransactionItem key={item.id} t={item}/>)}
      </div>
    </InfiniteScroll>
  );
};

export default MyTransactions;
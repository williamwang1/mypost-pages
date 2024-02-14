import { ChevronRightIcon, EllipsisVerticalIcon } from '@heroicons/react/20/solid'
import { useRouter } from 'next/navigation'
import FollowingItem from './FollowingItem'
import React, { useState, useEffect, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { FollowData } from '@/types/follow';
import { API_HOST } from '@/lib/api/move';
import { FOLLOW_FOLLOWING_LIST_ROUTE } from '@/lib/api/constant'


export default function MyFollowings({slug}: {slug: string}) {
  const router = useRouter()
  const [items, setItems] = useState<FollowData[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const isInitialRender = useRef(true);
  const [loading, setLoading] = useState(true);

  const fetchData = async (currentPage: number) => {
    //console.log('in fectch data ' + currentPage)
    setLoading(true); 
    try {
      const transactionsdb = await fetch(`${API_HOST}${FOLLOW_FOLLOWING_LIST_ROUTE}`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug, currentPage }),
      })
  
      const newData : FollowData[] = await transactionsdb.json();
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
    // if (isInitialRender.current) {
    //     isInitialRender.current = false;
    //     return;
    //   }
    const getData = async (currentPage: number) => {
      //console.log('in fectch data ' + currentPage)
      setLoading(true); 
      try {
        const transactionsdb = await fetch(`${API_HOST}${FOLLOW_FOLLOWING_LIST_ROUTE}`, {
          method: 'POST',
          headers: {
          'Content-Type': 'application/json',
          },
          body: JSON.stringify({ slug, currentPage }),
        })
    
        const newData : FollowData[] = await transactionsdb.json();
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
      loader={loading && <h1>Loading...</h1>}
      endMessage={
      <p style={{ textAlign: 'center' }}>
        <b>no more data</b>
      </p>}
    >
    <div
      role="list"
      className="divide-y divide-gray-100 overflow-hidden bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl"
    >
      {items && items.map((f) => (
        <FollowingItem f={f} key={f.id}/>
      ))}
    </div>
    </InfiniteScroll>
  )
}

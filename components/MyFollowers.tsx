import { ChevronRightIcon, EllipsisVerticalIcon } from '@heroicons/react/20/solid'
import React, { useState, useEffect, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { FollowData } from '@/types/follow';
import { API_HOST } from '@/lib/api/move';
import { useRouter } from 'next/navigation'
import { FOLLOW_FOLLOWER_LIST_ROUTE } from '@/lib/api/constant'
import FollowerItem from './FollowerItem';
import axios from 'axios';

export default function MyFollowers({slug}: {slug: string}) {
  const [items, setItems] = useState<FollowData[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const isInitialRender = useRef(true);
  const [loading, setLoading] = useState(true)

  const fetchMoreData = () => {
    axios
      .post(`${API_HOST}${FOLLOW_FOLLOWER_LIST_ROUTE}`, { slug: slug,  currentPage: page })
      .then((res) => {
        console.log('in my followers ' + JSON.stringify(res.data))
        if (res.data.length === 0) {
          setHasMore(false);
        }  else {
          setItems((prevItems) => [...prevItems, ...res.data]);
        }
      })
      .catch((err) => console.log(err));
      setLoading(false)
    setPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    const getData = async () => {
      //console.log('in my transaction ' + currentPage)
      axios
          .post(`${API_HOST}${FOLLOW_FOLLOWER_LIST_ROUTE}`, { slug: slug,  currentPage: 1 })
          .then((res) =>{
            if (res.data.length === 0) {
              setHasMore(false);
            }  else {
              setItems(res.data);
            }
              setLoading(false)
          })
          .catch((err) => console.log(err));
    }

    getData()
  }, [slug]);

  const handleLoading = (loading: boolean) => {
    setLoading(loading)
  }

  if (loading) {
    return <div>Loading</div>
  }

  return (
    <InfiniteScroll
      dataLength={items.length}
      next={fetchMoreData}
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
      className="divide-y divide-gray-100 overflow-hidden bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl"
    >
      {items && items.map((f) => 
          <FollowerItem f={f} key={f.id} onLoadingChange={handleLoading} slug={slug}/>
      )}
    </div>
    </InfiniteScroll>
  )
}

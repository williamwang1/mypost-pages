import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import TransactionItem from "./TransactionItem";
import { API_HOST } from '@/lib/api/move';
import { AccessDB } from "@/types/transaction";
import { ACCESS_PROFILE_LIST_ROUTE } from "@/lib/api/constant";
import axios from "axios";
import FollowerItem from "./FollowerItem";
import { FollowData } from "@/types/follow";
import AccessItem from "./AccessItem";

const MyAcesses = ({slug}: {slug: string}) => {
  const [items, setItems] = useState<AccessDB[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(2);
  const [loading, setLoading] = useState(true);

  const fetchMoreData = () => {
    axios
      .post(`${API_HOST}${ACCESS_PROFILE_LIST_ROUTE}`, { slug: slug,  currentPage: page })
      .then((res) => {
        console.log('in my transaction ' + JSON.stringify(res.data))
        //setItems(res.data)
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
          .post(`${API_HOST}${ACCESS_PROFILE_LIST_ROUTE}`, { slug: slug,  currentPage: 1 })
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
    getData();
  }, [slug]);

  const handleLoading = (loading: boolean) => {
    setLoading(loading)
  }


  return (
    <InfiniteScroll
      dataLength={items.length}
      next={fetchMoreData}
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
              items.map((item) => <AccessItem item={item} key={item.id} onLoadingChange={handleLoading}/>)}
      </div>
    </InfiniteScroll>
  );
};

export default MyAcesses;
import React, { useState, useEffect, useRef, useCallback } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { API_HOST } from '@/lib/api/move';
// import { TransactionDB, TransactionDBList } from "@/types/transaction";
import { INVITE_CREATE_ADMIN, INVITE_GET_LIST_ROUTE, TRANSACTION_GET_LIST_ROUTE, TRANSACTION_MUTATEDB_ROUTE } from "@/lib/api/constant";
import axios from "axios";

const AdminProtol = () => {
  const [items, setItems] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(2);
  const [loading, setLoading] = useState(true);

  const handleLoading = (loading: boolean) => {
    setLoading(loading)
  }

  const fetchMoreData = () => {
    axios
      .post(`${API_HOST}${INVITE_GET_LIST_ROUTE}`, { address: 'admin',  currentPage: page })
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
          .post(`${API_HOST}${INVITE_GET_LIST_ROUTE}`, { address: 'admin',  currentPage: 1 })
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
  }, []);

  if (loading) {
    return <div>Loading</div>
  }

  // const handleCreate = async () => {
  //   await create()
  //   await reload()
  // }

  let handleCreate = () => {
    axios
        .post(`${API_HOST}${INVITE_CREATE_ADMIN}`)
        .then((res) => {
            console.log('in my transaction ' + JSON.stringify(res.data))
            //setItems(res.data)
            if (res.data.length === 0) {
                setHasMore(false);
            } else {
                //setItems((prevItems) => [...prevItems, ...res.data]);
                reload()
            }
          })
        .catch((err) => console.log(err));
  }

  let reload = () => {
    setItems([])
    axios
        .post(`${API_HOST}${INVITE_GET_LIST_ROUTE}`, { address: 'admin',  currentPage: 1 })
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
  }
  return (
    <div>
        <button className="bg-sky-400 text-white" onClick={handleCreate}>Create</button>
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
                items.map((item) => 
                <div key={item.id} className="flex gap-x-2">
                    {item.id}
                </div>)}
        </div>
        </InfiniteScroll>
    </div>

  );
};

export default AdminProtol;
import React, { useState, useEffect } from "react";
import { GetServerSideProps } from 'next';
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";
import { AccessDB } from '@/types/transaction';
import { API_HOST } from '@/lib/api/move';
import { useRouter } from 'next/navigation'
import { ACCESS_HISTORY_LIST_ROUTE, ACCESS_CHECK_ROUTE, TRANSACTION_GET_LIST_ROUTE } from '@/lib/api/constant'

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { slug } = context.params as { slug: string };

    return { props: {slug} };
}

function Home3 (
    {slug}: 
  {slug: string}
) {
  const [items, setItems] = useState<AccessDB[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(2);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    axios
      .post(`${API_HOST}${ACCESS_HISTORY_LIST_ROUTE}`, { slug: slug,  currentPage: 1 })
      .then((res) =>{
        setItems(res.data)
        setLoading(false)
      })
      .catch((err) => console.log(err));
  }, [slug]);

  const fetchMoreData = () => {
    axios
      .post(`${API_HOST}${ACCESS_HISTORY_LIST_ROUTE}`, { slug: slug,  currentPage: page })
      .then((res) => {
        setItems((prevItems) => [...prevItems, ...res.data]);

        res.data.length > 0 ? setHasMore(true) : setHasMore(false);
      })
      .catch((err) => console.log(err));
      setLoading(false)
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div className=' bg-white w-auto h-auto mt-2 overflow-y-auto'>
    <div className='mt-2 flex justify-between items-center'>
        <div className='text-black text-lg font-bold leading-7'>
            Trading History
        </div>
    </div>
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
        className="divide-y divide-gray-100 mt-2 overflow-hidden bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl"
         >
            {items && items.map((transaction) => (
                // <TransactionHistoryItem transaction={transaction} key={transaction.id}/>
                <div key={transaction.id}>{transaction.id}</div>
            ))}
        </div>
    </InfiniteScroll>
</div>
  );
};

export default Home3;

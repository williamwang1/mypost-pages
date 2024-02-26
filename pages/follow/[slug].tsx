import Nav from "@/components/Nav";
import React, { Fragment, useState, useRef, useEffect } from 'react' ;
import { SuiEvent, SuiObjectData, SuiObjectResponse } from "@mysten/sui.js/client";
import { withZkLoginSessionRequired, ZkLoginSession } from "@shinami/nextjs-zklogin/client";
import { sui } from '@/lib/api/shinami'
import { ProfileMetadataCreated, ProfileMedata, ProfileData } from "@/types/profile";
import { Tab } from '@headlessui/react'
import { useRouter } from 'next/navigation'
import MyTransactions from '@/components/MyTransactions';
import MyFollowings from '@/components/MyFollowings';
import MyFollowers from '@/components/MyFollowers';
import { API_HOST } from '@/lib/api/move';
import { ACCOUNT_LIST_ROUTE, FOLLOW_HISTORY_LIST_ROUTE, PROFILE_GET_ROUTE } from '@/lib/api/constant';
import { Account } from '@/types/auth';
import { GetServerSideProps, NextPage } from 'next';
import ProfileSummary from "@/components/ProfileSummary";
import MyAcesses from "@/components/MyAcesses";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { FollowData } from "@/types/follow";
import FollowItem from "@/components/FollowItem";

export const getServerSideProps: GetServerSideProps = async (context) => {
    // Extract the id from context.params
    const { slug } = context.params as { slug: string };
  
    // Fetch data using the id or perform other server-side operations
    const metadatadb = await fetch(`${API_HOST}${PROFILE_GET_ROUTE}`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug }),
    })
    const metadata: ProfileMedata = await metadatadb.json();
    console.log('in profile ' + JSON.stringify(metadata))
    if (!metadata) {
        return {
            redirect: {
              destination: `${API_HOST}/account`, // Redirect destination
              permanent: true, // Temporary redirect
            },
        }
    }

    const accountsdb = await fetch(`${API_HOST}${ACCOUNT_LIST_ROUTE}`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
    })

    const accounts: Account[] = await accountsdb.json()
    

    return { props: { metadata, accounts, slug } };
};

const tabs = [
    {id: 0, name: 'Transactions'},
    // {id: 2, name: 'Assets', component: <MyAssets/>, url: '/profile/asset'},
    {id: 1, name: 'Followings'},
    {id: 2, name: 'Followers'},
    {id: 3, name: 'Acesses'}
]

function Follow({metadata, session, accounts, slug} 
    : 
    {metadata: ProfileMedata, profiledata: SuiObjectResponse, 
        session: ZkLoginSession, profilepool: SuiObjectResponse, 
        accounts: Account[], transactions: any, slug: string}) {
    const { user, localSession } = session;
    const [items, setItems] = useState<FollowData[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(2);
    const [itemLoading, setItemLoading] = useState(true);
    const router = useRouter();


    useEffect(() => {
        const fetchData = async () => {
            axios
                .post(`${API_HOST}${FOLLOW_HISTORY_LIST_ROUTE}`, { slug: slug,  currentPage: 1 })
                .then((res) =>{
                    setItems(res.data)
                    setItemLoading(false)
                })
                .catch((err) => console.log(err));
            
            // if (data) {
            //     console.log('in transaction ' + txs[0].pool_id)
            //     console.log('in transaction ' + JSON.stringify(data?.data?.content?.fields.price))
            //     //console.log('in transaction ' + data?.data?.content?.fields.no_of_accessors)
            // }
            //setLoaiding(false);
        }
        fetchData()
    }, [slug])

    const fetchMoreData = () => {
        axios
          .post(`${API_HOST}${FOLLOW_HISTORY_LIST_ROUTE}`, { slug: slug,  currentPage: page })
          .then((res) => {
            setItems((prevItems) => [...prevItems, ...res.data]);
            //setItems(res.data)
            res.data.length > 0 ? setHasMore(true) : setHasMore(false);
          })
          .catch((err) => console.log(err));
          setItemLoading(false)
        setPage((prevPage) => prevPage + 1);
    };

    return (
        <Nav bottomIndex={-1} leftIndex={-1} user={user}>
            <ProfileSummary followingmeta={metadata} accounts={accounts} session={session} slug={slug}/>
            <div className='bg-white shadow-md px-2'>
            <div className='mt-2 flex justify-between items-center'>
                    <div className='text-black text-lg font-bold leading-7'>
                        History
                    </div>
                </div>
                <InfiniteScroll
                    dataLength={items.length}
                    next={fetchMoreData}
                    hasMore={hasMore}
                    loader={itemLoading && <h1>Loading...</h1>}
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
                        {items && items.map((item) => (
                            <FollowItem item={item} key={item.id}/>
                        ))}
                    </div>
                </InfiniteScroll>
            </div>
            
            {/* {JSON.stringify(data)} */}
            {/* {JSON.stringify(filteredtsx)} */}
        </Nav>
        
    )
}



export default withZkLoginSessionRequired(Follow);
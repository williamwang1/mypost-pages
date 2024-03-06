import { GetServerSideProps } from 'next';
import { ZkLoginSession, withZkLoginSessionRequired } from "@shinami/nextjs-zklogin/client";
import Nav from '@/components/Nav';
import { ACCESS_CHECK_ROUTE, ACCESS_HISTORY_LIST_ROUTE, PROFILE_GET_ROUTE, TRANSACTION_GET } from '@/lib/api/constant';
import { API_HOST } from '@/lib/api/move';
import { sui } from '@/lib/api/shinami'
import { ClipboardDocumentIcon, EllipsisVerticalIcon, InformationCircleIcon } from '@heroicons/react/24/outline'
import { TransactionDB } from '@/types/transaction';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Tiptap from '@/components/TipTap';
import { AccessDB } from '@/types/transaction';
import { SUI_MIST } from '@/lib/constant';
import TransactionButton from '@/components/TransactionButton';
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";
import TransactionHistoryItem from '@/components/TransactionHistoryItem';
import { trucateAddress } from '@/lib/shared/utils';
import * as Toast from '@radix-ui/react-toast';
import TransactionHeader from '@/components/TransactionHeader';
import TransactionContent from '@/components/TransactionContent';
import TransactionFooter from '@/components/TransactionFooter';


export const getServerSideProps: GetServerSideProps = async (context) => {
    const { slug } = context.params as { slug: string };
    let tx
    let profiledata
    let transactiondata
    let digest = slug
    try {
        const txdb = await fetch(`${API_HOST}${TRANSACTION_GET}`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ digest }),
        })
        tx = await txdb.json()
        console.log('in trsnaction slug ' + JSON.stringify(txdb))
        if (!tx) {
            return {
                redirect: {
                  destination: `${API_HOST}/notfound`, // Redirect destination
                  permanent: true, // Temporary redirect
                },
            }
        }
        console.log('in transaction slug ' + JSON.stringify(tx))
        profiledata = await sui.getObject({
            id: tx.profile_id,
            options: { showBcs: true, showContent: true, showDisplay: true, showOwner: true, showPreviousTransaction: true, showStorageRebate: true, showType: true } 
        })
        // if (!profiledata) {
        //     return {
        //         redirect: {
        //           destination: `${API_HOST}/profile`, // Redirect destination
        //           permanent: true, // Temporary redirect
        //         },
        //     }
        // }
        transactiondata = await sui.getObject({
            id: tx.transaction_id,
            options: { showBcs: true, showContent: true, showDisplay: true, showOwner: true, showPreviousTransaction: true, showStorageRebate: true, showType: true } 
        })
        //console.log(JSON.stringify(transactiondata))
    } catch (error) {
        console.error("Error fetching data:", error);
        // Handle error appropriately
    } finally {
        //setLoading(false); // Set loading to false after fetching data
    }
    //console.log(JSON.stringify(txs[0]))

    return { props: { tx, profiledata, transactiondata, slug} };
}

function Transaction ({session, profiledata, tx ,transactiondata, slug}
    : 
    {session: any, profiledata: any, tx: TransactionDB, 
        transactiondata: any, slug: string}) {
    const { isLoading, user, localSession } = session;
    const [loading, setLoaiding] = useState(true);
    const [itemLoading, setItemLoading] = useState(true);
    const [access, setAccess] = useState<AccessDB>();
    const [bought, setBought] = useState(false);
    const [unlock, setUnlock] = useState(false);
    const [poolData, setPoolData] = useState<any>()
    const [items, setItems] = useState<AccessDB[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(2);
    let transaction_digest = slug

    const handlePoolDataChange = (poolData: any) => {
        setPoolData(poolData)
    }

    const handleAccessDataChange = (access: any) => {
        setAccess(access)
    }

    const handleBoughtChange = (bought: boolean) => {
        setBought(bought)
    }

    const handleUnlock = (unlcok: boolean) => {
        setUnlock(unlcok)
    }

    const handleLoading = (loading: boolean) => {
        setLoaiding(loading)
    }

    const handleItemsChange = (items: AccessDB[]) => {
        setItems(items)
    }

    useEffect(() => {
        const fetchData = async () => {
            axios
                .post(`${API_HOST}${ACCESS_CHECK_ROUTE}`, { slug: slug,  address: user.wallet })
                .then((res) =>{
                    //console.log('in transaction slug ' + JSON.stringify(res.data))
                    if (res.data.length > 0) {
                        //console.log('in transaction access check ' + JSON.stringify(accessCheck))
                        setBought(true)
                        setAccess(res.data[0]);
                    }
                })
                .catch((err) => console.log(err));
            let data: any = await sui.getObject({
                id: tx.pool_id,
                options: { showBcs: true, showContent: true, showDisplay: true, showOwner: true, showPreviousTransaction: true, showStorageRebate: true, showType: true } 
            })
            setPoolData(data);
            
            axios
                .post(`${API_HOST}${ACCESS_HISTORY_LIST_ROUTE}`, { slug: slug,  currentPage: 1 })
                .then((res) => {
                    setItems(res.data)
                    setItemLoading(false)
                })
                .catch((err) => console.log(err));
            
            // if (data) {
            //     console.log('in transaction ' + txs[0].pool_id)
            //     console.log('in transaction ' + JSON.stringify(data?.data?.content?.fields.price))
            //     //console.log('in transaction ' + data?.data?.content?.fields.no_of_accessors)
            // }
            setLoaiding(false);
        }
        fetchData()
    }, [slug, tx, user.wallet])

    const fetchMoreData = () => {
        axios
          .post(`${API_HOST}${ACCESS_HISTORY_LIST_ROUTE}`, { slug: slug,  currentPage: page })
          .then((res) => {
            setItems((prevItems) => [...prevItems, ...res.data]);
            //setItems(res.data)
            res.data.length > 0 ? setHasMore(true) : setHasMore(false);
          })
          .catch((err) => console.log(err));
          setItemLoading(false)
        setPage((prevPage) => prevPage + 1);
    };


    if (loading) {
        return (
            <Nav bottomIndex={-1} leftIndex={-1} user={user}>
                Loading
            </Nav>
        )
    }
    return (
        <Nav bottomIndex={-1} leftIndex={-1} user={user}>
            <div className='px-2 mt-2'>
                <TransactionHeader profiledata={profiledata}/>
                <TransactionContent txonchain={transactiondata} tx={tx} transaction_digest={transaction_digest}
                unlock={unlock} onUnlockChange={handleUnlock} bought={bought}/> 
                <TransactionFooter tx={tx} poolData={poolData} onPoolDataChange={handlePoolDataChange}/>          
                <TransactionButton session={session} poolData={poolData} 
                onPoolDataChange={handlePoolDataChange} tx={tx} slug={slug}
                accessData={access} onAccessChange={handleAccessDataChange}  bought={bought} 
                onBoughtchange={handleBoughtChange} onLoadingChange={handleLoading} 
                onUnlockchange={handleUnlock} onItemsChange={handleItemsChange}/>
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
                            {items && items.map((transaction) => (
                                <TransactionHistoryItem transaction={transaction} key={transaction.id}/>
                            ))}
                        </div>
                    </InfiniteScroll>
                </div>
            </div>
        </Nav>
    )
}

export default withZkLoginSessionRequired(Transaction);
import { GetServerSideProps } from 'next';
import { ZkLoginSession, withZkLoginSessionRequired } from "@shinami/nextjs-zklogin/client";
import Nav from '@/components/Nav';
import { REPLY_ACCESS_CHECK_ROUTE, REPLY_ACCESS_HISTORY_LIST_ROUTE, REPLY_GET, TRANSACTION_GET } from '@/lib/api/constant';
import { API_HOST } from '@/lib/api/move';
import { sui } from '@/lib/api/shinami'
import { ReplyAccessDB, ReplyDB, TransactionDB } from '@/types/transaction';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { SUI_MIST } from '@/lib/constant';
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";
import ReplyButton from '@/components/ReplyButton';
import { useRouter } from 'next/navigation';
import ReplyHistoryItem from '@/components/ReplyHistoryItem';
import ReplyPostDisplay from '@/components/ReplyPostDisplay';
import ReplyHeader from '@/components/ReplyHeader';
import ReplyContent from '@/components/ReplyContent';
import ReplyFooter from '@/components/ReplyFooter';


export const getServerSideProps: GetServerSideProps = async (context) => {
    const { slug, digest } = context.query as { slug: string, digest: string };
    let reply_digest = slug
    let reply
    let tx
    let txprofile
    let rprofile
    let replyonchain
    try {
        const replydb = await fetch(`${API_HOST}${REPLY_GET}`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ reply_digest }),
        })
        reply = await replydb.json()
        if (!reply) {
            return {
                redirect: {
                  destination: `${API_HOST}/profile`, // Redirect destination
                  permanent: true, // Temporary redirect
                },
            }
        }
        rprofile = await sui.getObject({
            id: reply.profile_id,
            options: { showBcs: true, showContent: true, showDisplay: true, showOwner: true, showPreviousTransaction: true, showStorageRebate: true, showType: true } 
        })
        console.log(JSON.stringify('in reply slug ' + JSON.stringify(rprofile)))
        if (!rprofile) {
            return {
                redirect: {
                  destination: `${API_HOST}/account`, // Redirect destination
                  permanent: true, // Temporary redirect
                },
            }
        }
        let digest = reply.transaction_digest 
        const txdb = await fetch(`${API_HOST}${TRANSACTION_GET}`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ digest }),
        })
        tx = await txdb.json()
        //TODO get transaction digest from Reply table

        //console.log(JSON.stringify(txs))
        txprofile = await sui.getObject({
            id: tx.profile_id,
            options: { showBcs: true, showContent: true, showDisplay: true, showOwner: true, showPreviousTransaction: true, showStorageRebate: true, showType: true } 
        })
        if (!txprofile) {
            return {
                redirect: {
                  destination: `${API_HOST}/account`, // Redirect destination
                  permanent: true, // Temporary redirect
                },
            }
        }
        replyonchain = await sui.getObject({
            id: reply.reply_id,
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

    return { props: { reply, tx, txprofile, rprofile, replyonchain, reply_digest} };
}

function Reply ({session, txprofile, rprofile, tx, replyonchain, reply_digest, reply}
    : 
    {session: any, profiledata: any, tx: TransactionDB, 
        replyonchain: any, reply_digest: string, reply: ReplyDB, txprofile: any, rprofile: any}) {
    const { isLoading, user, localSession } = session;
    const [loading, setLoaiding] = useState(true);
    const [itemLoading, setItemLoading] = useState(true);
    const [access, setAccess] = useState<ReplyAccessDB>();
    const [bought, setBought] = useState(false);
    const [unlock, setUnlock] = useState(false);
    const [poolData, setPoolData] = useState<any>()
    const [items, setItems] = useState<ReplyAccessDB[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(2);

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

    const handleItemsChange = (items: ReplyAccessDB[]) => {
        setItems(items)
    }

    useEffect(() => {
        const fetchData = async () => {
            axios
                .post(`${API_HOST}${REPLY_ACCESS_CHECK_ROUTE}`, { reply_digest: reply_digest,  address: user.wallet })
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
                id: reply.pool_id,
                options: { showBcs: true, showContent: true, showDisplay: true, showOwner: true, showPreviousTransaction: true, showStorageRebate: true, showType: true } 
            })
            setPoolData(data);
            axios
                .post(`${API_HOST}${REPLY_ACCESS_HISTORY_LIST_ROUTE}`, { reply_digest: reply_digest,  currentPage: 1 })
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
            setLoaiding(false);
        }
        fetchData()
    }, [reply.pool_id, reply_digest, tx, user.wallet])

    const fetchMoreData = () => {
        axios
          .post(`${API_HOST}${REPLY_ACCESS_HISTORY_LIST_ROUTE}`, { slug: reply_digest,  currentPage: page })
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
                <ReplyHeader rprofile={rprofile}/>
                <ReplyContent reply={reply} replyonchain={replyonchain} session={session} 
                onUnlockchange={handleUnlock} unlock={unlock}
                bought={bought} />
                <ReplyPostDisplay txprofile={txprofile} tx={tx}/>
                <ReplyFooter reply={reply} poolData={poolData} onPoolDataChange={handlePoolDataChange}/>
                <ReplyButton session={session} poolData={poolData} 
                onPoolDataChange={handlePoolDataChange} tx={tx} reply={reply} slug={reply_digest}
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
                            {items && items.map((reply) => (
                                <ReplyHistoryItem reply={reply} key={reply.id}/>
                            ))}
                        </div>
                    </InfiniteScroll>
                </div>
            </div>
        </Nav>
    )
}

export default withZkLoginSessionRequired(Reply);
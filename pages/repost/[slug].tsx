import { GetServerSideProps } from 'next';
import { ZkLoginSession, withZkLoginSessionRequired } from "@shinami/nextjs-zklogin/client";
import Nav from '@/components/Nav';
import { REPLY_ACCESS_CHECK_ROUTE, REPLY_ACCESS_HISTORY_LIST_ROUTE, REPLY_GET, REPOST_ACCESS_CHECK_ROUTE, REPOST_ACCESS_HISTORY_LIST_ROUTE, REPOST_GET, TRANSACTION_GET } from '@/lib/api/constant';
import { API_HOST } from '@/lib/api/move';
import { sui } from '@/lib/api/shinami'
import { ReplyAccessDB, ReplyDB, RepostAccessDB, RepostDB, TransactionDB } from '@/types/transaction';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";
import ReplyButton from '@/components/ReplyButton';
import { useRouter } from 'next/navigation';
import ReplyHistoryItem from '@/components/ReplyHistoryItem';
import ReplyPostDisplay from '@/components/ReplyPostDisplay';
import ReplyHeader from '@/components/ReplyHeader';
import ReplyContent from '@/components/ReplyContent';
import ReplyFooter from '@/components/ReplyFooter';
import RepostHeader from '@/components/RepostHeader';
import RepostContent from '@/components/RepostContent';
import RepostFooter from '@/components/RepostFooter';
import RepostPostDisplay from '@/components/RepostPostDisplay';
import RepostButton from '@/components/RepostButton';
import RepostHistoryItem from '@/components/RepostHistoryItem';


export const getServerSideProps: GetServerSideProps = async (context) => {
    const { slug } = context.query as { slug: string };
    let repost_digest = slug
    let repost
    let tx
    let txprofile
    let rprofile
    let repostonchain
    try {
        const repostdb = await fetch(`${API_HOST}${REPOST_GET}`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ repost_digest }),
        })
        repost = await repostdb.json()
        if (!repost) {
            return {
                redirect: {
                  destination: `${API_HOST}/notfound`, // Redirect destination
                  permanent: true, // Temporary redirect
                },
            }
        }
        rprofile = await sui.getObject({
            id: repost.profile_id,
            options: { showBcs: true, showContent: true, showDisplay: true, showOwner: true, showPreviousTransaction: true, showStorageRebate: true, showType: true } 
        })
        console.log(JSON.stringify('in repost slug ' + JSON.stringify(rprofile)))
        if (!rprofile) {
            return {
                redirect: {
                  destination: `${API_HOST}/profilenotfound`, // Redirect destination
                  permanent: true, // Temporary redirect
                },
            }
        }
        let digest = repost.transaction_digest 
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
                  destination: `${API_HOST}/profilenotfound`, // Redirect destination
                  permanent: true, // Temporary redirect
                },
            }
        }
        repostonchain = await sui.getObject({
            id: repost.repost_id,
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

    return { props: { repost, tx, txprofile, rprofile, repostonchain, repost_digest} };
}

function Repost ({session, txprofile, rprofile, tx, repostonchain, repost_digest, repost}
    : 
    {session: any, profiledata: any, tx: TransactionDB, 
        repostonchain: any, repost_digest: string, repost: RepostDB, txprofile: any, rprofile: any}) {
    const { isLoading, user, localSession } = session;
    const [loading, setLoaiding] = useState(true);
    const [itemLoading, setItemLoading] = useState(true);
    const [access, setAccess] = useState<RepostAccessDB>();
    const [bought, setBought] = useState(false);
    const [unlock, setUnlock] = useState(false);
    const [poolData, setPoolData] = useState<any>()
    const [items, setItems] = useState<RepostAccessDB[]>([]);
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

    const handleItemsChange = (items: RepostAccessDB[]) => {
        setItems(items)
    }

    useEffect(() => {
        const fetchData = async () => {
            axios
                .post(`${API_HOST}${REPOST_ACCESS_CHECK_ROUTE}`, { repost_digest: repost_digest,  address: user.wallet })
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
                id: repost.pool_id,
                options: { showBcs: true, showContent: true, showDisplay: true, showOwner: true, showPreviousTransaction: true, showStorageRebate: true, showType: true } 
            })
            setPoolData(data);
            axios
                .post(`${API_HOST}${REPOST_ACCESS_HISTORY_LIST_ROUTE}`, { repost_digest: repost_digest,  currentPage: 1 })
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
    }, [repost.pool_id, repost_digest, user.wallet])

    const fetchMoreData = () => {
        axios
          .post(`${API_HOST}${REPOST_ACCESS_HISTORY_LIST_ROUTE}`, { slug: repost_digest,  currentPage: page })
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
                <RepostHeader rprofile={rprofile}/>
                <RepostContent repost={repost} repostonchain={repostonchain} session={session} 
                onUnlockchange={handleUnlock} unlock={unlock}
                bought={bought} />
                <RepostPostDisplay txprofile={txprofile} tx={tx}/>
                <RepostFooter repost={repost} poolData={poolData} onPoolDataChange={handlePoolDataChange}/>
                <RepostButton session={session} poolData={poolData} 
                onPoolDataChange={handlePoolDataChange} tx={tx} repost={repost} repost_digest={repost_digest}
                accessData={access} onAccessChange={handleAccessDataChange}  bought={bought} 
                onBoughtchange={handleBoughtChange} onLoadingChange={handleLoading} 
                onUnlockchange={handleUnlock} onItemsChange={handleItemsChange} />
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
                            {items && items.map((repost) => (
                                <RepostHistoryItem repost={repost} key={repost.id}/>
                            ))}
                        </div>
                    </InfiniteScroll>
                </div>
            </div>
        </Nav>
    )
}

export default withZkLoginSessionRequired(Repost);
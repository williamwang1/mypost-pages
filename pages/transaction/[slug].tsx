import { GetServerSideProps } from 'next';
import { ZkLoginSession, withZkLoginSessionRequired } from "@shinami/nextjs-zklogin/client";
import Nav from '@/components/Nav';
import { ACCESS_CHECK_ROUTE, ACCESS_HISTORY_LIST_ROUTE, PROFILE_GET_ROUTE, TRANSACTION_GET } from '@/lib/api/constant';
import { API_HOST } from '@/lib/api/move';
import { sui } from '@/lib/api/shinami'
import { ClipboardDocumentIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline'
import { TransactionList } from '@/types/transaction';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Tiptap from '@/components/TipTap';
import { AccessHistory } from '@/types/transaction';
import {Drawer} from 'vaul';
import { SUI_MIST } from '@/lib/constant';
import PriceTooltip from '@/components/PriceTooltip';
import TransactionButton from '@/components/TransactionButton';
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";
import TransactionHistoryItem from '@/components/TransactionHistoryItem';
import { trucateAddress } from '@/lib/shared/utils';
import * as Toast from '@radix-ui/react-toast';


export const getServerSideProps: GetServerSideProps = async (context) => {
    const { slug } = context.params as { slug: string };
    let txs
    let profiledata
    let transactiondata
    try {
        const txdb = await fetch(`${API_HOST}${TRANSACTION_GET}`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ slug }),
        })
        txs = await txdb.json()
        if (!txs) {
            return {
                redirect: {
                  destination: `${API_HOST}/profile`, // Redirect destination
                  permanent: true, // Temporary redirect
                },
            }
        }

        //console.log(JSON.stringify(txs))
        profiledata = await sui.getObject({
            id: txs[0].profile_id,
            options: { showBcs: true, showContent: true, showDisplay: true, showOwner: true, showPreviousTransaction: true, showStorageRebate: true, showType: true } 
        })
        if (!profiledata) {
            return {
                redirect: {
                  destination: `${API_HOST}/profile`, // Redirect destination
                  permanent: true, // Temporary redirect
                },
            }
        }

        
        transactiondata = await sui.getObject({
            id: txs[0].transaction_id,
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

    return { props: { txs, profiledata, transactiondata, slug} };
}

function Transaction ({session, profiledata, txs,transactiondata, slug}
    : 
    {session: any, profiledata: any, txs: TransactionList[], 
        transactiondata: any, slug: string}) {
    const { isLoading, user, localSession } = session;
    let avatar =''
    if (profiledata) {
        avatar = profiledata?.data?.content?.fields?.avatar
    }
    let name = profiledata?.data?.content?.fields?.name
    let address = profiledata?.data?.content?.fields?.owner
    let timestamp = <time>{txs[0].create_at?.toString().substring(0,10)}</time>;
    let summary = txs[0].summary;
    let public_content = txs[0].public_content;

    const [loading, setLoaiding] = useState(true);
    const [itemLoading, setItemLoading] = useState(true);
    const [access, setAccess] = useState<AccessHistory>();
    const [bought, setBought] = useState(false);
    const [unlock, setUnlock] = useState(false);
    const [plaintext, setPlaintext] = useState('');
    // const [price, setPrice] = useState(initialPrice)
    // const [numberofBought, setnumberofBought] = useState(1)
    const [poolData, setPoolData] = useState<any>()
    const [items, setItems] = useState<AccessHistory[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(2);
    const [open, setOpen] = useState(false);
    const timerRef = React.useRef(0);
    let encrypt_content = transactiondata?.data?.content?.fields?.content
    let boughtPrice = ''
    if (access) {
        //console.log('in transaction access ' + JSON.stringify(access.price))
        let price = parseInt(access.price)
        boughtPrice = ( price / SUI_MIST).toFixed(4)
    }
    let numberofBought = poolData?.data?.content?.fields.no_of_accessors
    let _currentPrice = poolData?.data?.content?.fields.price
    let _lastPrice = poolData?.data?.content?.fields.last_price
    let currentPrice = ''
    if (_currentPrice) {
        let price = parseInt(_currentPrice)
        currentPrice = ( price / SUI_MIST).toFixed(4)
    }
    let lastPrice = ''
    if (_lastPrice) {
        let price = parseInt(_lastPrice)
        lastPrice = ( price / SUI_MIST).toFixed(4)
    }

    const handleCopyClick = (text: string) => {
        navigator.clipboard.writeText(text) // Write text to clipboard
          .then(() => {
            //console.log("Text copied to clipboard:", address);
            setOpen(false);
            window.clearTimeout(timerRef.current);
            timerRef.current = window.setTimeout(() => {
            setOpen(true);
          }, 100);
            //alert(address);
          })
          .catch(err => {
            console.error("Failed to copy text: ", err);
            // alert("Failed to copy text. Please try again.");
          });
    };

    const handleClick = async () => {
        //console.log('in transction slug ' + JSON.stringify(bought))
        if(bought) {
            //console.log('eligible to decrypt')
            const decryptRes = await fetch('/api/decrypt', {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(encrypt_content),
            })
            let data = await decryptRes.json();
            setPlaintext(atob(data.plaintext)) ;
            //console.log(plaintext)
            setUnlock(true)
        } else {
            //TODO show pop-up to buy
            console.log('no access')
        }
    }

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

    let private_content = (<div className='overflow-hidden break-words max-w-full underline hover:text-gray-500' onClick={handleClick}>
                            <Tiptap content={encrypt_content} readOnly={true} onChange={undefined}/>
                            </div>)
    if (unlock) {
        private_content = <Tiptap content={plaintext} readOnly={true} onChange={undefined}/>
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
                id: txs[0].pool_id,
                options: { showBcs: true, showContent: true, showDisplay: true, showOwner: true, showPreviousTransaction: true, showStorageRebate: true, showType: true } 
            })
            setPoolData(data);
            
            axios
                .post(`${API_HOST}${ACCESS_HISTORY_LIST_ROUTE}`, { slug: slug,  currentPage: 1 })
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
    }, [slug, txs, user.wallet])

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
                <div className='flex justify-between'>
                    <div className='flex gap-x-2'>
                        <Image src={avatar} alt='WW' width={50} height={50} className='rounded-full border-white'/>
                        <div>
                            <div className='text-sm font-semibold leading-6 text-gray-900'>{name}</div>
                            <div className='text-gray-500 text-xs font-normal leading-relaxed'>{trucateAddress(address)}</div>
                        </div>
                    </div>
                    <button>
                    <EllipsisVerticalIcon className='w-8 h-8 text-slate-700'/>
                    </button>

                    
                </div>
                <div className='mt-5 text-gray-900 leading-relaxed text-base w-4/5'>
                    <div className='flex gapx-x-4'>
                        <div className='flex text-clip'>
                        {trucateAddress(slug)}
                        </div>
                        <Toast.Provider swipeDirection="right">
                            <button  onClick={() => handleCopyClick(slug)}>
                                <ClipboardDocumentIcon className="h-4 w-4 flex-none font-bold text-gray-500 hover:text-gray-800" aria-hidden="true"/>
                            </button>
                            <Toast.Root         
                                open={open}
                                onOpenChange={setOpen} className='fixed bottom-18 right-8 z-50 flex gap-x-2 items-center shadow-lg bg-sky-500 text-white rounded-xl'>
                                <Toast.Description className='font-bold px-2 py-1'>copied!</Toast.Description>
                                {/* <Toast.Close aria-label="Close" className='font-bold text-xl'>
                                    <span aria-hidden>×</span>
                                </Toast.Close> */}
                            </Toast.Root>
                            <Toast.Viewport />
                        </Toast.Provider>
                    </div>
                    
                    <div className='flex text-clip'>
                    {public_content}
                    </div>
                    {private_content}
                    {/* {JSON.stringify(pooldata.data.content.fields)} */}
                </div>            
                <div className='flex items-center justify-between mt-2'>
                    <div className='mt-2 text-xs text-gray-500' >
                        created at {timestamp}
                    </div>
                    <div className='flex gap-x-2 mx-1 items-center'>
                            
                            <div className='text-sky-500 text-base font-medium leading-relaxed'>{numberofBought}</div>
                            {/* <PriceTooltip/> */}
                            <div className='text-base font-semibold leading-relaxed text-gray-400'>bought</div>
                    </div>
                    <div className='bg-white rounded-3xl flex items-center px-2 gap-x-2'>
                        <Image src='/images/sui.png' alt='WW' width={25} height={25} className='py-1'/>
                        <span className='text-center text-sky-500 text-base font-medium leading-relaxed'>{currentPrice}</span>
                    </div>
                </div>
                <TransactionButton session={session} poolData={poolData} 
                onPoolDataChange={handlePoolDataChange} txs={txs} slug={slug}
                accessData={access} onAccessChange={handleAccessDataChange}  bought={bought} 
                onBoughtchange={handleBoughtChange} onLoadingChange={handleLoading} onUnlockchange={handleUnlock}/>
                {/* <TransactionHistory slug={slug} profile={profiledata} 
                session={session} pool={profiledata} txs={txs} items={items} onItemsChange={handleItemsChange}/> */}
                {/* <TradingHistory slug={slug} profile={profiledata} 
                session={session} pool={profiledata} txs={txs} items={items} onFirstItemsChange={handleFirstItemsChange} onNextItemsChange={handleNextItemsChange}/> */}
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

                {/* {JSON.stringify(transactiondata?.data?.content?.fields)} */}
                {/* {sellConfirm &&
                    <Drawer.Root>
                        <Drawer.Portal>
                            <Drawer.Overlay className="fixed inset-0 bg-black/40" />
                                <Drawer.Content className="bg-zinc-100 flex flex-col rounded-t-[10px] h-[50%] mt-24 fixed bottom-0 left-0 right-0">
                                    <div className='p-4 bg-white'>
                                        <button disabled className='bg-sky-800 rounded-3xl py-3 w-full'
                                        onClick={handleSellConfirm}
                                        >
                                            <span className='text-white font-semibold'>Confirm</span>
                                        </button>
                                    </div>
                                </Drawer.Content>
                        </Drawer.Portal>
                    </Drawer.Root>} */}
                {/* {inbalance &&
                <Drawer.Root>
                    <Drawer.Portal>
                        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
                            <Drawer.Content className="bg-zinc-100 flex flex-col rounded-t-[10px] h-[50%] mt-24 fixed bottom-0 left-0 right-0">
                                <div className='p-4 bg-white'>
                                    <button disabled className='bg-sky-800 rounded-3xl py-3 w-full'
                                    onClick={handleSellConfirm}
                                    >
                                        <span className='text-white font-semibold'>Insufficient Balance</span>
                                    </button>
                                </div>
                            </Drawer.Content>
                    </Drawer.Portal>
                </Drawer.Root>} */}
            </div>
        </Nav>
    )
}

export default withZkLoginSessionRequired(Transaction);
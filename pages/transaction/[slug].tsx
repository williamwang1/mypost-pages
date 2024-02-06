import { GetServerSideProps } from 'next';
import { ZkLoginSession, withZkLoginSessionRequired } from "@shinami/nextjs-zklogin/client";
import Nav from '@/components/Nav';
import { ACCESS_CHECK_ROUTE, ACCESS_HISTORY_LIST_ROUTE, PROFILE_GET_ROUTE, TRANSACTION_GET } from '@/lib/api/constant';
import { API_HOST } from '@/lib/api/move';
import { sui } from '@/lib/api/shinami'
import { SuiObjectResponse } from "@mysten/sui.js/client";
import { TransactionList } from '@/types/transaction';
import Image from 'next/image';
import { ProfileData, ProfileMedata } from '@/types/profile';
import TransactionHistory from '@/components/TransactionHistory';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';
import Tiptap from '@/components/TipTap';
import { AccessHistory } from '@/types/transaction';
import { useBuyMutation, useSellMutation } from '@/lib/hooks/api';
import {Drawer} from 'vaul';


export const getServerSideProps: GetServerSideProps = async (context) => {
    const { slug } = context.params as { slug: string };
    let txs
    let profiledata
    let pooldata
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

        //console.log(JSON.stringify(txs))
        profiledata = await sui.getObject({
            id: txs[0].profile_id,
            options: { showBcs: true, showContent: true, showDisplay: true, showOwner: true, showPreviousTransaction: true, showStorageRebate: true, showType: true } 
        })
        // TODO redirect to account page is no profile
        pooldata = await sui.getObject({
            id: txs[0].pool_id,
            options: { showBcs: true, showContent: true, showDisplay: true, showOwner: true, showPreviousTransaction: true, showStorageRebate: true, showType: true } 
        })
        
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

    return { props: { txs, profiledata, pooldata, transactiondata, slug} };
}

function Transaction ({session, profiledata, txs, pooldata, transactiondata, slug}
    : 
    {session: any, profiledata: any, txs: TransactionList[], 
        pooldata: any, transactiondata: any, slug: string}) {
    const { isLoading, user, localSession } = session;
    let avatar = profiledata?.data?.content?.fields?.avatar
    let name = profiledata?.data?.content?.fields?.name
    let address = profiledata?.data?.content?.fields?.owner
    let timestamp = <time>{txs[0].create_at?.toString().substring(0,10)}</time>;
    let summary = txs[0].summary;
    let public_content = txs[0].public_content;
    let price = pooldata?.data?.content?.fields.price
    const [loading, setLoaiding] = useState(true);
    const [bought, setBought] = useState(false);
    const [unlock, setUnlock] = useState(false);
    const [plaintext, setPlaintext] = useState('');
    const [sellConfirm, setSellConfirm] = useState(false);
    const [inbalance, setInbalance] = useState(false);
    const {mutateAsync: buy, isPending: isCreating } = useBuyMutation();
    const {mutateAsync: sell, isPending: isSellCreating } = useSellMutation();
    let encrypt_content = transactiondata?.data?.content?.fields?.content


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
        }
    }

    const handleBuy = async () => {
        setLoaiding(true)
        let balance = await sui.getBalance({owner: user.wallet})
        console.log(JSON.stringify(balance))
        //console.log(price)
        if (parseInt(balance.totalBalance) < parseInt(price)) {
            console.log('Insufficient Balance');
            // set notification insufficient balance
            setInbalance(true)
        }
        let buyMeta = await buy({
            keyPair: localSession.ephemeralKeyPair,
            price: price,
            budget: price,
            coin_count: balance.coinObjectCount.toString(),
            protocol_destination: user.wallet,
            transaction_digest: txs[0].digest,
            pool: txs[0].pool_id
        })
        console.log('in buy ' + JSON.stringify(buyMeta))
        setLoaiding(false)
    }

    const handleSellConfirm = async () => {
        setLoaiding(true)
        let sellMeta = await sell({
            keyPair: localSession.ephemeralKeyPair,
            protocol_destination: user.wallet,
            transaction_digest: txs[0].digest,
            pool: txs[0].pool_id
        })
        console.log('in sell ' + JSON.stringify(sellMeta))
        setLoaiding(false)
    }

    const handleRepost = () => {
        
    }

    const handleReply = () => {
        
    }

    let private_content = (<button className='overflow-hidden break-words max-w-full underline' onClick={handleClick}>
                            {encrypt_content}
                            </button>)
    if (unlock) {
        private_content = <Tiptap content={plaintext} readOnly={true} onChange={undefined}/>
    }

    useEffect(() => {
        const fetchData = async () => {
            let checkBody = {
                slug: slug,
                address: user.wallet
              }
            const accessCheckB = await fetch(`${API_HOST}${ACCESS_CHECK_ROUTE}`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(checkBody),
            })
            const accessCheck : AccessHistory[] = await accessCheckB.json();
            console.log('in history client ' + JSON.stringify(accessCheck))
            if (accessCheck.length > 0) {
                setBought(true)
            }
            setLoaiding(false);
        }
        fetchData()
    }, [slug, user.wallet])

    let trade = <button className='bg-sky-400 rounded-3xl px-2 hover:bg-sky-800' onClick={handleBuy}>
                <span className='text-center text-white text-normal font-semibold leading-relaxed px-2 py-2'>Buy</span>
            </button>
    if (bought) {
        trade = <div className='flex gap-x-2'>
                    <button className='bg-sky-400 rounded-3xl px-2 hover:bg-sky-800' onClick={handleRepost}>
                        <span className='text-center text-white text-normal font-semibold leading-relaxed px-2 py-2 '>Repost</span>
                    </button>
                    <button className='bg-sky-400 rounded-3xl px-2 hover:bg-sky-800' onClick={handleReply}>
                        <span className='text-center text-white text-normal font-semibold leading-relaxed px-2 py-2'>Reply</span>
                    </button>
                    <button className='bg-sky-400 rounded-3xl px-2 hover:bg-sky-800' onClick={() => setSellConfirm(true)}>
                        <span className='text-center text-white text-normal font-semibold leading-relaxed px-2 py-2 '>Sell</span>
                    </button>
                </div>
    }
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
            <div className='flex flex-1 justify-between'>
                <div className='flex flex-1 gap-x-2'>
                    <Image src={avatar} alt='WW' width={50} height={50} className='rounded-full border-white'/>
                    <div>
                        <div className='text-sm font-semibold leading-6 text-gray-900'>{name}</div>
                        <div className='text-gray-500 text-xs font-normal leading-relaxed truncate max-w-20'>{address}</div>
                    </div>
                </div>
                <div className='bg-white rounded-3xl flex items-center px-2 gap-x-2'>
                    <Image src='/images/sui.png' alt='WW' width={25} height={25} className='py-1'/>
                    <span className='text-center text-sky-500 text-base font-medium leading-relaxed'>{price}</span>
                </div>
            </div>
            <div className='mt-5 text-gray-900 leading-relaxed text-base w-4/5'>
                <div className='flex text-clip'>
                {summary}
                </div>
                <div className='flex text-clip'>
                {public_content}
                </div>
                {private_content}
            </div>
            {trade}
            <div className='flex justify-between items-center'>
                <div className='mt-2 text-xs text-gray-500' >
                    created at {timestamp}
                </div>
               
            </div>
            <TransactionHistory slug={slug} profile={profiledata} session={session} pool={profiledata} txs={txs}/>
            {/* {JSON.stringify(transactiondata?.data?.content?.fields)} */}
            {sellConfirm &&
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
                </Drawer.Root>}
            {inbalance &&
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
                </Drawer.Root>}
            </div>
        </Nav>
    )
}

export default withZkLoginSessionRequired(Transaction);
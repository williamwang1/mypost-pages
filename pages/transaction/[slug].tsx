import { GetServerSideProps } from 'next';
import { ZkLoginSession, withZkLoginSessionRequired } from "@shinami/nextjs-zklogin/client";
import Nav from '@/components/Nav';
import { ACCESS_CHECK_ROUTE, PROFILE_GET_ROUTE, TRANSACTION_GET } from '@/lib/api/constant';
import { API_HOST } from '@/lib/api/move';
import { sui } from '@/lib/api/shinami'
import { SuiObjectResponse } from "@mysten/sui.js/client";
import { TransactionDetails } from '@/types/transaction';
import Image from 'next/image';
import { ProfileData, ProfileMedata } from '@/types/profile';
import TransactionHistory from '@/components/TransactionHistory';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';
import Tiptap from '@/components/TipTap';

const QuillNoSSRWrapper = dynamic(
    () => import('react-quill'), // Replace 'react-quill' with your Quill import
    { ssr: false } // This line is important. It disables server-side rendering for this component
);


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
    {session: any, profiledata: any, txs: TransactionDetails[], 
        pooldata: any, transactiondata: any, slug: string}) {
    const { isLoading, user, localSession } = session;
    let avatar = profiledata?.data?.content?.fields?.avatar
    let name = profiledata?.data?.content?.fields?.name
    let address = profiledata?.data?.content?.fields?.owner
    let timestamp = <time>{txs[0].create_at?.toString().substring(0,10)}</time>;
    let summary = txs[0].summary;
    let public_content = txs[0].public_content;
    let price = pooldata?.data?.content?.fields.price
    const [access, setAcess] = useState([]);
    const [unlock, setUnlock] = useState(false)
    const [plaintext, setPlaintext] = useState('')
    let encrypt_content = transactiondata?.data?.content?.fields?.content?.fields?.content

    const handleClick = async () => {
        if(access && access.length > 0) {
            console.log('eligible to decrypt')
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

    let private_content = (<button className='overflow-hidden break-words max-w-full underline' onClick={handleClick}>
                            {encrypt_content}
                            </button>)
    if (unlock) {
        private_content = <Tiptap content={plaintext} readOnly={true} onChange={undefined}/>
    }

    const handleTrade = () => {

    }

    let trade = <button className='bg-sky-400 rounded-3xl py-1 px-2 mt-2' onClick={handleTrade}>
                    <span className='text-center text-white text-normal font-semibold leading-relaxed px-2 py-2'>Buy</span>
                </button>
    if (user.wallet === address) {
        trade = <button className='bg-sky-400 rounded-3xl py-1 px-2 mt-2' onClick={handleTrade}>
                <span className='text-center text-white text-normal font-semibold leading-relaxed px-2 py-2'>Sell</span>
            </button>
    }
    useEffect(() => {
        const fetchData = async () => {
            let body = {
                transaction_digest: slug,
                address: user.wallet
            }
            const accessRes = await fetch(`${API_HOST}${ACCESS_CHECK_ROUTE}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    },
                body: JSON.stringify(body)
            })
            const access = await accessRes.json()
            if (!accessRes.ok) {
                throw new Error(`Error: ${accessRes.status}`);
            }
            setAcess(access)
            // console.log(user.wallet + '   ' + slug)
            // console.log('in transaction slug' + JSON.stringify(accessRes))
        }
        fetchData()
    }, [slug, user.wallet])

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
                {/* <button className='overflow-hidden break-words max-w-full underline' onClick={handleClick}>
                    {private_content}
                </button> */}
                {private_content}
            </div>
            <div className='flex justify-between items-center'>
                <div className='mt-2 text-xs text-gray-500' >
                    created at {timestamp}
                </div>
                {trade}
            </div>

            <div className='text-black text-lg font-bold leading-7 mt-2'>
                Trading History
            </div>
            <TransactionHistory slug={slug} profile={profiledata}/>
            </div>
        </Nav>
    )
}

export default withZkLoginSessionRequired(Transaction);
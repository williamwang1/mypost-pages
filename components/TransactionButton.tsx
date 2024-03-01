import { useState } from "react"
import {Drawer} from 'vaul';
import { sui } from '@/lib/api/shinami'
import Image from 'next/image';
import { AccessDB, TransactionDB } from "@/types/transaction";
import { useBuyMutation, useSellMutation } from '@/lib/hooks/api';
import { ACCESS_CHECK_ROUTE, ACCESS_HISTORY_LIST_ROUTE } from '@/lib/api/constant';
import { API_HOST } from '@/lib/api/move';
import { SUI_MIST } from '@/lib/constant';
import { InformationCircleIcon } from "@heroicons/react/20/solid";
import axios from "axios";
import { useRouter } from "next/router";


export default function TransactionButton (
    {session, poolData, onPoolDataChange, tx, slug, accessData, onAccessChange, bought, 
    onBoughtchange, onLoadingChange, onUnlockchange, onItemsChange} 
    : 
    {session: any, poolData: any, accessData: any, onPoolDataChange: (poolData: any) => void,
    tx: TransactionDB, slug: string, onAccessChange: (accessData: any) => void
    bought: boolean, onBoughtchange: (bought: boolean) => void, onLoadingChange: (loading: boolean) => void,
    onUnlockchange: (unlock: boolean) => void, onItemsChange: (items: any) => void}
) {
    const { isLoading, user, localSession } = session;
    //const [bought, setBought] = useState(false)
    const [sellConfirm, setSellConfirm] = useState(false)
    const [buyConfirm, setBuyConfirm] = useState(false)
    const {mutateAsync: buy, isPending: isCreating } = useBuyMutation();
    const {mutateAsync: sell, isPending: isSellCreating } = useSellMutation();
    const [inBalance, setInbalance] = useState(false)
    const router = useRouter()

    let boughtPrice = ''
    if (accessData) {
        //console.log('in transaction access ' + JSON.stringify(access.price))
        let price = parseInt(accessData.price)
        boughtPrice = ( price / SUI_MIST).toFixed(4)
    }
    let _lastPrice = poolData?.data?.content?.fields.last_price
    let lastPrice = ''
    if (_lastPrice) {
        let price = parseInt(_lastPrice)
        lastPrice = ( price / SUI_MIST).toFixed(4)
    }
    let _currentPrice = poolData?.data?.content?.fields.price
    let currentPrice = ''
    if (_currentPrice) {
        let price = parseInt(_currentPrice)
        currentPrice = ( price / SUI_MIST).toFixed(4)
    }
    let budgetPrice = ''
    if (_currentPrice) {
        let price = parseInt(_currentPrice) * 2
        budgetPrice = ( price / SUI_MIST).toFixed(4)
    }

    const handleBuy = async () => {
        let balance = await sui.getBalance({owner: user.wallet})
        if (parseInt(balance.totalBalance) < parseInt(poolData.price)) {
            console.log('Insufficient Balance');
            // set notification insufficient balance
            setInbalance(true)
        }
        // if (0 < parseInt(poolData.price)) {
        //     console.log('Insufficient Balance');
        //     // set notification insufficient balance
        //     setInbalance(true)
        // }
        setBuyConfirm(true)
    }

    const handleBuyConfirm = async () => {
        onLoadingChange(true)
        let balance = await sui.getBalance({owner: user.wallet})
        //console.log(JSON.stringify(balance))
        //console.log(price)
        if (parseInt(balance.totalBalance) < parseInt(poolData.price)) {
            console.log('Insufficient Balance');
            // set notification insufficient balance
            setInbalance(true)
        }
        let buyMeta = await buy({
            keyPair: localSession.ephemeralKeyPair,
            price: poolData?.data?.content?.fields.price,
            budget: poolData?.data?.content?.fields.price,
            coin_count: balance.coinObjectCount.toString(),
            protocol_destination: user.wallet,
            transaction_digest: tx.digest,
            pool: tx.pool_id
        })
        let data: any = await sui.getObject({
            id: tx.pool_id,
            options: { showBcs: true, showContent: true, showDisplay: true, showOwner: true, showPreviousTransaction: true, showStorageRebate: true, showType: true } 
        })
        onPoolDataChange(data);
        console.log('in buy ' + JSON.stringify(buyMeta))
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
        const accessCheck : AccessDB[] = await accessCheckB.json();
        //console.log('in history client ' + JSON.stringify(accessCheck))
        if (accessCheck.length > 0) {
            //console.log('in transaction access check ' + JSON.stringify(accessCheck))
            onBoughtchange(true)
            onAccessChange(accessCheck[0]);
        }
        //onBoughtchange(true)
        //setBuyConfirm(false)
        axios
            .post(`${API_HOST}${ACCESS_HISTORY_LIST_ROUTE}`, { slug: slug,  currentPage: 1 })
            .then((res) =>{
                onItemsChange(res.data)
                // setItemLoading(false)
            })
            .catch((err) => console.log(err));
        onLoadingChange(false)
    }

    const handleSellConfirm = async () => {
        //console.log('in handle sell')
        onLoadingChange(true)
        console.log('in sell confirm ' + tx.pool_id + ' ' + tx.digest)
        let sellMeta = await sell({
            keyPair: localSession.ephemeralKeyPair,
            protocol_destination: user.wallet,
            transaction_digest: tx.digest,
            pool: tx.pool_id
        })
        console.log('in sell ' + JSON.stringify(sellMeta))
        let data: any = await sui.getObject({
            id: tx.pool_id,
            options: { showBcs: true, showContent: true, showDisplay: true, showOwner: true, showPreviousTransaction: true, showStorageRebate: true, showType: true } 
        })

        axios
            .post(`${API_HOST}${ACCESS_HISTORY_LIST_ROUTE}`, { slug: slug,  currentPage: 1 })
            .then((res) =>{
                onItemsChange(res.data)
                // setItemLoading(false)
            })
            .catch((err) => console.log(err));
        onPoolDataChange(data);
        onAccessChange(undefined)
        onBoughtchange(false)
        onUnlockchange(false)
        //setSellConfirm(false)
        onLoadingChange(false)
    }

    const handleRepost = () => {
        router.push(`/reposts/${user.wallet}?digest=${tx.digest}`)
    }

    const handleReply = () => {
        router.push(`/replies/${user.wallet}?digest=${tx.digest}`)
    }


    if (bought) {
        //console.log('in transaction button bought ' + bought)
        return (
            <div className='flex gap-x-2 justify-between mt-2'>
                <button className='bg-sky-400 rounded-3xl px-2 hover:bg-sky-800' onClick={handleRepost}>
                    <span className='text-center text-white text-normal font-semibold leading-relaxed px-2 py-2 '>Repost</span>
                </button>
                <button className='bg-sky-400 rounded-3xl px-2 hover:bg-sky-800' onClick={handleReply}>
                    <span className='text-center text-white text-normal font-semibold leading-relaxed px-2 py-2'>Reply</span>
                </button>
                <Drawer.Root>
                    <Drawer.Trigger>
                        <div className='bg-sky-400 rounded-3xl px-2 hover:bg-sky-800' onClick={() => setSellConfirm(true)}>
                            <span className='text-center text-white text-normal font-semibold leading-relaxed px-2 py-2 '>Sell</span>
                        </div>
                    </Drawer.Trigger>
                    <Drawer.Portal> 
                        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
                        <Drawer.Content className="bg-white flex rounded-t-[10px] h-[40%] fixed bottom-0 left-0 right-0">
                            <div className='p-4 w-screen bg-white'>
                                <div className="flex flex-1 gap-x-2 mt-5 justify-evenly">
                                    <div>
                                        <div className='text-lg font-semibold leading-relaxed'>bought price</div>
                                        <div className="flex items-center gap-x-2 mt-2">
                                            <Image src='/images/sui.png' alt='SUI' width={25} height={25} className=''/>
                                            <div className="text-center text-sky-500 text-base font-medium leading-relaxed">{boughtPrice}</div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className='text-lg font-semibold leading-relaxed'>sell price</div>
                                        <div className="flex items-center gap-x-2 mt-2">
                                            <Image src='/images/sui.png' alt='SUI' width={25} height={25} className=''/>
                                            <div className="text-center text-sky-500 text-base font-medium leading-relaxed">{lastPrice}</div>
                                        </div>
                                    </div>
                                </div>
                                <button className='bg-sky-500 rounded-3xl w-full hover:bg-sky-800 mt-5 py-2'
                                onClick={handleSellConfirm}
                                >
                                    <span className='text-white text-lg font-semibold'>Confirm</span>
                                </button>
                            </div>
                        </Drawer.Content>
                    </Drawer.Portal>
                </Drawer.Root>
                <button className='bg-sky-200 rounded-3xl px-2 disable'>
                    <span className='text-center text-white text-normal font-semibold leading-relaxed px-2 py-2'>Buy</span>
                </button>
            </div>
        )
    } else {
        return (
            <div className='flex gap-x-2 justify-between mt-2'>
                <button className='bg-sky-200 disable rounded-3xl px-2' onClick={handleRepost}>
                    <span className='text-center text-white text-normal font-semibold leading-relaxed px-2 py-2 '>Repost</span>
                </button>
                <button className='bg-sky-200 disable rounded-3xl px-2' onClick={handleReply}>
                    <span className='text-center text-white text-normal font-semibold leading-relaxed px-2 py-2'>Reply</span>
                </button>
                <button className='bg-sky-200 disable rounded-3xl px-2'>
                    <span className='text-center text-white text-normal font-semibold leading-relaxed px-2 py-2 '>Sell</span>
                </button>
                <Drawer.Root>
                    <Drawer.Trigger>
                        {inBalance? 
                        <div className='bg-sky-200 disabled rounded-3xl px-2'>
                            <span className='text-center text-white text-normal font-semibold leading-relaxed px-2 py-2'>Insufficient Balance</span>
                        </div>
                            :                         
                        <div className='bg-sky-400 rounded-3xl px-2 hover:bg-sky-800' onClick={handleBuy}>
                            <span className='text-center text-white text-normal font-semibold leading-relaxed px-2 py-2'>Buy</span>
                        </div>}
                    </Drawer.Trigger>
                    <Drawer.Portal>
                        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
                        {/* <Drawer.Content className="h-[50%]">
                            <div className='p-4 bg-white'>
                                <div>{boughtPrice}</div>
                                <div>{currentPrice}</div>
                                <button className='bg-sky-500 rounded-3xl py-1 w-full hover:bg-sky-800'
                                onClick={handleBuyConfirm}
                                >
                                    <span className='text-white font-semibold'>Confirm</span>
                                </button>
                            </div>
                        </Drawer.Content> */}
                        <Drawer.Content className="bg-white flex rounded-t-[10px] h-[50%] fixed bottom-0 left-0 right-0">
                            <div className='p-4 w-screen bg-white flex flex-col items-center'>
                                <div className="flex gap-x-2 mt-5 justify-evenly">
                                    <div className="flex flex-col">
                                        <div className='text-lg font-semibold leading-relaxed'>current price</div>
                                        <div className="flex items-center gap-x-2 mt-2">
                                            <Image src='/images/sui.png' alt='SUI' width={25} height={25} className=''/>
                                            <div className="text-center text-sky-500 text-base font-medium leading-relaxed">{currentPrice}</div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <div className='text-lg font-semibold leading-relaxed'>budget price</div>
                                        <div className="flex items-center gap-x-2 mt-2">
                                            <Image src='/images/sui.png' alt='SUI' width={25} height={25} className=''/>
                                            <div className="text-center text-sky-500 text-base font-medium leading-relaxed">{budgetPrice}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-x-2 px-5 mt-5">
                                    <InformationCircleIcon className="w-8 h-8 text-sky-500"/>
                                    <div className="text-sky-500">set a budget price in order to buy successfully</div>
                                </div>
                                <button className='bg-sky-500 rounded-3xl w-full hover:bg-sky-800 mt-2 py-2'
                                onClick={handleBuyConfirm}
                                >
                                    <span className='text-white text-lg font-semibold'>Confirm</span>
                                </button>
                            </div>
                        </Drawer.Content>
                    </Drawer.Portal>
                </Drawer.Root>
            </div>
        )
    }

}
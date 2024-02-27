import React, { Fragment, useState, useRef, useEffect } from 'react' ;
import { ChevronRightIcon, CalendarDaysIcon, InformationCircleIcon} from '@heroicons/react/20/solid'
import { useRouter } from 'next/navigation'
import Image from 'next/image';
import { ProfileMetadataCreated, ProfileMedata, ProfileData } from "@/types/profile";
import { API_HOST } from '@/lib/api/move';
import { ACCOUNT_LIST_ROUTE, FOLLOW_CHECK_ROUTE, PROFILE_GET_ROUTE } from '@/lib/api/constant';
import { Account } from '@/types/auth';
import { SUI_MIST } from '@/lib/constant';
import axios from 'axios';
import { sui } from '@/lib/api/shinami';
import { useFollowMutation, useUnfollowMutation } from '@/lib/hooks/api';
import { FollowData } from '@/types/follow';
import { ClipboardDocumentIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { Drawer } from 'vaul';
import { trucateAddress } from '@/lib/shared/utils';
import * as Toast from '@radix-ui/react-toast';
import ProfileTooltip from './ProfileTooltip';


export default function ProfileSummary({ followingmeta, accounts, session ,slug}: 
    {followingmeta: ProfileMedata, accounts: Account[], session: any, slug: string}) {
    const [following, setFollowing] = useState(false)
    const [followingdata, setFollowingdata] = useState<FollowData>()
    const [followConfirm, setFollowConfirm] = useState(false)
    const [unFollowConfirm, setUnFollowConfirm] = useState(false)
    const [pool, setPool] = useState<any>({})
    const [followerProfile, setFollowerProfile] = useState<any>({})
    const [followingProfile, setFollowingProfile] = useState<any>({})
    const [open, setOpen] = useState(false);
    const timerRef = React.useRef(0);
    const [followermeta, setFollowermeta] = useState<any>({})
    const {mutateAsync: follow, isPending: isFollowCreating } = useFollowMutation();
    const {mutateAsync: unfollow, isPending: isUnfollowCreating } = useUnfollowMutation();
    const { isLoading, user, localSession } = session;
    const router = useRouter();
    let following_address = followingmeta.address
    let follower_address = user.wallet
    let current_user = user.wallet
    //let followermeta = {}
    let followers = ''
    let followings = ''
    let price = ''
    let avatar = ''
    let username = ''
    let bio = ''
    if (pool) {
        followers = pool?.data?.content?.fields?.no_of_followers
        followings = pool?.data?.content?.fields?.no_of_followings
        price = pool?.data?.content?.fields?.price
        if (price) {
            price = (parseInt(price) / SUI_MIST).toFixed(4)
        }
    }

    if (followingProfile) {
        avatar = followingProfile?.data?.content?.fields?.avatar
        username = followingProfile?.data?.content?.fields?.name
        bio = followingProfile?.data?.content?.fields?.bio
    }

    let timestamp = <time>{followingmeta?.create_at?.toString().substring(0,10)}</time>;
    let icons : string[] = [];
    if (accounts && accounts.length > 0) {
        accounts.map((a) => {
            switch (a.provider) {
                case 'twitter':
                    icons.push('/images/twitter.png');
                // defaut:
                //     icons.push('/images/twitter.png');
            }
        })
    }

    let boughtPrice = ''
    if (followingdata) {
        //console.log('in transaction access ' + JSON.stringify(access.price))
        let price = parseInt(followingdata.price)
        boughtPrice = ( price / SUI_MIST).toFixed(4)
    }
    let _lastPrice = pool?.data?.content?.fields.last_price
    let lastPrice = ''
    if (_lastPrice) {
        let price = parseInt(_lastPrice)
        lastPrice = ( price / SUI_MIST).toFixed(4)
    }
    let _currentPrice = pool?.data?.content?.fields.price
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

    const handleCopyClick = () => {
        navigator.clipboard.writeText(following_address) // Write text to clipboard
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

    useEffect(() => {
        const getData = async () => {
            //console.log('in my transaction ' + currentPage)
            axios
                .post(`${API_HOST}${FOLLOW_CHECK_ROUTE}`, { follower: follower_address,  following: following_address })
                .then((res) =>{
                    if (res.data && res.data.length > 0) {
                        setFollowing(true)
                        setFollowingdata(res.data[0])
                    }  
                })
                .catch((err) => console.log(err));
            //console.log('in profile summary ' + JSON.stringify(followingmeta))
            const profilepool: any = await sui.getObject({
                    id: followingmeta.profile_pool_id,
                    options: { showBcs: true, showContent: true, showDisplay: true, showOwner: true, showPreviousTransaction: true, showStorageRebate: true, showType: true } 
            })
            if (profilepool) {
                setPool(profilepool)
            }

            let followerBody = {
                slug: follower_address
            }
            const followerProfileDB = await fetch(`${API_HOST}${PROFILE_GET_ROUTE}`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(followerBody),
            })
            const followerpdb : ProfileMedata = await followerProfileDB.json();
            if (followerpdb) {
                setFollowermeta(followerpdb)
                const followerp: any = await sui.getObject({
                    id: followerpdb.profile_id,
                    options: { showBcs: true, showContent: true, showDisplay: true, showOwner: true, showPreviousTransaction: true, showStorageRebate: true, showType: true } 
                })
                if (followerp) {
                    setFollowerProfile(followerp)
                }
            }
            const followingp: any = await sui.getObject({
                id: followingmeta.profile_id,
                options: { showBcs: true, showContent: true, showDisplay: true, showOwner: true, showPreviousTransaction: true, showStorageRebate: true, showType: true } 
            })
            if (followingp) {
                setFollowingProfile(followingp)
            }
            //}
        } 
        getData()
    }, [follower_address, followingmeta.profile_id, followingmeta.profile_pool_id, following_address])

    const handleEdit = async () => {
        const followerp: any = await sui.getObject({
            id: followermeta.profile_id,
            options: { showBcs: true, showContent: true, showDisplay: true, showOwner: true, showPreviousTransaction: true, showStorageRebate: true, showType: true } 
        })
        if (followerp) {
            setFollowerProfile(followerp)
        }
        let followingBody = {
            slug: following_address
        }
    }

    const handleUnFollowConfirm = async () => {
        let followMeta = await unfollow({
            keyPair: localSession.ephemeralKeyPair,
            protocol_destination: user.wallet,
            global: followermeta.global_id,
            my_profile: followermeta.profile_id,
            following_pool: followingmeta.profile_pool_id,
            follower_pool: followermeta.profile_pool_id
        })
        setFollowing(false)
        setFollowingdata(undefined)
        const profilepool: any = await sui.getObject({
            id: followingmeta.profile_pool_id,
            options: { showBcs: true, showContent: true, showDisplay: true, showOwner: true, showPreviousTransaction: true, showStorageRebate: true, showType: true } 
        })
        if (profilepool) {
            setPool(profilepool)
        }
        setUnFollowConfirm(false)
    }

    const handleFollowConfirm = async () => {
        let balance = await sui.getBalance({owner: user.wallet})
        //console.log(JSON.stringify(balance))
        //console.log(price)
        if (parseInt(balance.totalBalance) < parseInt(price)) {
            console.log('Insufficient Balance');
            // set notification insufficient balance
           // setInbalance(true)
        } else {
            console.log('in profile summary ' + JSON.stringify(followermeta))
            let followMeta = await follow({
                keyPair: localSession.ephemeralKeyPair,
                price: pool?.data?.content?.fields.price,
                budget: pool?.data?.content?.fields.price,
                coin_count: balance.coinObjectCount.toString(),
                protocol_destination: user.wallet,
                global: followermeta.global_id,
                my_profile: followermeta.profile_id,
                following_pool: followingmeta.profile_pool_id,
                follower_pool: followermeta.profile_pool_id
            })
            let checkBody = {
                follower: follower_address,  
                following: following_address
            }
            const followCheckDB = await fetch(`${API_HOST}${FOLLOW_CHECK_ROUTE}`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(checkBody),
            })
            const followCheck : FollowData[] = await followCheckDB.json();
            if (followCheck.length > 0) {
                //console.log('in transaction access check ' + JSON.stringify(accessCheck))
                setFollowing(true)
                setFollowingdata(followCheck[0])
            }
            const profilepool: any = await sui.getObject({
                id: followingmeta.profile_pool_id,
                options: { showBcs: true, showContent: true, showDisplay: true, showOwner: true, showPreviousTransaction: true, showStorageRebate: true, showType: true } 
            })
            if (profilepool) {
                setPool(profilepool)
            }

            // const followingProfileDB = await fetch(`${API_HOST}${PROFILE_GET_ROUTE}`, {
            //     method: 'POST',
            //     headers: {
            //     'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify(followingBody),
            // })
            // const followingpdb : ProfileMedata = await followingProfileDB.json();
            //if (followingpdb) {
            const followingp: any = await sui.getObject({
                id: followingmeta.profile_id,
                options: { showBcs: true, showContent: true, showDisplay: true, showOwner: true, showPreviousTransaction: true, showStorageRebate: true, showType: true } 
            })
            if (followingp) {
                setFollowingProfile(followingp)
            }
            //}
        }
        setFollowConfirm(false)
    }       
    let action = (<Drawer.Root>
                    <Drawer.Trigger>
                        <div className='bg-sky-400 rounded-3xl py-1 px-2' onClick={() => setUnFollowConfirm(true)}>
                            <span className='text-center text-white text-normal font-semibold leading-relaxed px-2 py-2'>Unfollow</span>
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
                                onClick={handleUnFollowConfirm}
                                >
                                    <span className='text-white text-lg font-semibold'>Confirm</span>
                                </button>
                            </div>
                        </Drawer.Content>
                    </Drawer.Portal>
                </Drawer.Root>)
    if (current_user === following_address) {
        action = <button className='bg-sky-400 rounded-3xl py-1 px-2' onClick={handleEdit}>
                    <span className='text-center text-white text-normal font-semibold leading-relaxed px-2 py-2'>Edit</span>
                </button>
    } else {
        if (!following) {
            action = 
                <Drawer.Root>
                    <Drawer.Trigger>
                            {/* <div className='bg-sky-400 rounded-3xl px-2 hover:bg-sky-800' onClick={() => setBuyConfirm(true)}>
                                <span className='text-center text-white text-normal font-semibold leading-relaxed px-2 py-2'>Buy</span>
                            </div> */}
                            <div className='bg-sky-400 rounded-3xl py-1 px-2' onClick={ handleFollowConfirm }>
                            <span className='text-center text-white text-normal font-semibold leading-relaxed px-2 py-2'>Follow</span>
                        </div>
                    </Drawer.Trigger>
                    <Drawer.Portal>
                        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
                        <Drawer.Content className="bg-white flex rounded-t-[10px] h-[50%] fixed bottom-0 left-0 right-0">
                            <div className='p-4 w-screen bg-white'>
                                <div className="flex flex-1 gap-x-2 mt-5 justify-evenly">
                                    <div>
                                        <div className='text-lg font-semibold leading-relaxed'>current price</div>
                                        <div className="flex items-center gap-x-2 mt-2">
                                            <Image src='/images/sui.png' alt='SUI' width={25} height={25} className=''/>
                                            <div className="text-center text-sky-500 text-base font-medium leading-relaxed">{currentPrice}</div>
                                        </div>
                                    </div>
                                    <div>
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
                                onClick={() => setFollowConfirm(true)}
                                >
                                    <span className='text-white text-lg font-semibold'>Confirm</span>
                                </button>
                            </div>
                        </Drawer.Content>
                    </Drawer.Portal>
                </Drawer.Root>
        }
    }

    return (
        <div className='px-2'>
            <div className='flex justify-between items-center'>
                <div>
                    <div className='w-20 h-20 rounded-full border-white p-2'>
                        <Image src={avatar} alt='WW' width={100} height={100} className='rounded-full border-white'/>
                    </div>
                </div>
                <div className='flex items-center'>
                    <div>
                        {action}
                    </div>
                    <EllipsisVerticalIcon className='w-6 h-6 text-gray-600'/>
                </div>
            </div>
            <div className='mt-2 text-gray-900 text-base font-black leading-relaxed'>{username}</div>
            <div className='flex gap-x-2 items-center'>
                <div className='text-gray-500 text-xs font-normal leading-relaxed'>{trucateAddress(following_address)}</div>
                <Toast.Provider swipeDirection="right">
                    <button  onClick={handleCopyClick}>
                        <ClipboardDocumentIcon className="h-4 w-4 flex-none font-bold text-gray-500 hover:text-gray-800" aria-hidden="true"/>
                    </button>
                    <Toast.Root         
                        open={open}
                        onOpenChange={setOpen} className='fixed bottom-18 right-8 z-50 flex gap-x-2 items-center shadow-lg bg-sky-500 text-white rounded-xl'>
                        <Toast.Description className='font-bold px-2 py-1'>copied!</Toast.Description>
                        <Toast.Close aria-label="Close" className='font-bold text-xl'>
                            <span aria-hidden>×</span>
                        </Toast.Close>
                    </Toast.Root>
                    <Toast.Viewport />
                </Toast.Provider>
            </div>

            <div className='flex justify-between'>
                <div>
                    <div className='flex flex-1 gap-x-1 items-center mt-2'>
                        <CalendarDaysIcon className='w-6 h-6'/>
                        <div className='text-neutral-600 text-sm font-normal leading-normal'>Joined <time>{timestamp}</time></div>
                    </div>
                    <div className='flex flex-1 gap-x-8 mt-2'>
                        <div className='flex gap-x-2'>
                            <span className='text-gray-900 text-sm font-black leading-loose'>{followings}</span>
                            <span className='text-neutral-600 text-sm font-normal leading-loose'>following</span>
                        </div>
                        <div className='flex gap-x-2'>
                            <span className='text-gray-900 text-sm font-black leading-loose'>{followers}</span>
                            <span className='text-neutral-600 text-sm font-normal leading-loose'>followers</span>
                        </div>
                    </div>
                </div>
                <div className='flex py-3 flex-col items-center px-4 gap-y-2'>
                    <button className='bg-sky-400 rounded-3xl flex items-center px-2 gap-x-2 py-1' onClick={() => router.push(`/follow/${following_address}`)}>
                        <Image src='/images/sui.png' alt='WW' width={25} height={25} className='py-1'/>
                        {/* <span className='text-white font-semibold'>SUI</span> */}
                        <span className='text-center text-white text-base font-medium leading-relaxed'>{price}</span>
                    </button>
                    <a className='text-sky-400 text-sm' href='/faq/price'>price chart</a>
                    {/* <div>
                    <ProfileTooltip/>
                    </div> */}
                    
                </div>

            </div>


            {/* <div className='flex flex-col z-0'>
                <div className='flex flex-1 w-full mt-2 justify-between'>
                    <div>
                        <div className='w-20 h-20 rounded-full border-white p-2'>
                            <Image src={avatar} alt='WW' width={100} height={100} className='rounded-full border-white'/>
                        </div>
                    </div>
                    <div>
                        <div className='flex flex-1 rounded-3xl gap-x-2 items-end'>
                            <button className='bg-white rounded-3xl flex items-center px-2 gap-x-2' onClick={() => router.push('/follow')}>
                                <Image src='/images/sui.png' alt='WW' width={25} height={25} className='py-1'/>
                                <span className='text-center text-sky-500 text-base font-medium leading-relaxed'>{price}</span>
                            </button>
                            {follow}
                        </div>       
                    </div>
                </div>
            </div>
            <div className='mt-2 text-gray-900 text-base font-black leading-relaxed'>{username}</div>
            <div className='text-gray-500 text-xs font-normal leading-relaxed truncate'>{address}</div>
            <div className='text-gray-900 text-base font-normal leading-normal mt-2'>{bio}</div>
            <div className='flex flex-1 gap-x-1 items-center mt-2'>
                <CalendarDaysIcon className='w-6 h-6'/>
                <div className='text-neutral-600 text-sm font-normal leading-normal'>Joined <time>{timestamp}</time></div>
            </div>
            <div className='flex flex-1 gap-x-8 mt-2'>
                <div className='flex gap-x-2'>
                    <span className='text-gray-900 text-sm font-black leading-loose'>{followings}</span>
                    <span className='text-neutral-600 text-sm font-normal leading-loose'>following</span>
                </div>
                <div className='flex gap-x-2'>
                    <span className='text-gray-900 text-sm font-black leading-loose'>{followers}</span>
                    <span className='text-neutral-600 text-sm font-normal leading-loose'>followers</span>
                </div>
            </div> */}
        </div>
    )
}

// {/* <div className="flex -space-x-0.5">
// <dt className="sr-only">Accounts</dt>
// {icons.map((a) => (
//     <dd key={a}>
//         {/* <img
//             className="h-8 w-8 rounded-full bg-gray-50 ring-2 ring-white hover:w-10 hover:h-10"
//             src={a.imageUrl}
//             alt={a.name}
//         /> */}
//         {/* <button className=''> */}
//         <Image src={a} alt='WW' width={20} height={20} className='h-10 w-10'/>
//         {/* </button> */}
//         {/* {a} */}
//     </dd> */}
// ))}  
// </div>
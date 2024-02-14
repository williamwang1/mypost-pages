import React, { Fragment, useState, useRef } from 'react' ;
import { ChevronRightIcon, CalendarDaysIcon, InformationCircleIcon} from '@heroicons/react/20/solid'
import { useRouter } from 'next/navigation'
import Image from 'next/image';
import { SuiEvent, SuiObjectData, MoveStruct, SuiParsedData} from "@mysten/sui.js/client";
import { ProfileMetadataCreated, ProfileMedata, ProfileData } from "@/types/profile";
import { GetServerSideProps } from 'next';
import { API_HOST } from '@/lib/api/move';
import { ACCOUNT_LIST_ROUTE } from '@/lib/api/constant';
import { Account } from '@/types/auth';
import { SUI_MIST } from '@/lib/constant';


export default function ProfileSummary({ summary, pool, metadata, accounts, user}: {summary: any, pool: any, metadata: ProfileMedata, accounts: Account[], user: any}) {
    let [isOpen, setIsOpen] = useState(false)
    const router = useRouter();
    let avatar = summary?.content?.fields?.avatar
    let address = summary?.content?.fields?.owner
    let username = summary?.content?.fields?.name
    let bio = summary?.content?.fields?.bio
    let followers = pool?.content?.fields?.no_of_followers
    let followings = pool?.content?.fields?.no_of_followings
    let price = pool?.content?.fields?.price
    if (price > 0) {
        price = (price / SUI_MIST).toFixed(4)
    }
    let timestamp = <time>{metadata?.create_at?.toString().substring(0,10)}</time>;
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
    const handleFollow = () => {
        setIsOpen(true)
    }       
    let follow = <button className='bg-sky-400 rounded-3xl py-1 px-2 mt-2 mr-4' onClick={handleFollow}>
                    <span className='text-center text-white text-normal font-semibold leading-relaxed px-2 py-2'>Follow</span>
                </button>
    if (user.wallet === address) {
        follow = <button className='bg-sky-400 rounded-3xl py-1 px-2 mt-2 mr-4' onClick={handleFollow}>
                    <span className='text-center text-white text-normal font-semibold leading-relaxed px-2 py-2'>Edit</span>
                </button>
    }
    // TODO check whether user is following the profile accessed, if yes show unfollow, check in follow table, address is following, user is follower



    return (
        <div className='px-2'>
            <div className='flex justify-between items-center'>
                <div>
                    <div className='w-20 h-20 rounded-full border-white p-2'>
                        <Image src={avatar} alt='WW' width={100} height={100} className='rounded-full border-white'/>
                    </div>
                </div>
                <div>
                <div className='bg-white rounded-3xl flex items-center px-2 gap-x-2'>
                    <Image src='/images/sui.png' alt='WW' width={35} height={35} className='py-1'/>
                    <span className='text-center text-sky-500 text-base font-medium leading-relaxed'>{price}</span>
                </div>
                
                </div>
            </div>
            <div className='mt-2 text-gray-900 text-base font-black leading-relaxed'>{username}</div>
            <div className='text-gray-500 text-xs font-normal leading-relaxed truncate'>{address}</div>
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
                <div>
                    {follow}
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
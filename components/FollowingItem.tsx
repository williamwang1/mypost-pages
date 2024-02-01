
import { FollowData } from '@/types/follow'
import { ChevronRightIcon, EllipsisVerticalIcon } from '@heroicons/react/20/solid'
import { useEffect, useState } from 'react'
import { SuiObjectResponse } from "@mysten/sui.js/client";
import { sui } from '@/lib/api/shinami'
import Image from 'next/image';

export default function FollowingItem({f} : {f: FollowData}) {
    const [profile, setProfile] = useState<any>({})

    useEffect(() => {
      const getProfile = async () => {
        const profiledata: SuiObjectResponse = await sui.getObject({
            id: f.following_profile,
            options: { showBcs: true, showContent: true, showDisplay: true, showOwner: true, showPreviousTransaction: true, showStorageRebate: true, showType: true } 
        })
        setProfile(profiledata)
    }
        getProfile()
    }, [f.following_profile])



    if(!profile) {
        return <div>Loading</div>
    }
    let avatar = profile.data?.content?.fields?.avatar
    let address = profile.data?.content?.fields?.owner
    let username = profile.data?.content?.fields?.name
    let bio = profile.data?.content?.fields?.bio
    let timestamp = <time>{f.create_at.toString().substring(0,10)}</time>;

    return (
      <div className='relative group hover:bg-gray-50'>
        <li key={f.id} className="flex justify-between">
          <div className='flex gap-x-2 items-center'>
            <div className='rounded-full border-white flex items-center px-2'>
              <Image src={avatar} alt='MM' width={35} height={35} className='rounded-full border-white align-middle'/>
            </div>
            <div>
              <p className="text-sm font-semibold leading-6 text-gray-900">
                    <span className="absolute inset-x-0 -top-px bottom-0" />
                    {username}
              </p>
              <p className="mt-1 flex text-xs leading-5 text-gray-500 truncate max-w-32">
                {address}
              </p>
            </div>
          </div>
          <div className='flex items-center pt-2'>
            <div>
              <div className='bg-white rounded-3xl flex items-center gap-x-2'>
                    <Image src='/images/sui.png' alt='WW' width={25} height={25} className='py-1'/>
                    <span className='text-center text-sky-500 text-base font-medium leading-relaxed'>{f.price}</span>
              </div>
            </div>
            <ChevronRightIcon className="h-5 w-5 flex-none text-gray-400 align-middle pr-2" aria-hidden="true"/>
          </div>
      </li>
      <div className="text-sm leading-relaxed text-gray-900 mt-2">{bio}</div>
          <p className="mt-1 text-xs leading-5 text-gray-500">
              submitted {timestamp}
          </p>
    </div>
    )
}
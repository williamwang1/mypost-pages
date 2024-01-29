import { FollowData } from "@/types/follow";
import React, { useEffect, useState , useRef} from 'react'
import { SuiObjectResponse } from "@mysten/sui.js/client";
import { sui } from '@/lib/api/shinami'
import { ChevronRightIcon, EllipsisVerticalIcon } from '@heroicons/react/20/solid'
import { useRouter } from 'next/navigation'
import Image from 'next/image';


export default function FollowerItem({f}: {f: FollowData}) {
  const [profile, setProfile] = useState<SuiObjectResponse>({})
  const router = useRouter()
  const isInitialRender = useRef(true);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    const getProfile = async () => {
      const profiledata: SuiObjectResponse = await sui.getObject({
          id: f.follower_profile,
          options: { showBcs: true, showContent: true, showDisplay: true, showOwner: true, showPreviousTransaction: true, showStorageRebate: true, showType: true } 
      })
      setProfile(profiledata)
  }
      getProfile()
  }, [f.follower_profile])


  if(!profile) {
    return <div>Loading2</div>
  }

  let avatar = profile.data?.content?.fields?.avatar
  let address = profile.data?.content?.fields?.owner
  let username = profile.data?.content?.fields?.name
  let bio = profile.data?.content?.fields?.bio
  let timestamp = <time>{f.create_at.toString().substring(0,10)}</time>;

    return (
        <li key={f.id} className="relative flex flex-1 group gap-x-6 px-2 py-1 hover:bg-gray-50">
          <div className="flex min-w-0 gap-x-4">
            <img className="h-12 w-12 flex-none rounded-full bg-gray-50" src={avatar} alt="" />
            <div className="min-w-0 flex-auto">
              <p className="text-sm font-semibold leading-6 text-gray-900">
                <a href=''>
                  <span className="absolute inset-x-0 -top-px bottom-0" />
                  {username}
                </a>
              </p>
              <p className="mt-1 flex text-xs leading-5 text-gray-500 truncate max-w-xs">
                {address}
              </p>
              <div className="text-sm leading-relaxed text-gray-900 mt-2">{bio}</div>
            </div>
          </div>
          <div className="flex flex-1 items-center">
            <div className="flex flex-1 flex-col items-end">
                <div className='bg-white rounded-3xl flex items-center px-2 gap-x-2'>
                    <Image src='/images/sui.png' alt='WW' width={25} height={25} className='py-1'/>
                    <span className='text-center text-sky-500 text-base font-medium leading-relaxed'>{f.price}</span>
                </div>
                <p className="mt-1 text-xs leading-5 text-gray-500">
                  {timestamp}
                </p>
            </div>
            <ChevronRightIcon className="h-5 w-5 flex-none text-gray-400 align-middle" aria-hidden="true"/>
          </div>
        </li>
    )
}
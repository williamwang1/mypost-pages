import { FollowData } from "@/types/follow";
import React, { useEffect, useState , useRef} from 'react'
import { sui } from '@/lib/api/shinami'
import { ChevronRightIcon, EllipsisVerticalIcon } from '@heroicons/react/20/solid'
import { useRouter } from 'next/navigation'
import Image from 'next/image';
import { ProfileMedata } from "@/types/profile";
import { SUI_MIST } from "@/lib/constant";


export default function ProfileItem({p, onLoadingChange}: {p: ProfileMedata, onLoadingChange: (loading: boolean) => void}) {
  const [profile, setProfile] = useState<any>({})
  const [pool, setPool] = useState<any>({})
  const router = useRouter()

  useEffect(() => {

    const getProfile = async () => {
      const profiledata: any = await sui.getObject({
          id: p.profile_id,
          options: { showBcs: true, showContent: true, showDisplay: true, showOwner: true, showPreviousTransaction: true, showStorageRebate: true, showType: true } 
      })
      const pooldata: any = await sui.getObject({
        id: p.profile_pool_id,
        options: { showBcs: true, showContent: true, showDisplay: true, showOwner: true, showPreviousTransaction: true, showStorageRebate: true, showType: true } 
      })
      setProfile(profiledata)
      setPool(pooldata)
  }
      getProfile()
  }, [p.profile_id, p.profile_pool_id])

  const handleClick = () => {
    onLoadingChange(true)
    router.push(`/profile/${p.address}`)
  }


  let avatar = profile.data?.content?.fields?.avatar
  let address = profile.data?.content?.fields?.owner
  let username = profile.data?.content?.fields?.name
  let bio = profile.data?.content?.fields?.bio
  let timestamp = <time>{p.create_at.toString().substring(0,10)}</time>;
  let price = pool.data?.content?.fields?.price
  if (price > 0) {
      price = (price / SUI_MIST).toFixed(4)
  }


    return (
      <div className='relative group hover:bg-gray-50' onClick={handleClick}>
        <li key={p.id} className="flex justify-between">
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
                    <span className='text-center text-sky-500 text-base font-medium leading-relaxed'>{price}</span>
              </div>
            </div>
            <ChevronRightIcon className="h-5 w-5 flex-none text-gray-400 align-middle pr-2" aria-hidden="true"/>
          </div>
        </li>
        <div className="text-sm leading-relaxed text-gray-900 mt-2">
          {bio}
        </div>
        <p className="mt-1 text-xs leading-5 text-gray-500 pl-2">
            submitted {timestamp}
        </p>
      </div>
    )
}
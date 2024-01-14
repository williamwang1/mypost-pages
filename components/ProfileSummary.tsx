import React, { Fragment, useState, useRef } from 'react' ;
import { ChevronRightIcon, CalendarDaysIcon, InformationCircleIcon} from '@heroicons/react/20/solid'
import { useRouter } from 'next/navigation'
import Image from 'next/image';

export default function ProfileSummary() {
    let [isOpen, setIsOpen] = useState(false)
    const router = useRouter();

    
    const handleFollow = () => {
        setIsOpen(true)
    }

    return (
        <div>
            <div className='flex flex-col mt-3 z-0'>
                {/* <div className='h-60 rounded-tl-xl rounded-tr-xl bg-sky-400'></div> */}
                <div className='flex flex-1 mt-5 w-full justify-between'>
                    <div className='w-20 h-20 rounded-full border-white bg-sky-500'></div>
                    <div className='flex flex-1 justify-end items-center'>
                        <div className='flex flex-1 justify-end rounded-3xl gap-x-2'>
                            <button className='bg-white rounded-3xl flex items-center px-2 gap-x-2' onClick={() => router.push('/follow')}>
                                <Image src='/images/logo.png' alt='WW' width={40} height={40} className=''/>
                                <span className='text-center text-sky-500 text-base font-medium leading-relaxed'>999</span>
                            </button>
                        </div>
                        <button className='bg-sky-400 rounded-3xl' onClick={handleFollow}>
                            <span className='text-center text-white text-normal font-semibold leading-relaxed px-2 py-2'>Follow</span>
                        </button>
                    </div>
                </div>
            </div>
            <div className='mt-2 text-gray-900 text-base font-black leading-relaxed'>william.wang</div>
            <div className='text-gray-500 text-base font-normal leading-relaxed'>addressxxxxx</div>
            <div className='text-gray-900 text-base font-normal leading-normal mt-2'>he general impression that sb/sth gives to the public and the amount of attention they receive</div>
            <div className='flex flex-1 gap-x-1 items-center mt-2'>
                <CalendarDaysIcon className='w-6 h-6'/>
                <div className='text-neutral-600 text-sm font-normal leading-normal'>Joined June 2012</div>
            </div>
            <div className='flex flex-1 gap-x-8 mt-2'>
                <div className='flex gap-x-2'>
                    <span className='text-gray-900 text-sm font-black leading-loose'>35</span>
                    <span className='text-neutral-600 text-sm font-normal leading-loose'>following</span>
                </div>
                <div className='flex gap-x-2'>
                    <span className='text-gray-900 text-sm font-black leading-loose'>234</span>
                    <span className='text-neutral-600 text-sm font-normal leading-loose'>followers</span>
                </div>
            </div>
        </div>
    )

}
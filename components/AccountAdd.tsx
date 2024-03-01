'use client'
import React, { Fragment, useState, useRef } from 'react';
import {Drawer} from 'vaul';
import { RadioGroup } from '@headlessui/react'
import { signIn } from 'next-auth/react';
import { User } from 'next-auth'
import prisma from "@/lib/prisma";
import { ZkLoginUser } from '@shinami/nextjs-zklogin';
import { API_HOST } from '@/lib/api/move';

const types = [
    { id: 1, name: 'Twitter', description: '', url: '/well', tooltip: '' },
]
  
  
interface Type {
    id: number,
    name: string,
    description: string,
    url: string,
    tooltip: string
}
  
function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(' ')
}

// interface Account {
//     id: number,
//     name: string,
//     logo: React.JSX.Element,
//     url: string
//}

export default function AccountAdd({ user }: { user: ZkLoginUser}) {
    let [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState<Type>({ id: 0, name: '', description: '', url: '', tooltip: ''});

    const handleSelect = (s: Type) => {
        setSelected(s)
        // console.log(JSON.stringify(s))
        //setRedirectURl(s.url)
    }

    const handleConfirm = () => {
        signIn("twitter", { callbackUrl: `${API_HOST}/account/${user.wallet}`}, `${user.wallet}`)
    }
    let button = null
    // console.log('select' + JSON.stringify(selected))
    if (selected.id != 0) {
        button =<button className=' bg-sky-500 rounded-3xl py-3 w-full'
                onClick={handleConfirm}
                >
                    <span className='text-white font-semibold'>Confirm</span>
                </button>
    } else {
        button =<button disabled className='bg-sky-200 rounded-3xl py-3 w-full'
                onClick={handleConfirm}
                >
                    <span className='text-white font-semibold'>Confirm</span>
                </button>
    }

    return (

    <Drawer.Root>
        <Drawer.Trigger className='mt-5 w-full text-white bg-sky-400 rounded-2xl py-2'>
        {/* <button className='mt-5 px-10 bg-sky-400 rounded-3xl py-2'> */}
            <span className='text-normal font-semibold'>Connect</span>
        {/* </button> */}
        </Drawer.Trigger>
        <Drawer.Portal>
            <Drawer.Overlay className="fixed inset-0 bg-black/40" />
            <Drawer.Content className="bg-zinc-100 flex flex-col rounded-t-[10px] h-[50%] mt-24 fixed bottom-0 left-0 right-0">
                <div className="p-4 bg-white rounded-t-[10px] flex-1">
                    <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-300 mb-8" />
                    <RadioGroup value={selected} onChange={handleSelect}>
                        <RadioGroup.Label className="sr-only">Accounts</RadioGroup.Label>
                        <div className="-space-y-px rounded-md bg-white">
                            {types.map((type, typeId) => (
                                <RadioGroup.Option
                                key={type.name}
                                value={type}
                                className={({ checked }) =>
                                    classNames(
                                    typeId === 0 ? 'rounded-tl-md rounded-tr-md' : '',
                                    typeId === types.length - 1 ? 'rounded-bl-md rounded-br-md' : '',
                                    checked ? 'z-10 border-sky-100 bg-sky-100' : 'border-gray-200',
                                    'relative flex cursor-pointer border-b p-4 focus:outline-none'
                                    )
                                }
                                >
                                {({ active, checked }) => (
                                    <>
                                    <span
                                        className={classNames(
                                        checked ? 'bg-sky-500 border-transparent' : 'bg-white border-gray-300',
                                        active ? 'ring-2 ring-offset-2 ring-sky-500' : '',
                                        'mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded-full border flex items-center justify-center'
                                        )}
                                        aria-hidden="true"
                                    >
                                        <span className="rounded-full bg-white w-1.5 h-1.5" />
                                    </span>
                                    <span className="ml-3 flex flex-col relative group">
                                        <RadioGroup.Label
                                        as="span"
                                        className={classNames(checked ? 'text-sky-500' : 'text-gray-900', 'block text-sm font-medium')}
                                        >
                                        {type.name}
                                        {/* <span><InformationCircleIcon className='relative text-sky-500 h-5 w-5 inline mx-2'/>

                                        </span> */}

                                        </RadioGroup.Label>
                                        <RadioGroup.Description
                                        as="span"
                                        className={classNames(checked ? 'text-sky-500' : 'text-gray-500', 'block text-sm')}
                                        >
                                        {type.description}

                                        </RadioGroup.Description>
                                        {/* <span className="absolute left-10 bottom-12 scale-0 transition-all rounded bg-sky-500 p-2 text-xs text-white group-hover:scale-100">
                                        {type.tooltip}
                                        </span> */}
                                    </span>
                                    </>
                                )}
                                </RadioGroup.Option>
                            ))}
                        </div>
                    </RadioGroup>
                </div>
                <div className='p-4 bg-white'>
                    {button}
                </div>
               
          </Drawer.Content>
        </Drawer.Portal>
    </Drawer.Root>
    )
}
   
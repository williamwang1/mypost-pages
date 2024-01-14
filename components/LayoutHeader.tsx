import React, { Fragment, useState } from 'react'
import { ZkLoginUser } from '@shinami/nextjs-zklogin';
import {Drawer} from 'vaul';
import UserDropdown from './UserDropdown';
import { Dialog, Menu, Transition } from '@headlessui/react'
import {
    Bars3Icon,
    BellIcon,
    HomeIcon,
    UserIcon,
    XMarkIcon,
    WalletIcon,
    UserGroupIcon,
    BuildingStorefrontIcon,
    EllipsisHorizontalIcon,
    SquaresPlusIcon,
    SignalIcon,
    CurrencyDollarIcon,
    ChartBarIcon,
    Cog8ToothIcon,
    MagnifyingGlassIcon,
} from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'

interface Item {
    id: number,
    name: string,
    href: string,
    icon: React.JSX.Element,
    current: boolean
}

const navigation = [
    { id: 1, name: 'Home', href: '/home', icon: HomeIcon, current: true },
    { id: 2, name: 'Wallet', href: '/wallet', icon: WalletIcon, current: false },
    { id: 3, name: 'Profile', href: '/profile', icon: UserIcon, current: false },
    { id: 5, name: 'Explore', href: '/explore', icon: MagnifyingGlassIcon, current: false },
    { id: 8, name: 'Airdrop', href: '/airdrop', icon: SignalIcon, current: false },
    { id: 4, name: 'Notification', href: '#', icon: BellIcon, current: false },
    { id: 6, name: 'Communities(Coming Soon)', href: '#', icon: UserGroupIcon, current: false },
    { id: 7, name: 'Marketplace(Coming Soon)', href: '#', icon: BuildingStorefrontIcon, current: false },
    { id: 9, name: 'Apps(Coming Soon)', href: '#', icon: SquaresPlusIcon, current: false },
]

function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(' ')
}


export default function LayoutHeader({ user, index }: { user: ZkLoginUser, index: number }) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [selectedItem, setSelectedItem] = useState(index);
    const router = useRouter() 
    const handleSelect = (index: number) => {
        //console.log('Item clicked:', index); // Log which item is clicked
        setSelectedItem(index);
    }

    return (
        <div className='flex flex-1 gap-x-1 border-b-2 items-center justify-between w-full pb-1 fixed left-0 right-0 top-0 z-50 bg-white shadow-lg px-2'>
            {/* <div className='text-gray-900 text-normal font-bold leading-relaxed'>Accounts</div> */}
            {/* <Drawer.Root>
                <Drawer.Trigger>
                    <Bars3Icon className='w-10 h-10 text-slate-600'/>
                </Drawer.Trigger>
                <Drawer.Portal>
                    <Drawer.Overlay className="fixed inset-0 bg-black/40" />
                    <Drawer.Content className="bg-zinc-100 flex flex-col rounded-t-[10px] h-[50%] mt-24 fixed bottom-0 left-0 right-0">

                    </Drawer.Content>
                </Drawer.Portal>
            </Drawer.Root> */}
            <Bars3Icon className='w-10 h-10 text-slate-600'/>
            <Transition.Root show={sidebarOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
            <Transition.Child
                as={Fragment}
                enter="transition-opacity ease-linear duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity ease-linear duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div className="fixed inset-0 bg-gray-900/80" />
            </Transition.Child>

            <div className="fixed inset-0 flex">
                <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
                >
                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                    <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    >
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                        <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                        </button>
                    </div>
                    </Transition.Child>
                    {/* Sidebar component, swap this element with another sidebar if you like */}
                    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                    <div className="flex h-33 shrink-0 items-center">
                        <img
                        className="h-33 w-auto"
                        src="/assets/images/logo.svg"
                        alt="Your Company"
                        />
                        <div className="text-sky-400 text-xl font-bold font-['Inter'] leading-relaxed">truefans.tech</div>
                    </div>
                    <nav className="flex flex-1 flex-col">
                        <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                                <ul role="list" className="-mx-2 space-y-1">
                                {navigation.map((item, index) => (
                                    <li key={index}>
                                    <a
                                        href={item.href}
                                        className={classNames(
                                        selectedItem === index
                                            ? 'bg-gray-50 text-sky-400'
                                            : 'text-gray-700 hover:text-sky-400 hover:bg-gray-50',
                                        'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                        )}
                                    >
                                        <item.icon
                                        className={classNames(
                                        selectedItem === index ? 'text-sky-400' : 'text-gray-400 group-hover:text-sky-400',
                                            'h-6 w-6 shrink-0'
                                        )}
                                        aria-hidden="true"
                                        />
                                        {item.name}
                                    </a>
                                    </li>
                                ))}
                                </ul>
                            </li>
                            <li>
                        </li>
                        </ul>
                    </nav>
                    </div>
                </Dialog.Panel>
                </Transition.Child>
            </div>
            </Dialog>
            </Transition.Root>
            
            <div className=''>
            <UserDropdown user={user}/>
            </div>
        </div>
    )
}
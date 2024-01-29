
import React, { Fragment, useState } from 'react'
import { Dialog, Menu, Transition } from '@headlessui/react'
import { useRouter } from 'next/navigation'

interface Item {
    id: number,
    name: string,
    href: string,
    icon: React.JSX.Element,
}

import {
    HomeIcon,
    UserIcon,
    XMarkIcon,
    WalletIcon,
    MagnifyingGlassIcon,
    PlusCircleIcon
} from '@heroicons/react/24/outline'
const navigation = [
    { id: 1, name: 'Home', href: '/home', icon: HomeIcon },
    { id: 2, name: 'Wallet', href: '/wallet', icon: WalletIcon },
    { id: 3, name: 'Transaction', href: '/transaction', icon: PlusCircleIcon },
    { id: 4, name: 'Explore', href: '/explore', icon: MagnifyingGlassIcon },
    { id: 5, name: 'Profile', href: '/profile', icon: UserIcon },

    // { id: 8, name: 'Airdrop', href: '/airdrop', icon: SignalIcon, current: false },
    // { id: 4, name: 'Notification', href: '#', icon: BellIcon, current: false },
    // { id: 6, name: 'Communities(Coming Soon)', href: '#', icon: UserGroupIcon, current: false },
    // { id: 7, name: 'Marketplace(Coming Soon)', href: '#', icon: BuildingStorefrontIcon, current: false },
    // { id: 9, name: 'Apps(Coming Soon)', href: '#', icon: SquaresPlusIcon, current: false },
]

function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(' ')
}

export default function BottomNav(props: {index: number, user: any}) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [selectedItem, setSelectedItem] = useState(props.index);
    const router = useRouter() 
    const handleSelect = (index: number) => {
        //console.log('Item clicked:', index); // Log which item is clicked
        setSelectedItem(index);
    }

 
    return (
        <nav className="flex flex-1 w-full fixed bottom-0 left-0 right-0 bg-white shadow-xl z-50">
        <ul role="list" className="flex flex-1 justify-evenly w-full">
            {navigation.map((item , index) => (
            <li key={index} onClick={() => handleSelect(index)}>
                <button
                    className={classNames(
                    selectedItem == index ? 'bg-gray-50 text-sky-400' : 'text-gray-700 hover:text-sky-400 hover:bg-gray-50',
                    'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                    )}
                    onClick={() => {
                        // console.log(item.id)
                        // if (item.id === 5) {
                        //     item.href = `/profile/${props.user.wallet}`
                        // }
                        router.push(item.href)
                    }}
                >
                {/* <div> */}
                    <item.icon
                        className={classNames(
                        selectedItem === index ? 'text-sky-400' : 'text-gray-400 group-hover:text-sky-400',
                        'h-8 w-8 shrink-0'
                        )}
                        aria-hidden="true"
                    />
                {/* </div>
                <div>
                    {item.name}
                </div> */}
                
                </button>
            </li>
            ))}
        </ul>
    </nav>
    )
}
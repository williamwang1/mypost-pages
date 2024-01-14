import { EllipsisVerticalIcon } from '@heroicons/react/20/solid'
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import { ShareIcon } from '@heroicons/react/24/outline'



const assets = [
    {id: 1, name: 'well 1', initials: 'WW', 
        content: {
            price: 'current price is xxxx',
            quantity: 'remaining qty is xxx',
        },
    },
    {id: 2, name: 'well 2', initials: 'WW', 
        content: {
            price: 'current price is xxxx',
            quantity: 'remaining qty is xxx',
        },
    },
    {id: 3, name: 'well 3', initials: 'WW',
        content: {
            price: 'current price is xxxx',
            quantity: 'remaining qty is xxx',
        },
    },
    {id: 4, name: 'well 4', initials: 'WW',
        content: {
            price: 'current price is xxxx',
            quantity: 'remaining qty is xxx',
        },
    },
    {id: 5, name: 'well 5', initials: 'WW',
        content: {
            price: 'current price is xxxx',
            quantity: 'remaining qty is xxx',
        },
    },
]

function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(' ')
}
  
export default function MyAssets() {

    return (
        <ul role="list" className="mt-5 grid grid-cols-1 gap-5 pb-5 px-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {assets.map((a) => (
                <li key={a.id} className="col-span-1 flex flex-col rounded-md shadow-lg ">
                    <div className="flex flex-auto px-2 gap-x-3 items-center">
                        <div className='flex w-10 h-10 flex-shrink-0 items-center justify-center rounded-full text-normal font-medium text-white bg-sky-400'>
                            {a.initials}
                        </div>
                        <div className="flex flex-auto justify-between items-center">
                            <div>
                                <div className="text-gray-900 text-base font-medium leading-relaxed">
                                    {a.name}
                                </div>
                                <div className="text-gray-500 text-sm font-normal leading-relaxed">
                                    3hrs ago
                                </div>
                            </div>
                            <div className="flex-shrink-0">
                                <button
                                    type="button"
                                    className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-transparent bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                    <span className="sr-only">Open options</span>
                                    <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col flex-1 justify-center mt-3">
                        {Object.entries(a.content).map(([key, value], i) => (
                            <div className="relative flex px-2 pt-2" key={i}>
                                <div className="min-w-0 flex-1 leading-relaxed items-center">
                                    <label htmlFor="comments" className="text-xs font-medium text-gray-900">
                                    {key}
                                    </label>
                                    <p id="comments-description" className="text-xs text-gray-500">
                                    {value}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className='flex justify-around mt-4 gap-x-3'>
                        <a href='#'>
                            <div className="text-center text-sky-500 text-xs font-medium leading-relaxed py-2">
                                LEARN MORE
                            </div>
                        </a>
                        <a href='#'>
                            <ShareIcon className="w-8 h-8 self-center text-sky-500 px-2" aria-hidden="true"/>
                        </a>
                    </div>
                </li>
            ))}
        </ul>
    )
}
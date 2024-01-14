import { ChevronRightIcon, EllipsisVerticalIcon } from '@heroicons/react/20/solid'
import { useRouter } from 'next/navigation'

const transactions = [
  {
    id: 1,
    name: 'Leslie Alexander',
    address: 'addressxxxxxxxxxxxxxxx',
    account: 'Ethereum',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    href: '/transaction/1',
    bio: 'bio informaiton xxxxxxxxxx',
    lastSeen: '3h ago',
    lastSeenDateTime: '2023-01-23T13:23Z',
  },
  {
    id: 2,
    name: 'Michael Foster',
    address: 'addressxxxxxxxxxxxxxxx',
    account: 'Polygon',
    imageUrl:
      'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    href: '/transaction/1',
    bio: 'bio informaiton xxxxxxxxxx',
    lastSeen: '3h ago',
    lastSeenDateTime: '2023-01-23T13:23Z',
  }
]

export default function MyFollowings() {
  const router = useRouter()


  return (
    <ul
      role="list"
      className="divide-y divide-gray-100 overflow-hidden bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl"
    >
      {transactions.map((t) => (
        <li key={t.id} className="relative flex group justify-between gap-x-6 px-4 py-5 hover:bg-gray-50 sm:px-6">
          <div className="flex min-w-0 gap-x-4">
            <img className="h-12 w-12 flex-none rounded-full bg-gray-50" src={t.imageUrl} alt="" />
            <div className="min-w-0 flex-auto">
              <p className="text-sm font-semibold leading-6 text-gray-900">
                <a href={t.href}>
                  <span className="absolute inset-x-0 -top-px bottom-0" />
                  {t.name}
                </a>
              </p>
              <p className="mt-1 flex text-xs leading-5 text-gray-500">
                {t.address}
              </p>
              <div className="text-sm leading-relaxed text-gray-900 mt-2">{t.bio}</div>
            </div>
            
          </div>
          <div className="flex shrink-0 items-center gap-x-4">
            <div className="hidden sm:flex sm:flex-col sm:items-end">
              <p className="text-sm leading-6 text-gray-900">{t.account}</p>
              {t.lastSeen ? (
                <p className="mt-1 text-xs leading-5 text-gray-500">
                  submitted <time dateTime={t.lastSeenDateTime}>{t.lastSeen}</time>
                </p>
              ) : (
                <div className="mt-1 flex items-center gap-x-1.5">
                  <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </div>
                  <p className="text-xs leading-5 text-gray-500">submitted just now</p>
                </div>
              )}
            </div>
                <EllipsisVerticalIcon className="h-5 w-5 flex-none text-gray-400" aria-hidden="true"/>
          </div>
        </li>
      ))}
    </ul>
  )
}

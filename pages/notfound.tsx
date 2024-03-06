
// TODO Reply, Repost or Post not found page

import Link from "next/link";

export default function NotFound () {

    return (
        <div className="flex flex-col gap-y-2">
            NotFound
            <Link href="/authzk/login">Go to Login or Signup</Link>
            <Link href="/profile">Go to my profile</Link>
        </div>
    )
   
}
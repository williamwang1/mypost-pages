import Popover from "@/components/popover";
import { LogOut } from "lucide-react";
// import { Session } from "next-auth";
// import { Session } from '@/types/auth'
import { AUTH_API_BASE, LOGIN_PAGE_PATH, ZkLoginUser } from "@shinami/nextjs-zklogin";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
//import { ConnectButton, useCurrentWallet } from "@mysten/dapp-kit";
import { useRouter } from "next/navigation";
import { JWT } from "next-auth/jwt";
import { Google } from "@/components/icons";
import { ChevronRightIcon, ChevronDownIcon } from '@radix-ui/react-icons';



export default function UserDropdown({ user }: { user: ZkLoginUser}) {
  // const { email, image } = session?.user || {};
  const [openPopover, setOpenPopover] = useState(false);
  // const { currentWallet, connectionStatus } = useCurrentWallet();
  const router = useRouter();

  // const isWallet = connectionStatus === 'connected';
  // const isZKlogin = session != null;
  // console.log('Wallet ' + isWallet);
  // console.log('zk login ' + isZKlogin);
  // console.log(address)
  // if (!isWallet && !isZKlogin) {
  //   router.push('/auth')
  // }


  return (
    <div className="relative inline-block text-left">
      <Popover
        content={
          <div className="w-full rounded-md bg-white p-2 sm:w-56">
            <div className="p-2">
              <p className="truncate text-sm text-gray-500">
                {user.wallet}
              </p>
            </div>
            <button
              className="relative flex w-full items-center justify-start space-x-2 rounded-md p-2 text-left text-sm transition-all duration-75 hover:bg-gray-100"
              onClick={() => router.push(`${AUTH_API_BASE}/logout`)}
            >
              <LogOut className="h-4 w-4" />
              <p className="text-sm">Logout</p>
            </button>
          </div>
        }
        align="end"
        openPopover={openPopover}
        setOpenPopover={setOpenPopover}
      >
        <button
          onClick={() => setOpenPopover(!openPopover)}
          className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-gray-300 transition-all duration-75 focus:outline-none active:scale-95 sm:h-9 sm:w-9"
        >
          {/* <span className="text-gray-900 text-normal font-bold leading-relaxed"> */}
          <Google className="h-2 w-2" />
          {/* <ChevronRightIcon/> */}
          {/* </span> */}
        </button>
      </Popover>
    </div>
  );
}

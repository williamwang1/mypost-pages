import Popover from "@/components/popover";
import { LogOut } from "lucide-react";
import { AUTH_API_BASE, LOGIN_PAGE_PATH, ZkLoginUser } from "@shinami/nextjs-zklogin";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { JWT } from "next-auth/jwt";
import { Google } from "@/components/icons";
import { ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/24/outline';



export default function UserDropdown({ user }: { user: ZkLoginUser}) {
  const [openPopover, setOpenPopover] = useState(false);
  const router = useRouter();

  return (
    <div className="">
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
          className="flex h-8 w-16 items-center justify-end overflow-hidden rounded-full transition-all duration-75 focus:outline-none active:scale-95"
        >
          <Google className="h-8 w-8" />
          <ChevronRightIcon className="h-4 w-4 text-gray-700"/>
        </button>
      </Popover>
    </div>
  );
}

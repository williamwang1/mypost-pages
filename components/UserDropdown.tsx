import Popover from "@/components/popover";
import { LogOut } from "lucide-react";
import { AUTH_API_BASE, LOGIN_PAGE_PATH, ZkLoginUser } from "@shinami/nextjs-zklogin";
import { signOut } from "next-auth/react";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { JWT } from "next-auth/jwt";
import { Google } from "@/components/icons";
import { ChevronRightIcon, ChevronDownIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import { trucateAddress } from "@/lib/shared/utils";
import * as Toast from '@radix-ui/react-toast';



export default function UserDropdown({ user }: { user: ZkLoginUser}) {
  const [openPopover, setOpenPopover] = useState(false);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const timerRef = useRef(0);

  const handleLogout = () => {
    
    router.push(`${AUTH_API_BASE}/logout`)
  }

  const handleCopyClick = () => {
    navigator.clipboard.writeText(user.wallet) // Write text to clipboard
      .then(() => {
        //console.log("Text copied to clipboard:", address);
        setOpen(false);
        window.clearTimeout(timerRef.current);
        timerRef.current = window.setTimeout(() => {
        setOpen(true);
      }, 100);
        //alert(address);
      })
      .catch(err => {
        console.error("Failed to copy text: ", err);
        // alert("Failed to copy text. Please try again.");
      });
};

  return (
    <div className="">
      <Popover
        content={
          <div className="w-full rounded-md bg-white p-2 sm:w-56">
            <div className="p-2 flex gap-x-2">
              <p className="text-sm text-gray-500">
                {trucateAddress(user.wallet)}
              </p>
              <Toast.Provider swipeDirection="right">
                    <button  onClick={handleCopyClick}>
                        <ClipboardDocumentIcon className="h-5 w-5 flex-none font-bold text-gray-500 hover:text-gray-800" aria-hidden="true"/>
                    </button>
                    <Toast.Root         
                        open={open}
                        onOpenChange={setOpen} className='fixed bottom-18 right-8 z-50 flex gap-x-2 items-center shadow-lg bg-sky-500 text-white rounded-xl'>
                        <Toast.Description className='font-bold px-2 py-1'>copied!</Toast.Description>
                        {/* <Toast.Close aria-label="Close" className='font-bold text-xl'>
                            <span aria-hidden>×</span>
                        </Toast.Close> */}
                    </Toast.Root>
                    <Toast.Viewport />
                </Toast.Provider>
            </div>
            <button
              className="relative flex w-full items-center justify-start space-x-2 rounded-md p-2 text-left text-sm transition-all duration-75 hover:bg-gray-100"
              onClick={handleLogout}
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

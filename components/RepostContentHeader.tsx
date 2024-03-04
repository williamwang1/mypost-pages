import { trucateAddress } from '@/lib/shared/utils';
import * as Toast from '@radix-ui/react-toast';
import { ClipboardDocumentIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { useRef, useState } from 'react';

export default function RepostContentHeader ({digest}: {digest: string}) {
    const [open, setOpen] = useState(false);
    const timerRef = useRef(0);

    let target = '/transaction/' + digest

    const handleCopyClick = () => {
        navigator.clipboard.writeText(digest) // Write text to clipboard
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
        <div className='flex gap-x-4 items-center mt-2'>
            <label htmlFor="content" className="block text-base font-bold leading-6 text-gray-900">
                    Repost To:
            </label>
            <a href={target} className='text-base text-sky-400 underline'>{trucateAddress(digest)}</a>
            <Toast.Provider swipeDirection="right">
                <button  onClick={handleCopyClick}>
                    <ClipboardDocumentIcon className="h-4 w-4 flex-none font-bold text-gray-500 hover:text-gray-800" aria-hidden="true"/>
                </button>
                <Toast.Root         
                    open={open}
                    onOpenChange={setOpen} className='fixed bottom-18 right-8 z-50 flex gap-x-2 items-center shadow-lg bg-sky-500 text-white rounded-xl'>
                    <Toast.Description className='font-bold px-2 py-1'>copied!</Toast.Description>
                </Toast.Root>
                <Toast.Viewport />
            </Toast.Provider>
        </div>
    )
}
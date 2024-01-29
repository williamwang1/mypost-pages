import React, { Fragment, useState, useRef } from 'react' ;
import StepperPublic from '@/components/StepperPublic';
import { useRouter } from 'next/navigation'

export default function TransactionStepperPublic({summary, handleSummary, free, handleFree, step, handleStepChange} 
    : 
    {summary: string, handleSummary: (newSummary: string) => void, 
    free: string, handleFree: (newFree: string) => void, 
    step: number, handleStepChange: (newStep: number) => void}) {

    let button = null
    if (summary && summary.length > 0 && free && free.length > 0) {
        button = <button
                    type="button"
                    className="px-6 py-2 bg-sky-400 rounded-md border justify-center items-center text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
                    onClick={() => handleStepChange(step + 1)}
                >
                    Next
                </button>
    } else {
                button = <button
                type="button"
                className="px-6 py-2 bg-sky-800 disabled rounded-md border justify-center items-center text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
                // onClick={() => handleStepChange(step + 1)}
            >
                Disabled
            </button>
    }
    const router = useRouter()

    return (
        <div className='px-2'>
        <StepperPublic/>
        <div className="grid grid-cols-6 mt-2">
            <div className="col-start-1 col-end-7">
                <label htmlFor="summary" className="block text-base font-bold leading-6 text-gray-900">
                    Summary
                </label>
                <div className="mt-2">
                    <textarea
                    id="summary"
                    name="summary"
                    rows={1}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6"
                    value={summary}
                    onChange={(e) => handleSummary(e.target.value)}
                    />
                </div>
            </div>
        </div>
        <div className="flex flex-col flex-1 mt-5">
            <label htmlFor="content" className="block text-base font-bold leading-6 text-gray-900">
                Public Content
            </label>
            {/* <div className='mt-2'>
               <QuillNoSSRWrapper theme="snow" modules={modules} value={content} onChange={handleContentChange} className='h-48 max-h-60'/>
            </div> */}
            <div className="mt-2">
                <textarea
                id="summary"
                name="summary"
                rows={5}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6"
                value={free}
                onChange={(e) => handleFree(e.target.value)}
                />
            </div>
            <div className="flex justify-between mt-28 px-4 mb-16">
                <button type="button" 
                    className="px-4 py-2 bg-white rounded-md border border-gray-300 justify-center items-center gap-2.5 inline-flex text-sm font-semibold leading-6 text-gray-900"
                    onClick={() => router.push('/home')}
                >
                    Cancel
                </button>
                {/* <button
                    type="button"
                    className="px-6 py-2 bg-sky-400 rounded-md border justify-center items-center text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
                    onClick={() => handleStepChange(step + 1)}
                >
                    Next
                </button> */}
                {button}
            </div>
        </div>
    </div>
    )
}
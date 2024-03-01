import React from "react";
import PriceTooltip from './PriceTooltip';
import Tiptap from "./TipTap";


export default function CommonStepperPaid({paid, onPaidChange, step, onBackChange, onPaidNextChange, free}
    : {
        paid: string, onPaidChange: (newPaid: any) => void, 
        step: number, onBackChange: (newStep: number) => void,
        onPaidNextChange: (newDigest: string, newStep: number) => void,
        free: string
    }) {

    let paidContent = free + '<br/>'  + 'paid content' 

    let button = null
    if (paid && paid.length > 0) {
        button = <button
                    type="button"
                    className="px-6 py-2 bg-sky-400 rounded-md border justify-center items-center text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
                    onClick={() => onPaidNextChange(paidContent, step + 1)}
                >
                    Next
                </button>
    } else {
        button = <button
                    type="button"
                    className="px-6 py-2 bg-sky-200 disabled rounded-md border justify-center items-center text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
                    // onClick={() => handleStepChange(step + 1)}
                >
                Next
            </button>
    }
    return (
        <React.Fragment>
            <div className='flex gap-x-2 mt-2'>
                    <label htmlFor="content" className="block text-base font-bold leading-6 text-gray-900">
                    Paid Content
                    </label>
                    <label className='text-red-500'>*</label>
            </div>
            <div className='mt-2'>
                <Tiptap content={paid} readOnly={false} onChange={(value: any) => onPaidChange(value)} />
            </div>
            {/* <div className="relative mt-2 rounded-md shadow-sm">
                    <input
                    type="number"
                    name="price"
                    id="price"
                    className="block rounded-md border-0 py-1.5 text-center text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 text-sm leading-6"
                    placeholder="0.00"
                    aria-describedby="price-currency"
                    value={price}
                    onChange={handlePrice}
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <span className="text-gray-500 text-sm" id="price-currency">
                            SUI
                        </span>
                    </div>
            </div> */}
            <div className="flex flex-1 items-center mt-2 gap-x-2">
                <label htmlFor="price" className="text-base font-bold leading-6 text-gray-900">
                    Price
                </label>
                <label htmlFor="price" className="text-base font-normal leading-6 text-gray-500">
                    0
                </label>
                <label htmlFor="price" className="text-base font-bold leading-6 text-gray-900">
                    SUI
                </label>
                {/* <div className=''>
                    <PriceTooltip/>
                </div> */}
                <a href='' target='_blank' className='text-sky-500 text-sm underline'>Learn more</a>
            </div>
            <div className="flex justify-between mt-28 px-4 mb-16">
                <button type="button" 
                    className="px-4 py-2 bg-white rounded-md border border-gray-300 justify-center items-center gap-2.5 inline-flex text-sm font-semibold leading-6 text-gray-900"
                    onClick={() => onBackChange(step - 1)}
                >
                    Back
                </button>
                {button}
            </div>
        </React.Fragment>
    )
}


import React, { Fragment, useState, useRef } from 'react' ;
import StepperPaid from '@/components/StepperPaid';
import CommonStepperPaid from './CommonStepperPaid';
import ReplyContentHeader from './ReplyContentHeader';


export default function RepostStepperPaid({paid, onPaidChange, step, onBackChange, onPaidNextChange, free, digest}
     : {paid: string, onPaidChange: (newPaid: any) => void, 
        step: number, onBackChange: (newStep: number) => void
        onPaidNextChange: (newDigest: string, newStep: number) => void
        free: string, digest: string
    }) {

    return (
        <div className='px-2'>
            <StepperPaid/>
            <div className="flex flex-col flex-1">
                <ReplyContentHeader digest={digest}/>
                <CommonStepperPaid paid={paid} onPaidChange={onPaidChange} step={step} 
                onBackChange={onBackChange} onPaidNextChange={onPaidNextChange} free={free}/>
            </div>
        </div>
    )
}
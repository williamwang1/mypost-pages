import React, { Fragment, useState, useRef } from 'react' ;
import StepperPublic from '@/components/StepperPublic';
import ReplyContentHeader from './ReplyContentHeader';
import CommonStepperPublic from './CommonStepperPublic';

export default function RepostStepperPublic({free, handleFree, step, handleStepChange, digest} 
    : 
    {free: string, handleFree: (newFree: string, limit: number) => void, 
    step: number, handleStepChange: (newStep: number) => void, digest: string}) {


    return (
        <div className='px-2'>
        <StepperPublic/>
        <ReplyContentHeader digest={digest}/>
        <CommonStepperPublic free={free} handleFree={handleFree} 
        step={step} handleStepChange={handleStepChange} digest={digest}/>
    </div>
    )
}
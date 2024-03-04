import React, { Fragment, useState, useRef } from 'react' ;
import StepperPublic from '@/components/StepperPublic';
import CommonStepperPublic from './CommonStepperPublic';
import RepostContentHeader from './RepostContentHeader';

export default function RepostStepperPublic({free, handleFree, step, handleStepChange, digest} 
    : 
    {free: string, handleFree: (newFree: string, limit: number) => void, 
    step: number, handleStepChange: (newStep: number) => void, digest: string}) {


    return (
        <div className='px-2'>
        <StepperPublic/>
        <RepostContentHeader digest={digest}/>
        <CommonStepperPublic free={free} handleFree={handleFree} 
        step={step} handleStepChange={handleStepChange} digest={digest}/>
    </div>
    )
}
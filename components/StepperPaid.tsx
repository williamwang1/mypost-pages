import { CheckIcon } from '@heroicons/react/20/solid'
import { ReactNode } from 'react'
import Stepper from './Stepper'

const steps = [
    { id: 1, name: 'Public', href: '#', status: 'complete' },
    { id: 2, name: 'Paid', href: '#', status: 'current' },
    { id: 3, name: 'Post', href: '#', status: 'upcoming' },
]


export default function StepperPaid() {
    return (
        <Stepper steps={steps}/>
    )
}

import { CheckIcon } from '@heroicons/react/20/solid'
import { ReactNode } from 'react'
import Stepper from './Stepper'

const steps = [
  { id: 1, name: 'Public', href: '#', status: 'complete' },
  { id: 2, name: 'Paid', href: '#', status: 'complete' },
  { id: 3, name: 'Post', href: '#', status: 'current' },
]

function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(' ')
}

export default function StepperPreview() {
  return (
    <Stepper steps={steps}/>
  )
}

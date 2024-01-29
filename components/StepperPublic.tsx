import { CheckIcon } from '@heroicons/react/20/solid'
import { ReactNode } from 'react'
import Stepper from './Stepper'

const steps = [
  { id: 1, name: 'Public', href: '#', status: 'current' },
  { id: 2, name: 'Paid', href: '#', status: 'upcoming' },
  { id: 3, name: 'Post', href: '#', status: 'upcoming' },
]

function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(' ')
}

export default function StepperPublic() {
    return (
      <Stepper steps={steps}/>
    )
}

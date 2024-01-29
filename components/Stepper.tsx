
import { CheckIcon } from '@heroicons/react/24/outline'
function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(' ')
}
export default function Stepper({steps} : {steps: any[]}) {


    return (
    <nav aria-label="Progress">
        <ol role="list" className="flex mt-2 gap-x-8">
            {steps.map((step) => (
                <li key={step.name} className="flex-1">
                    {step.status === 'complete' ? (
                        <a
                        href={step.href}
                        className="group flex flex-1 border-sky-500 py-2 pl-4 border-b-4"
                        >
                        {/* <CheckIcon className='w-16 text-gray-900'/> */}
                        <span className="text-base font-black leading-relaxed text-sky-500 group-hover:text-sky-700">{step.id}</span>
                        <span className="text-base font-black leading-relaxed text-sky-500 group-hover:text-sky-700">.</span>
                        <span className="text-base font-black leading-relaxed text-sky-500 group-hover:text-sky-700">{step.name}</span>
                        </a>
                    ) : step.status === 'current' ? (
                        <a
                        href={step.href}
                        className="flex flex-1 border-sky-500 py-2 pl-4 border-b-4"
                        aria-current="step"
                        >
                        <span className="text-base font-black leading-relaxed text-sky-500">{step.id}</span>
                        <span className="text-base font-black leading-relaxed text-sky-500">.</span>
                        <span className="text-base font-black leading-relaxed text-sky-500">{step.name}</span>
                        </a>
                    ) : (
                        <a
                        href={step.href}
                        className="group flex flex-1 border-gray-200 py-2 pl-4 hover:border-gray-300 border-b-4"
                        >
                        <span className="text-base font-black leading-relaxed text-gray-500 group-hover:text-gray-700">{step.id}</span>
                        <span className="text-base font-black leading-relaxed text-gray-500 group-hover:text-gray-700">.</span>
                        <span className="text-base font-black leading-relaxed text-gray-500 group-hover:text-gray-700">{step.name}</span>
                        </a>
                    )}
                </li>
             ))}
        </ol>
    </nav>
    )
}
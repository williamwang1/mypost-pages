import * as Tooltip from '@radix-ui/react-tooltip';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline'

export default function ProfileTooltip() {
    return (
    <Tooltip.Provider>
        <Tooltip.Root>
            <Tooltip.Trigger asChild>
            <QuestionMarkCircleIcon className='h-6 w-6 shrink-0 text-sky-500'/>
            </Tooltip.Trigger>
                <Tooltip.Portal>
                    {/* <Tooltip.Content>
                    <Tooltip.Arrow /> */}
                    <Tooltip.Content
                        className="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade 
                        data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade 
                        data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade 
                        data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade 
                        text-violet11 select-none rounded-[4px] bg-white px-[15px] py-[10px] text-[15px] leading-none 
                        shadow-md will-change-[transform,opacity]"
                        sideOffset={5}
                    >
                    <Tooltip.Arrow className="fill-white" />
                    <div>
                    price = (number of followers)²/5000
                    </div>
                    <div className='mt-1 text-center'>
                        <a href='' target='_blank' className='text-sky-500'>Learn more</a>
                    </div>
                    
                    </Tooltip.Content>
                </Tooltip.Portal>
        </Tooltip.Root>
    </Tooltip.Provider>
    )
    
}
import { useRouter } from 'next/navigation'

export default function CommonStepperPublic(
    {free, handleFree, step, handleStepChange, digest} 
    : 
    {free: string, handleFree: (newFree: string, limit: number) => void, 
    step: number, handleStepChange: (newStep: number) => void, digest: string}
) {

    let button = null
    if ( free && free.length > 0) {
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
            className="px-6 py-2 bg-sky-200 disabled rounded-md border justify-center items-center text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
        >
            Next
        </button>
    }
    const router = useRouter()
    let limit = 200

    return (
        <div className="flex flex-col flex-1 mt-5">
        <div className='flex gap-x-2'>
            <label htmlFor="content" className="block text-base font-bold leading-6 text-gray-900">
                Public Content
            </label>
            <label className='text-red-500'>*</label>
        </div>
        <div className="mt-2">
            <textarea
            id="summary"
            name="summary"
            rows={5}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6"
            value={free}
            onChange={(e) => handleFree(e.target.value, 200)}
            />
        </div>
        <div className='mt-2 text-sm text-slate-500'>
            {free.length} / {limit}
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
    )
}
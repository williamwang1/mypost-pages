
import Nav from "@/components/Nav";
import { LoadingDots } from "@/components/icons";
import { INVITE_CHECK_ROUTE } from "@/lib/api/constant";
import { API_HOST } from "@/lib/api/move";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { withZkLoginSessionRequired, ZkLoginSession } from "@shinami/nextjs-zklogin/client";
import axios from "axios";
import { Router } from "lucide-react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useState } from "react";

export const getServerSideProps: GetServerSideProps = async (context) => {
    //console.log('in redirect ' + JSON.stringify(context.query.redirectTo))
    //const { slug } = context.params as { slug: string };
    let redirectTo = ''
    if ( context.query.redirectTo ) {
      redirectTo = context.query.redirectTo as string
      console.log('in redirect redirectTo ' + redirectTo)
    }
    return {props: {redirectTo} }
}

function Invite({ session, redirectTo} : {session: any, redirectTo: string}) {
    const {isLoading, user, localSession} = session
    const [code, setCode] = useState('')
    const [invalid, setInvalid] = useState(false)
    const [used, setUsed] = useState(false)
    const router = useRouter()
    const [clicked, setClicked] = useState(false);

    const handleChange = (e: any) => {
        setInvalid(false)
        setUsed(false)
        setCode(e.target.value)
    }

    const handleConfirm = () => {
        setUsed(false)
        setInvalid(false)
        setClicked(true)
        axios
            .post(`${API_HOST}${INVITE_CHECK_ROUTE}`, { code : code, address: user.wallet })
            .then((res) => {
                console.log('in invite ' + JSON.stringify(res.data))
                if (res.data.used) {
                    setUsed(true)
                } else {
                    router.push(`/account/${user.wallet}?address=${user.wallet}&redirectTo=${redirectTo}`)
                }
            // setLoading(false)
            })
            .catch((err) => {
                setInvalid(true)
                console.log(err)
            })
            setClicked(false)
        // TODO call check api
    }

    let button = null
    // console.log('select' + JSON.stringify(selected))
    if (code && code.length > 0) {
        if (clicked) {
            button = <button className=' bg-sky-500 rounded-3xl w-1/2 hover:bg-sky-800 mt-5 p-2 '
            onClick={handleConfirm}
            >
                {/* <span className='text-white font-semibold'>Confirm</span> */}
                <LoadingDots/>
            </button>
            
        } else {
            button =<button className=' bg-sky-500 rounded-3xl w-1/2 hover:bg-sky-800 mt-5 p-2 '
                onClick={handleConfirm}
                >
                    <span className='text-white font-semibold'>Confirm</span>
                </button>
        }

    } else {
        button =<button disabled className='bg-sky-200 rounded-3xl w-1/2 p-2 mt-5'
                onClick={handleConfirm}
                >
                    <span className='text-white font-semibold'>Confirm</span>
                </button>
    }

    let next = null
    if (clicked) {
        next = <LoadingDots/>
    } else {
        next = <span>Next</span>
    }

    return (
        <Nav bottomIndex={-1} leftIndex={-1} user={user}>
            <div className="flex flex-col items-center">
                {/* <div className="mt-2"> */}
                    <input
                    id="code"
                    name="code"
                    className="rounded-3xl w-1/2 border-0 p-2 mt-5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
                     placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 text-center"
                    value={code}
                    placeholder="invitation code"
                    onChange={(e) => handleChange(e)}
                    />
                {/* </div> */}
                <div className="flex gap-x-2 px-5 mt-5 items-center">
                    <InformationCircleIcon className="w-8 h-8 text-sky-500"/>
                    <div className="text-sky-500">Currently in Beta testing, Breaking changes may occur !!!</div>
                </div>
                {/* <div className=' bg-white'> */}
                    {button}
                {/* </div> */}
                {invalid && <div className="text-red-500 mt-2">Invalid Code</div>}
                {used && <div className="text-red-500 mt-2">Code used</div>}
            </div>
        </Nav>
    )
}

export default withZkLoginSessionRequired(Invite);
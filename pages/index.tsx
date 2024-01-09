import HeaderMarketing from '@/components/HeaderMarketing'
import Hero from '@/components/Hero'
import Footer from '@/components/Footer'
import { useZkLoginSession } from "@shinami/nextjs-zklogin/client";

export default function Home() {
  const { user, isLoading } = useZkLoginSession();
    return (
      <div className='flex flex-1 flex-col container w-screen'>
      {/* <ConnectWallet/> */}
        <HeaderMarketing/>
        <Hero/>
        <Footer/>
      </div>
    )
}

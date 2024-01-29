import { ZkLoginSessionProvider } from "@shinami/nextjs-zklogin/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react"
import './globals.css'
import React, { useEffect } from 'react';
import { sui, suic} from '@/lib/hooks/sui'
import { MYPOST_MOVE_PACKAGE_ID, EXAMPLE_MOVE_PACKAGE_ID } from "@/lib/api/move";
import { getFullnodeUrl, SuiClient, SuiHTTPTransport } from '@mysten/sui.js/client';
import { WebSocket } from 'ws';

// const suiC = new SuiClient({
// 	transport: new SuiHTTPTransport({
// 		url: getFullnodeUrl('testnet'),
// 		// The typescript definitions may not match perfectly, casting to never avoids these minor incompatibilities
// 		WebSocketConstructor: WebSocket as never,
// 	}),
// });

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      refetchOnWindowFocus: false
    }
  } 
});
// const Package = EXAMPLE_MOVE_PACKAGE_ID

export default function MyApp({ Component, pageProps : { session, ...pageProps } }: AppProps) {


  // useEffect(() => {
  //   // Subscribing to events
  //   let unsubscribe: any
  //   const subscribeToEvent = async () => {
  //     try {
  //       unsubscribe = await suic.subscribeEvent({
  //         filter: { Package: EXAMPLE_MOVE_PACKAGE_ID },
  //         onMessage: (event) => {
  //           console.log('on Message')
  //           console.log('subscribeEvent', JSON.stringify(event, null, 2));
  //         },
  //       });
  //     } catch (error) {
  //       console.error('Error subscribing to events:', error);
  //     }
  //   };

  //   subscribeToEvent();

  //   // Cleanup subscription on unmount
  //   return () => {
  //     if (unsubscribe) {
  //       unsubscribe().catch((error: any)  => {
  //         console.error('Error during unsubscribe:', error);
  //       });
  //     }
  //   };
  // }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <ZkLoginSessionProvider>
        <SessionProvider session={session}>
          <Component {...pageProps} />
        </SessionProvider>
      </ZkLoginSessionProvider>
    </QueryClientProvider>
  );
}

import { ZkLoginSessionProvider } from "@shinami/nextjs-zklogin/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react"
import './globals.css'
import './styles.scss'
import React, { useEffect } from 'react';
import { sui, suic} from '@/lib/hooks/sui'
import { MYPOST_MOVE_PACKAGE_ID, EXAMPLE_MOVE_PACKAGE_ID } from "@/lib/api/move";
import { getFullnodeUrl, SuiClient, SuiHTTPTransport } from '@mysten/sui.js/client';
import { WebSocket } from 'ws';
import Head from "next/head";

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
          <Head>
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <title>My awesome PWA app</title>
          <meta name="description" content="Best PWA app in the world!" />
          <link rel="shortcut icon" href="/favicon.ico" />
          <link rel="mask-icon" href="/icons/mask-icon.svg" color="#FFFFFF" />
          <meta name="theme-color" content="#ffffff" />
          <link rel="apple-touch-icon" href="/icons/touch-icon-iphone.png" />
          <link
            rel="apple-touch-icon"
            sizes="152x152"
            href="/icons/touch-icon-ipad.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/icons/touch-icon-iphone-retina.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="167x167"
            href="/icons/touch-icon-ipad-retina.png"
          />
          <link rel="manifest" href="/manifest.json" />
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:url" content="https://yourdomain.com" />
          <meta name="twitter:title" content="My awesome PWA app" />
          <meta name="twitter:description" content="Best PWA app in the world!" />
          <meta name="twitter:image" content="/icons/twitter.png" />
          <meta name="twitter:creator" content="@DavidWShadow" />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="My awesome PWA app" />
          <meta property="og:description" content="Best PWA app in the world!" />
          <meta property="og:site_name" content="My awesome PWA app" />
          <meta property="og:url" content="https://yourdomain.com" />
          <meta property="og:image" content="/icons/og.png" />
          {/* add the following only if you want to add a startup image for Apple devices. */}
          <link
            rel="apple-touch-startup-image"
            href="/images/apple_splash_2048.png"
            sizes="2048x2732"
          />
          <link
            rel="apple-touch-startup-image"
            href="/images/apple_splash_1668.png"
            sizes="1668x2224"
          />
          <link
            rel="apple-touch-startup-image"
            href="/images/apple_splash_1536.png"
            sizes="1536x2048"
          />
          <link
            rel="apple-touch-startup-image"
            href="/images/apple_splash_1125.png"
            sizes="1125x2436"
          />
          <link
            rel="apple-touch-startup-image"
            href="/images/apple_splash_1242.png"
            sizes="1242x2208"
          />
          <link
            rel="apple-touch-startup-image"
            href="/images/apple_splash_750.png"
            sizes="750x1334"
          />
          <link
            rel="apple-touch-startup-image"
            href="/images/apple_splash_640.png"
            sizes="640x1136"
          />
        </Head>
          <Component {...pageProps} />
        </SessionProvider>
      </ZkLoginSessionProvider>
    </QueryClientProvider>
  );
}

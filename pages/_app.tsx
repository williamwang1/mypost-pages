import { ZkLoginSessionProvider } from "@shinami/nextjs-zklogin/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react"
import './globals.css'

const queryClient = new QueryClient();

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ZkLoginSessionProvider>
        <SessionProvider >
          <Component {...pageProps} />
        </SessionProvider>
      </ZkLoginSessionProvider>
    </QueryClientProvider>
  );
}

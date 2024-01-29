import { useAddMutation, useRecentTxsQuery } from "@/lib/hooks/api";
import { getSuiExplorerTransactionUrl } from "@/lib/hooks/sui";
import { AddResponse } from "@/lib/shared/interfaces";
import { withZkLoginSessionRequired } from "@shinami/nextjs-zklogin/client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import React, { useEffect } from 'react';
import { sui, suic} from '@/lib/hooks/sui'
import { MYPOST_MOVE_PACKAGE_ID, EXAMPLE_MOVE_PACKAGE_ID } from "@/lib/api/move";

// import { getFullnodeUrl, SuiClient, SuiHTTPTransport } from '@mysten/sui.js/client';
// import { WebSocket } from 'ws';

// const suiC = new SuiClient({
// 	transport: new SuiHTTPTransport({
// 		url: getFullnodeUrl('testnet'),
// 		// The typescript definitions may not match perfectly, casting to never avoids these minor incompatibilities
// 		WebSocketConstructor: WebSocket as never,
// 	}),
// });

// This is an auth-protected page. Anonymous users will be auto-redirected to the login page.
export default withZkLoginSessionRequired(({ session }) => {
  const { isLoading, user, localSession } = session;
  const [result, setResult] = useState<AddResponse>();
  const { mutateAsync: add, isPending: isAdding } = useAddMutation();
  const { data: txs, isLoading: isLoadingTxs } = useRecentTxsQuery();
  const router = useRouter();

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

  if (isLoading) return <p>Loading zkLogin session...</p>;

  return (
    <>
      <h1>Hello, {user.oidProvider} user!</h1>
      <div>
        <form
          onSubmit={async (e) => {
            e.preventDefault();

            const data = new FormData(e.currentTarget);
            const x = parseInt(data.get("x") as string);
            const y = parseInt(data.get("y") as string);
            if (isNaN(x) || isNaN(y)) return;

            const result = await add({
              x,
              y,
              keyPair: localSession.ephemeralKeyPair,
            });
            setResult(result);
            //router.push('/another')
          }}
        >
          <div>
            <input
              type="number"
              min={0}
              name="x"
              placeholder="x"
              onChange={() => setResult(undefined)}
            />{" "}
            +{" "}
            <input
              type="number"
              min={0}
              name="y"
              placeholder="y"
              onChange={() => setResult(undefined)}
            />{" "}
            ={" "}
            {result ? (
              <Link
                href={getSuiExplorerTransactionUrl(result.txDigest, true)}
                target="_blank"
              >
                {result.result}
              </Link>
            ) : (
              "?"
            )}
          </div>
          <div>
            <input type="submit" value="Calculate on Sui" disabled={isAdding} />
          </div>
        </form>
      </div>
      <div>
        <p>Recent transactions:</p>
        {isLoadingTxs ? (
          <p>Loading...</p>
        ) : !txs ? (
          <p>Failed to load recent transactions</p>
        ) : (
          <ul>
            {txs.txDigests.map((txDigest) => (
              <li key={txDigest}>
                <Link
                  href={getSuiExplorerTransactionUrl(txDigest, true)}
                  target="_blank"
                >
                  {txDigest}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
});

import { withZkLoginSessionRequired } from "@shinami/nextjs-zklogin/client";
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { usePublishMutation, useRecentTxsQuery } from "@/lib/hooks/api";
import { sui } from '@/lib/api/shinami'
import { useState } from "react";
import path from 'path';
import { TransactionResponse } from "@/lib/shared/interfaces";

const publish = async () => {
    let modulePath = path.join(__dirname, '.')
}

export default withZkLoginSessionRequired(({session}) => {
    const { isLoading, user, localSession } = session;
    const [result, setResult] = useState<TransactionResponse>();
    const { mutateAsync: publish, isPending: isPublishing } = usePublishMutation();

    let des : string[] = ['Sui', 'MoveStdlib']
    const handleSumbit = async (e: any) => {
        // const txb = new TransactionBlock();
        // const [coin] = txb.splitCoins(txb.gas, [1]);
        // txb.publish(['mypost'], des);
        // txb.setGasBudget(100000);
        // const result = await signAndExecuteTransactionBlock({transactionBlock: tx});
        // console.log(result);
        e.preventDefault();

        const data = new FormData(e.currentTarget);
        const x = parseInt(data.get("x") as string);
        const y = parseInt(data.get("y") as string);
        if (isNaN(x) || isNaN(y)) return;

        const result = await publish({
          keyPair: localSession.ephemeralKeyPair,
        });
        setResult(result);
        //router.push('/another')

    }

    return (
        <button onSubmit={handleSumbit}>

        </button>
    )
})
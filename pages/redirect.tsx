import Nav from "@/components/Nav";
import React, { Fragment, useState, useEffect } from 'react' ;
import { GetServerSideProps, NextPage } from 'next';
import { withZkLoginSessionRequired, ZkLoginSession } from "@shinami/nextjs-zklogin/client";
import { API_HOST } from "@/lib/api/move";
import { PROFILE_GET_ROUTE } from "@/lib/api/constant";
import axios from "axios";
import { useRouter } from "next/router";

export const getServerSideProps: GetServerSideProps = async (context) => {
   // console.log('in redirect ' + JSON.stringify(context.query.redirectTo))
   // const { redirectTo } = context.query.redirectTo
    let redirectTo = ''
    if ( context.query.redirectTo ) {
      redirectTo = context.query.redirectTo as string
      console.log('in redirect redirectTo ' + redirectTo)
    }
    return {props: { redirectTo } }
}

function Redirect({ session, redirectTo }: {session: any, redirectTo: string}) {
    const {isLoading, user, localSession} = session

    let address = user.wallet
    const router = useRouter()

    useEffect(() => {
        const getRedirect = () => {
            axios
                .post(`${API_HOST}${PROFILE_GET_ROUTE}`, { slug : address })
                .then((res) => {
                    console.log('in redirect ' + JSON.stringify(res.data))
                    if (res.data) {
                        if (redirectTo.length === 0) {
                            router.push('/home')
                        } else {
                            // existing + transaction
                            router.push(`${API_HOST}${redirectTo}`)
                        }
                    }  else {
                        if (redirectTo.length === 0) {
                            console.log('in redirect new user + marketing')
                            router.push(`/invite?redirectTo=`)
                            // new user + marketing
                            // invite -> account -> profile
                        } else {
                            console.log('in redirect new user + transaction')
                            // new user + transaction
                            router.push(`/invite?redirectTo=${redirectTo}`)
                            // invite?redirectTo= --> acccount?redirectTo= ---> API_HOST/redirectTo
                        }
                    }
                // setLoading(false)
                })
                .catch((err) => {
                    console.log(err)
                });
        }
        getRedirect()
    }, [address, redirectTo, redirectTo.length, router])
    return (
        <Nav bottomIndex={-1} leftIndex={-1} user={user}>
            Rediecting
        </Nav>
    )
}

export default withZkLoginSessionRequired(Redirect);
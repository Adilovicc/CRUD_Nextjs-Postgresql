import '../styles/globals.css'
import {RecoilRoot} from 'recoil'
import React from 'react'
import {SessionProvider} from 'next-auth/react'

function MyApp({ Component, pageProps : {session, ...pageProps} }) {

  return (
   <RecoilRoot>
    <SessionProvider session={session}>
    <Component {...pageProps} />
    </SessionProvider>
   </RecoilRoot>
  )
}

export default MyApp

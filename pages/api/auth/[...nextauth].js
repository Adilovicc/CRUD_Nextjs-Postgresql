import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import prisma from "../../../lib/prisma";
import {PrismaAdapter} from '@next-auth/prisma-adapter'


export const authOptions = {
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
    // ...add more providers here
  ], 
  pages: {
     signIn: '/login',
  },
  callbacks:{
     async session({session,user}){
          let usr = await prisma.user.findUnique({
             where:{
              email: session.user.email
             }
          })
          
          session = {...session, user: usr}

          return session;
     }

  }
  
}
export default NextAuth(authOptions)
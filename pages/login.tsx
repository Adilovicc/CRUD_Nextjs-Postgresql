import {signIn, getProviders, getSession} from 'next-auth/react'
import {useEffect} from 'react'
import loginLogo from '../public/loginLogo.png'
import Image from 'next/image'
import { useRouter } from 'next/router';

export default function Login ({session}:any) {
    const router = useRouter();
    useEffect(()=>{
        if(session){
            console.log("PUUSSHHH");
           router.push('/');

        }
    },[])
    return(
        <section className="h-screen w-full flex flex-col justify-center items-center bg-yellow-600">
             
             <Image
             className="pl-8"
             src={loginLogo} 
             width={240} height={240}
             alt={"Login-logo"}>
             </Image>
             <h5 className="text-5xl font-serif text-white font-bold">NOTES</h5>
             <button 
             className="w-[200px] h-[50px] transition duration-500 rounded-full mt-10 bg-white/30 hover:bg-white/60"
             onClick={()=>signIn('google', {callbackUrl:'/'})}>
                    <h3 className="text-black/80 font-serif font-bold text-xl">Login</h3> 
             </button>
        </section>
    )

}

export async function getServerSideProps(context){
    const session = await getSession(context);
   return{
     props:{
        session
     }
    }
}

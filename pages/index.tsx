import type { GetServerSideProps, NextPage } from 'next'
import { HandThumbUpIcon, TrashIcon, PencilSquareIcon, MagnifyingGlassIcon, PlusCircleIcon, MagnifyingGlassCircleIcon} from '@heroicons/react/24/outline'
import { PrismaClient, Prisma } from '@prisma/client'
import React from 'react'
import {useState, useRef, useEffect} from 'react'
import prisma from '../lib/prisma'
import {useRouter} from 'next/router'

import {noteFormData} from '../atoms/formData'
import {useRecoilState} from 'recoil'
import login from '../pages/login'
import notesLogo from '../public/notes-logo-png-transparent.png'
import {getSession, signOut} from 'next-auth/react'
import Image from 'next/image'
import $ from 'jquery'

interface Results{
  results:{
    title:string,
    content:string,
    id:string
  }[]
}
interface FormData  {
  title: string,
  content: string,
  id: string,
  authorId: string,
};

export default function Home ({results, user}:any){
  const [saveActive, setSaveActive] = useState<boolean>(false);
  //const [formDt, setFormDt] = useRecoilState(noteFormData);
  const [formDt,setFormDt] = useState<FormData>({title:"", content:"",id:"",authorId: user.id})
  const router= useRouter();
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [search, setSearch] = useState("");
  const searchRef = useRef(search);

  const searchInput = useRef();
  const refresh = () => {
    router.replace(router.asPath);
  }
 
 function create(data: FormData){
    setLoadingCreate(true);
    try {
      fetch('http://localhost:3000/api/create',
      {
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST'
      }).then(()=> {setFormDt({id:'',title:'', content:'',authorId:user.id}); refresh()}).catch((err)=>console.log(err)).finally(()=>setLoadingCreate(false));
    } catch (error) {
       console.log("Greska (fetch u index.tsx)"+ error)
    }
  }
  
  function deleteNote(id: string){
       try {
         fetch(`http://localhost:3000/api/note/${id}`,
         {
             headers:{
              "Content-Type": "application/json",
             },
             method:'DELETE'
         }).then(()=>{
          refresh();
         })
       } catch (error) {
         console.log(error+"  Greška index.tsx/deleteNote")
       }
  }

  function updateNote(data:FormData){
      setLoadingCreate(true);
      try {
          fetch(`http://localhost:3000/api/update`,
          {
            body: JSON.stringify(data),
            headers:{
                "Content-Type" : "application/json",
            },
            method:'POST'
          }).then(()=>{
            setFormDt({id:'',title:'', content:'',authorId:user.id});
            setSaveActive(false);
            refresh();
          }).finally(()=>setLoadingCreate(false));
      } catch (error) {
        console.log(error+" Greška index.tsx/updateNode")
        setFormDt({id:'',title:'', content:'',authorId:user.id});
        setSaveActive(false);
      }
  }

  const handleSubmit = async (data: FormData) =>{
         if(saveActive==false){
         try {
            create(data);
         } catch (error) {
            console.log(error);
         }
        }
        else{
          try {
            updateNote(data);
           } catch (error) {
            console.log(error+"EEEEEEEEEEEEEERPPRPRRROROORR");
           }
        }
    }

  const [inputVisibility, setInputVisibility] = useState(false);
  useEffect(()=>{
     const trackFocus = () =>{
        if(document.activeElement===searchInput.current){
          setInputVisibility(true);
          console.log("True");
        }
        //@ts-ignore
        if((document.activeElement !== searchInput.current) && searchRef.current == ''){
          console.log("Search je " + searchRef.current);
          setInputVisibility(false);
          console.log("FALSEggggg");
        }
     }

     addEventListener('focusin', trackFocus);
     addEventListener('focusout', trackFocus);

     return () =>{
        removeEventListener('focusin', trackFocus);
        removeEventListener('focusout', trackFocus);
     }

  }, [search])
  
  const setValue = (e:any) =>{
     setSearch(e.toLowerCase());
     console.log(search);
  }
 
  const [scrolled, setScrolled] = useState(false);

  useEffect(()=>{
     const handleScroll = () =>{
      if (window.scrollY>50) {
        setScrolled(true);
      }
      else setScrolled(false);
     }
     
     addEventListener('scroll', handleScroll);
     
     return () => {
        removeEventListener('scroll', handleScroll);
     }

  },[])
 
  const [toggleBodyScroll, setToggleBodyScroll] =useState(false);

  const toggleScroll = (tog) =>{
     if(tog)
     {
      $('body').css('overflow','hidden');
      setToggleBodyScroll(true);
     }
  }
  
  const noteInputForm = () =>{
     return(
      <form className="noteInputForm md:sticky top-20 z-50  flex mb-10 md:max-w-[500px] md:mb-0 flex-col mx-auto items-center w-[100%] px-5  h-auto space-y-1" onSubmit={(e)=>{e.preventDefault(); handleSubmit(formDt)}}>
            <input 
               type="text" 
               value={formDt.title}
               placeholder="Title"
               className="w-[100%] p-2 rounded-sm h-8 text-black bg-white"
               onChange={e=>setFormDt({...formDt, title: e.target.value})}
            />
             <textarea 
               value={formDt.content}
               placeholder="Content"
               className="w-[100%] p-2 text-black max-h-[500px] rounded-sm min-h-[200px] md:max-h-[550px] md:min-h-[400px] bg-white"
               onChange={e=>setFormDt({...formDt, content: e.target.value})}
            />
            {(saveActive===false) ? (<button type="submit" className="bg-white rounded-md w-[100%] h-10 text-red-600 text-lg font-bold ">Dodaj</button>) :
            (<button type="submit" className="bg-white rounded-md w-[100%] h-10 text-red-600 text-lg font-bold shadow-main-s">Sačuvaj</button>)}
  
      </form>
     )
  }

  useEffect(()=>{
      const handleCloseFormSection = (event:any) =>{
         if(event.target.classList.contains('fixedFormSection') && !event.target.classList.contains('noteInputForm')){
          $('body').css('overflow','auto');
          setToggleBodyScroll(false);
         }
      }

      addEventListener('click', handleCloseFormSection);

      return () =>{
        removeEventListener('click', handleCloseFormSection);
      }

  })

  useEffect(()=>{
      if(!loadingCreate){
        $('body').css('overflow','auto');
        setToggleBodyScroll(false);
      }
  },[loadingCreate]);

  useEffect(()=>{
       console.log("saddd");
       if(!user){
         router.push('/');
       }
  },[user]);

  return (
    <>

    {
    <div className="h-[4000px] relative overflow-hidden overflow-y-auto pt-40">
        <div className={`fixedFormSection top-0 left-0 right-0 bottom-0 bg-gray-500/20 backdrop-blur-lg z-50 flex justify-center items-center ${toggleBodyScroll ? 'fixed' : 'hidden' }`} onClick={()=>toggleScroll(false)}>
            {loadingCreate ? <div className='text-2xl animate-pulse font-bold'>Creating...</div> : noteInputForm()}
        </div>
        <div className={`top-menu ${scrolled ? 'top-menu-scrolled' : ''}`}>
          <div id="logo" className="w-1/4 max-w-[100px] h-[70px] z-50 flex items-center">
             <h6 className="text-3xl font-serif font-bold">NOTES</h6>
          </div>
         <div className="flex items-center">
          <div className="flex items-center">
           <PlusCircleIcon className="h-10" onClick={toggleScroll}/>
              <div id="searchSection" className={`grid grid-flow-col ${inputVisibility? 'searchVisible' : ''} items-center px-5 py-2`}>
             
              <div className={`searchInput ${inputVisibility ? 'searchInputVisible' : ''}`}>
              <input
              ref={searchInput}
              placeholder="Search here..." 
              onChange={e=>setValue(e.target.value)} 
              type="text" 
              className={`myInput focus:outline-none h-10 ${inputVisibility ? 'myInput-visible' : ''}`}></input>
              </div>
              
              <MagnifyingGlassCircleIcon 
              className="h-10 z-10" 
              //@ts-ignore
              onClick={()=>searchInput.current.focus()}>
              </MagnifyingGlassCircleIcon>
           </div>
           </div>
           <div className=" ml-5" onClick={()=>signOut()}>
              <img src={`${user.image}` || 'https://icons.veryicon.com/png/o/miscellaneous/two-color-icon-library/user-286.png'} className="h-10 w-10 rounded-full"></img>
           </div>
          </div>
        </div>
  
  
    
      <div className='w-full p-2 sm:px-[50px]'>
      
        {
          results.map((res,i)=>{ if(res.content.toLowerCase().includes(search) || res.title.toLowerCase().includes(search) ) return(
            <div className={`relative text-black ${i%2==0 ? 'bg-[#f3ececc6] hover:bg-[#f3ecec]' : 'bg-[#d7d6dac6] hover:bg-[#d7d6da]'}
             pb-10 mb-2 mx-1 flex flex-col text-sm  max-h-[350px] text-clip overflow-hidden rounded-md `} key={i}>
              
              <div className="flex flex-col justify-start"> 
               <div className='px-1 flex z-40 lg:text-lg font-semibold'>{res.title}</div>
               <div className='px-1 max-h-[100px] z-40 overflow-hidden'>{res.content}</div>
              </div>
              <div className='absolute bottom-1 right-1'>
               <div className='flex justify-between'>
                <PencilSquareIcon onClick={()=>{setFormDt(res); setSaveActive(true); toggleScroll(true);}} className="h-5 pl-2 cursor-pointer"></PencilSquareIcon>
                <HandThumbUpIcon className="h-5 pl-2"></HandThumbUpIcon>
                <TrashIcon onClick={()=>deleteNote(res.id)} className="h-5 pl-2 cursor-pointer"></TrashIcon>
                </div>
              </div>
            </div> 
            )
          })
        }
       </div>
      
    


       


    </div>
    }
    </>
  )
}

export const getServerSideProps: GetServerSideProps =  async (context:any) => {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: '/login', // Specify the URL of your loading page
        permanent: false,
      },
    };
  }
  const notes = await prisma.note.findMany({
    where:{
      //@ts-ignore
      userId:session.user?.id
    },
    select: {
      id:true,
      title:true,
      content:true,
      userId:true
    }
   })
   return {
    props: {
      results:notes,
      user:session?.user || null
  },
  }
}
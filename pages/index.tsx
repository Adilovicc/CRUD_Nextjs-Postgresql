import type { GetServerSideProps, NextPage } from 'next'
import { HandThumbUpIcon, TrashIcon, PencilSquareIcon, MagnifyingGlassIcon} from '@heroicons/react/24/outline'
import { PrismaClient, Prisma } from '@prisma/client'
import Head from 'next/head'
import Image from 'next/image'
import React from 'react'
import {useState} from 'react'
import prisma from '../lib/prisma'
import {useRouter} from 'next/router'
import { createNotEmittedStatement } from 'typescript'
import {noteFormData} from '../atoms/formData'
import {useRecoilState} from 'recoil'

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
  id: string
};

const Home = ({results}:Results)=> {
  const [saveActive, setSaveActive] = useState<boolean>(false);
  //const [formDt, setFormDt] = useRecoilState(noteFormData);
  const [formDt,setFormDt] = useState<FormData>({title:"", content:"",id:""})
  const router= useRouter();
   
  const [search, setSearch] = useState("");

  const refresh = () => {
    router.replace(router.asPath);
  }
 
  async function create(data: FormData){
    try {
      fetch('http://localhost:3000/api/create',
      {
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST'
      }).then(()=> {setFormDt({id:'',title:'', content:''}); refresh()})
    } catch (error) {
       console.log("Greska (fetch u index.tsx)"+ error)
    }
  }
  
  async function deleteNote(id: string){
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

  async function updateNote(data:FormData){
      try {
          fetch(`http://localhost:3000/api/update`,
          {
            body: JSON.stringify(data),
            headers:{
                "Content-Type" : "application/json",
            },
            method:'POST'
          }).then(()=>{
            setFormDt({id:'',title:'', content:''});
            setSaveActive(false);
            refresh();
          })
      } catch (error) {
        console.log(error+" Greška index.tsx/updateNode")
        setFormDt({id:'',title:'', content:''});
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
  

  return (
    <div className="h-screen relative bg-gradient-to-b to-red-600 from-red-700 md:from-black md:to-cyan-800 overflow-hidden overflow-y-auto">
    <div className="relative group">
      <input placeholder="Search here..." onChange={e=>setSearch(e.target.value.toLowerCase())} type="text" className="absolute text-center opacity-0 transition duration-500 group-hover:opacity-75 rounded-full top-4 z-40 right-5 bg-white/70 h-10 w-[200px] p-2 pr-10"></input>
      <MagnifyingGlassIcon className="absolute z-50 h-8 top-5 right-6 cursor-pointer"></MagnifyingGlassIcon>
    </div>
    <div className="fixed bottom-0 h-12 md:hidden w-full z-50 bg-gradient-to-t from-stone-900"  />
    <div className="fixed h-8 w-full md:hidden bottom-0 z-50 bg-gradient-to-t from-red-900/80"  />
    <div className="absolute top-0 w-full h-60 bg-gradient-to-b from-red-900 md:from-gray-800"></div>
    <div className="flex flex-col w-full md:flex-row justify-center sm:items-center md:items-start pt-20">
      <form className="md:sticky top-20 z-50 bg-inherit flex mb-10 md:max-w-[500px] md:mb-0 flex-col mx-auto items-center w-[100%] px-5  h-auto space-y-1" onSubmit={(e)=>{e.preventDefault(); handleSubmit(formDt)}}>
            <input 
               type="text" 
               value={formDt.title}
               placeholder="Title"
               className="w-[100%] p-2 rounded-sm h-8 text-black bg-[#f3ecec] shadow-content-s shadow-stone-800/80"
               onChange={e=>setFormDt({...formDt, title: e.target.value})}
            />
             <textarea 
               value={formDt.content}
               placeholder="Content"
               className="w-[100%] p-2 text-black max-h-[500px] rounded-sm min-h-[200px] md:max-h-[550px] md:min-h-[500px] bg-[#f3ecec] shadow-content-s shadow-stone-800/80 "
               onChange={e=>setFormDt({...formDt, content: e.target.value})}
            />
            {(saveActive===false) ? (<button type="submit" className="bg-white rounded-md w-[100%] h-10 text-red-600 text-lg font-bold shadow-main-s shadow-stone-800/70">Dodaj</button>) :
            (<button type="submit" className="bg-white rounded-md w-[100%] h-10 text-red-600 text-lg font-bold shadow-main-s shadow-stone-800/70">Sačuvaj</button>)}
  
      </form>
      <div className='pb-40 px-5 z-40 w-full sm:max-w-[800px] md:w-2/3 overflow-hidden grid md:grid-cols-2 grid-cols-1 lg:grid-cols-3'>
      
        {
          results.map((res,i)=>{ if(res.content.toLowerCase().includes(search) || res.title.toLowerCase().includes(search) ) return(
            <div className="relative text-[#25040c] bg-[#f3ecec] hover:bg-white hover:scale-105 shadow-content-s shadow-stone-800/80 pb-10 mb-2 mx-1 flex flex-col text-sm  max-h-[350px] text-clip overflow-hidden rounded-md" key={i}>
              
              <div className="flex flex-col justify-start"> 
               <div className='px-1 flex z-50 lg:text-lg font-semibold'>{res.title}</div>
               <div className='px-1 max-h-[100px] z-50 overflow-hidden'>{res.content}</div>
              </div>
              <div className='absolute bottom-1 right-1'>
               <div className='flex justify-between'>
                <PencilSquareIcon onClick={()=>{setFormDt(res); setSaveActive(true)}} className="h-5 pl-2 cursor-pointer"></PencilSquareIcon>
                <HandThumbUpIcon className="h-5 pl-2"></HandThumbUpIcon>
                <TrashIcon onClick={()=>deleteNote(res.id)} className="h-5 pl-2 cursor-pointer"></TrashIcon>
                </div>
              </div>
            </div> )
          })
        }
       </div>
      
     </div>


       


    </div>
  )
}

export default Home;

export const getServerSideProps: GetServerSideProps =  async () => {
   const notes = await prisma.note.findMany({
    select: {
      id:true,
      title:true,
      content:true
    }
   })

   
   return {
    props: {
      results:JSON.parse(JSON.stringify(notes))
    },
  }
}
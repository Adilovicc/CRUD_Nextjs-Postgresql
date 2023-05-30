import prisma from "../../lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";


export default async function handler(req: NextApiRequest, res: NextApiResponse){
    
    const {title, content, authorId} = req.body
    console.log('AUTOR ID je '+ authorId);
    try{
        await prisma.note.create({
            data:{
                title,
                content,
                userId:authorId
            }
        })
        res.status(200).json({message: 'Note Created'})
    } catch (error){
        console.log("Failure! Greška u create.ts");
    }
}
import prisma from "../../lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

const too = (req) =>{
    console.log(req.title+" ohooooo "+req.content+" "+req.id);
  }

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    too(req.body);
    const {id,title, content} = req.body

    try{
        await prisma.note.update({
            where: {
                id: Number(id),
            },
            data:{
                title:title,
                content:content
            }
        })
        res.status(200).json({message: 'Update successful'})
    } catch (error){
        console.log("Failure! Greška u update.ts");
    }
}
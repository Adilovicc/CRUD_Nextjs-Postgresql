import { NextApiRequest, NextApiResponse } from "next";
import prisma from '../../../lib/prisma'



export default async function handler(req: NextApiRequest, res: NextApiResponse){
    const noteId = req.query.id;
    const {title, content, id} = req.body;
    if(req.method === 'UPDATE'){
        const note= await prisma.note.update({
            where: {
              id: Number(noteId),
            },
            data: {
              title: title,
              content: content
            }
      })
      res.json(note)
    }
    if(req.method === 'DELETE'){
        const note = await prisma.note.delete({
            where: {id: Number(noteId)}
        })
        res.json(note)
    } 
    

}

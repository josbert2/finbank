
import { query } from '../libs/db'

export default async function handler(req, res) {
   let banks;
   const rows = await query({
     query: 'SELECT * FROM 	banks',
     values: []
   })
   res.status(200).json({ banks: rows })
}
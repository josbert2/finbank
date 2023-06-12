
import { query } from '../libs/db'

export default async function handler(req, res) {
   if (req.method == 'GET'){
      let mesagge;
      const id  = req.query.id;

   
      try {

         const findByBank = await query({
            query: 'SELECT movements.id, movements.type, movements.egreso, movements.message, movements.created_at FROM movements INNER JOIN banks ON banks.id = movements.bank_id WHERE banks.id = ? ORDER BY movements.id DESC',
            values: [id]
         })

       
         res.status(200).json({ movements: findByBank });
         
      } catch (error) {
         res.status(500).json({ message: 'Error interno del servidor' + error + id });
         return;
      } 
   }
}
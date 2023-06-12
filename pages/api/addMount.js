

import { query } from '../libs/db'


export default async function handler(req, res) {

   if (req.method == 'POST'){
      let mesagge;
      const { saldo, id, typeSaldo } = req.body;

      var operator = typeSaldo == 'entry' ? '+' : '-';
     
    
      try {
         const addBanks = await query({
            query: `UPDATE banks SET saldo = saldo ${operator} ? WHERE id = ?`,
            values: [saldo, id]
         })

        

         const getSaldo = await query({
            query: 'SELECT saldo FROM banks WHERE id = ?',
            values: [id]
         })

      

         if (getSaldo[0].saldo < 0 && typeSaldo == 'egreso') {
            res.status(200).json({ message: 'No se puede retirar más de lo que hay en la cuenta'  })
            return;
         }
         var arraySaldo = [];
         if (typeSaldo == 'entry') {
            var arraySaldo = [id, 'ingreso', saldo, 'Saldo agregado', new Date()]
         } else {
            var arraySaldo = [id, 'egreso', saldo, 'Saldo retirado', new Date()]
         }


      

         // INSERT INTO `movements` (`id`, `bank_id`, `type`, `egreso`, `message`, `created_at`) VALUES (NULL, '23', '', NULL, NULL, NULL);
         // get date now
        

         const addMovements = await query({
            query: 'INSERT INTO movements (bank_id, type, egreso, message, created_at) VALUES (?, ?, ?, ?, ?)',
            values: arraySaldo
         })

         
         




         res.status(200).json({ message: 'Saldo agregado correctamente'  })
      } catch (error) {
         console.error('Error al guardar la imagen:', error);
         res.status(500).json({ message: 'Error interno del servidor' + error });
         return;
      }
   }
}

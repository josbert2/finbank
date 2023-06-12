import { query } from '../libs/db'

export default async function handler(req, res) {
   let banks;
   const idBank = req.body.idBank;
   const saldo = req.body.saldo;
   const id = req.body.id;

  
   const rows = await query({
      query: 'UPDATE banks SET saldo = saldo + ? WHERE id = ?',
      values: [saldo, idBank]
   })




   

   

   // query of momevents
   const addMovements = await query({
      query: 'INSERT INTO movements (bank_id, type, egreso, message, created_at) VALUES (?, ?, ?, ?, ?)',
      values: [idBank, 'transferencia', saldo, 'Transferencia', new Date()]
   })

  
   // rest saldo of bank
   const restSaldo = await query({
      query: 'UPDATE banks SET saldo = saldo - ? WHERE id = ?',
      values: [saldo, id]
   })



   res.status(200).json({ message: 'Transferencia realizada con exito' })
   

}
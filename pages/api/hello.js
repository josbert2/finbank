// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { query } from '../libs/db'
import fs from 'fs-extra';
import { join } from 'path';
import path from 'path';

import crypto from 'crypto';


export default async function handler(req, res) {


  if (req.method == 'GET') {
    if (req.query.id) {
      const rows = await query({
        query: 'SELECT * FROM 	banks WHERE id = ?',
        values: [req.query.id]
      })
      res.status(200).json({ bank: rows[0] })
    }else{
      let banks;
      const rows = await query({
        query: 'SELECT * FROM 	banks',
        values: []
      })
      res.status(200).json({ banks: rows })
    }

    
  }

  if (req.method == 'POST'){
    let mesagge;
    const { name, numero, tipo, logo, image, correo, rut, nombres, apellidos } = req.body;

    // sacar el nombre de imagen


    // hash image  
    const hash = crypto.createHash('sha256');
    hash.update(image);
    const ImageName = hash.digest('hex');
    const fullImageExt = `${ImageName}.png`;



    const base64Image = image.split(';base64,').pop();
    const filePath = path.join(process.cwd(), 'public/uploads', `${fullImageExt}`);

    try {
      await fs.writeFile(filePath, base64Image, 'base64');
    } catch (error) {
      console.error('Error al guardar la imagen:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
      return;
    }

    try {
      const addBanks = await query({
        query: 'INSERT INTO banks (name, numero, tipo, logo, correo, rut, nombres, apellidos) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        values: [name, numero, tipo, fullImageExt, correo, rut, nombres, apellidos]
      });

     

  
      let message = '';
      let bank = {};
  
      if (addBanks.insertId) {
        message = 'Banco agregado';
        bank = {
          bank_id: addBanks.insertId,
          name: name,
          numero: numero.toString(),
          tipo: tipo,
          logo: logo,
          correo: correo,
          rut: rut,
          nombres: nombres,
          apellidos: apellidos
        };
      } else {
        message = 'Banco no agregado';
      }
  
      res.status(200).json({ message: message, bank: bank });
    } catch (error) {
      console.error('Error al agregar el banco:', error);
      res.status(500).json({ message: 'Error interno del servidor' + error });
    }
  }

  // find by id



  return res.status(200).json({ error: req.method  })
}

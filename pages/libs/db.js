import mysql from 'mysql2/promise'

export async function query({ query, values = [] }) {
   const dbconnection = await mysql.createConnection({
      host: 'localhost',
      database: 'account-banks',
      user: 'root',
      password: 'root'
   })


   try {
      const [rows] = await dbconnection.execute(query, values)
      dbconnection.end()
      return rows
   } catch (error) {
      dbconnection.end()
      throw Error(error.message)
   }
}
import mysql from 'mysql2/promise'

export async function executeQueryRDS(query) {

  const dbHost = process.env.HOST
  const dbUser = process.env.USERNAME
  const dbPassword = process.env.PASSWORD
  const dbName = process.env.DATABASENAME
  const dbPort = process.env.PORT

  const connection = await mysql.createConnection({
    host: dbHost,
    user: dbUser,
    password: dbPassword,
    database: dbName,
    port: dbPort
  })

  try {
    const response = await connection.query(query)
    return response
  } catch (error) {
    console.log(error)
  } finally {
    connection.end()
  }
}
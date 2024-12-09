import * as mariadb from 'mariadb'

export async function executeQuery(query) {
  
  const dbHost = process.env.HOST
  const dbUser = process.env.USERNAME
  const dbPassword = process.env.PASSWORD
  const dbName = process.env.DATABASENAME
  const dbPort = process.env.PORT

  const conn = await mariadb.createConnection({
    host: dbHost,
    user: dbUser,
    password: dbPassword,
    database: dbName,
    port: dbPort
  })

  try {
    const res = await conn.query(query)
    return res
  } catch (e) {
    console.log(e)
  } finally {
    conn.end()
  }
}
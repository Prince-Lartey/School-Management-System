import mysql from 'mysql'
import dotenv from 'dotenv';

dotenv.config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306
})

connection.connect(function(err) {
    if (err){
        console.log('Connection error:', err)
    }else {
        console.log('Connected to Database')
    }
})

export default connection
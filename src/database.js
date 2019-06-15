const mysql = require('mysql'); // Módulo para conectarse a un servidor MySQL
const { promisify } = require('util'); // Esta función sirve para poder usar promesas

const { database } = require('./keys'); // Importamos los datos de conexión (IP, credenciales...)

const pool = mysql.createPool(database); // Se crea una conexión MySQL usando los datos importades de keys.js

pool.getConnection((err, connection) => {
    // Añadimos los errores más comunes y mostrar por consola el problema.
    if (err) {
        if(err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('DATABASE CONNECTION LOST');
        }
        if(err.code === 'ER_CON_COUNT_ERROR') {
            console.log('DATABASE HAS TO MANY CONNECTIONS');
        }
        if(err.code === 'ECONNREFUSED') {
            console.error('DATABASE CONNECTION WAS REFUSED');
        }
    }else{
        // Si existe una conexión, se usará su método release para empezar la conexión.
        if(connection) connection.release(); 
        console.log('DB is Connected'); // Nos indica que se ha conectado a la base de datos.
        return;
    };
    
})

pool.query = promisify(pool.query); // promisify nos permitirá usar promesas de JavaScript en funciones que usan callbacks

module.exports = pool;

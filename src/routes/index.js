const router = require('express').Router();
const db = require('../database');

// En las rutas se responderán las distintas peticiones que haga el usuario. El método GET sirve para obtener datos
// mientras que el PUT para enviar. PUT para actualizar y DELETE elminiar.
// De cualquier método siempre manejaremos dos objetos: req (Request o petición) y res (Response o respuesta).
// Request es lo que el navegador envia. Este contiene, por ejemplo, las cabeceras, la URL, los datos enviados mediante un formulario...
// Response es lo que el servidor responde a una petición. Puede ser una plantilla o datos JSON.

// Ruta principal (/). Método GET
// Aquí se ve la función de promisify en la configuración de la base de datos. Sin Promisify no se podría usar async await
// en las consultas, haciendo que el código fuese mas complejo.

router.get('/' ,async (req,res) => {
    // Esto nos devuelve todas las variables que empiecen por version
    const version = await db.query('show variables like "version%"'); 
    // Esto nos devuelve el usuario conectado (en este caso nodesql) en formato RowDataPacket
    //var user = await db.query('SELECT USER()');
    //user = user[0]['USER()']; // Aquí indicamos que queremos obtener el primer objeto. Nos devolverá el usuario junto con el host
    //user = user.substring(0, user.search('@'));// Aquí se separa el usuario del host y obtenemos solo el usuario
    // Renderizamos la plantilla pero enviando la versión y el usuario para usarlos en esta.
    res.render('index', {version});
})

router.get('/about', (req,res) => {

    res.render('about');

})

module.exports = router; // Como necesitamos usar las rutas dentro de index.js principal, necesitamos exportar el módulo

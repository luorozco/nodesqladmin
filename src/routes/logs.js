const router = require('express').Router();
const db = require('../database');

// Se envía la plantilla
router.get('/', (req,res) => {
    res.render('logs');
})


router.get('/data.json', async (req,res) => {
    // Seleccionamos todas las columnas que vamos a querer ver. En este caso: Nombre del usuario, fecha de la modificación, variable modificada, valor anterior y valor nuevo
    const query = 'SELECT username, date, description, name_variable,old_value,new_value,modified,modificable FROM users U, logs L WHERE U.id = user';
    try{
        // Realizamos la consulta en la base de datos y lo enviamos en un JSON
        const listLogs = await db.query(query);
        res.json({'success': true ,'data':listLogs});
    }catch(e){
        res.json({'success': false});
    }
})


module.exports = router;
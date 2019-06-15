const router = require('express').Router();
const db = require('../database');

// Aquí renderizamos la plantilla simplemente
router.get('/', (req, res) => {

    res.render('processlist');
});

// Aquí se crea otra ruta que devolverá la lista de eventos y lo devolverá como un JSON
// Trataremos los datos con un archivo .js directamente en la plantilla.
router.get('/data', async (req,res) => {
    // El método try sirve para elevar errores, sobre todo en funciones asíncronas. Este método intentará cerrar el proceso y enviar un json confirmando la acción.
    //En el caso en el que no se pueda cerrar el proceso, se enviará otro json indicando que ha fallado.
    try{
        // Obtenemos todas las columnas (se especifican para poder usar FancyGrid) y filtramos para que no salgan ni el usuario de eventos ni el propio usuario de la aplicación.
        const pl = await db.query('SELECT id, user, host, db, command, time, state, info FROM information_schema.processlist WHERE USER NOT IN (?, ?)', ['event_scheduler', process.env.USERDB || 'nodesql']);
        // Si se puede obtener los datos, se envía un JSON con un success y un data. Este data es el que contendrá la lista de procesos.
        res.json({'success': true ,'data':pl});
    }catch(e){
        res.json({
            'success': true,
            'message': 'No se ha podido cargar los datos: '+e
        });
    }; 
    
});

// La ruta para cerrar el proceso. Será mediante el metodo DELETE
router.delete('/data', async (req,res) => {
    const { id } = req.body; // Extraemos el ID del proceso desde el req.body
    
    try {
        await db.query('KILL ?', [id]);
        res.json({'success': true, 'message': 'Proceso cerrado correctamente'});
    }catch(e){
        res.json({'success': false, 'message': 'No se ha podido cerrar el proceso'});

    }

});

module.exports = router;
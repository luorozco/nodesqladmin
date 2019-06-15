const router = require('express').Router();
const db = require('../database');

router.get('/', (req,res) => {
    res.render('variables');
});

router.get('/data.json', async (req,res) => {
    // Guardamos la consulta en una variable para poder leerla mejor y que no ocupe mucho espacio en una sola línea.
    // Esta consulta obtendrá todas las variables globales junto con su valor actual y su valor máximo y mínimo posibles.
    const query_all_variables = 'SELECT VI.variable_name, GV.variable_value, VI.min_value, VI.max_value FROM performance_schema.variables_info VI INNER JOIN performance_schema.global_variables GV USING(variable_name)';
    try {
        const result = await db.query(query_all_variables);
        res.json({'success': true,'data': result});
    } catch(e) {
        res.json({'success': false, 'message': 'ERROR: '+e});
    };
    
    
});

router.put('/data.json', async (req, res) => {
    // Esta condicional ternaria comprueba si el valor recibido no es un número válido. Si es así, mete el valor entre comillas. Al contrario, si es un número válido, deja el valor tal cual.
    // Esto sirve para comprobar si es un texto o un número ya que al hacer la consula hay que poner comillas. Con esto se resuelve.
    const value = isNaN(req.body.variable_value) ? "'"+req.body.variable_value+"'" : req.body.variable_value; 
    const query = 'SET GLOBAL '+req.body.variable_name+"="+value; // Concatenamos el nombre de la variable con el valor ya formateado según sea texto o número
    try {
        // Para registrar la variable modificada por cada usuario, primero guardaremos el antiguo valor de la variable.
        const old_value = await db.query("SHOW VARIABLES LIKE ?", req.body.variable_name);
        // Luego guardamos la consulta en una constante con los datos a insertar
        const log = `INSERT INTO logs(user,description,name_variable,old_value,new_value) VALUES (${req.user.id}, 'Variable Changed', '${req.body.variable_name}', '${old_value[0].Value}', '${req.body.variable_value}')`;
        await db.query(query);
        await db.query(log); // Ejecutamos la consulta para guardar el log.
        res.json({
            'status': true,
            'message': 'Se ha modificado correctamnete la variable'
        })
    }catch(e){
        res.json({
            'status': false,
            'message': 'No se ha podido modificar la variable'
        });
    };  
});

module.exports = router;
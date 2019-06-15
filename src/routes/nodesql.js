const router = require('express').Router();
const db = require('../database');

// Obtener la lista de los procesos.
// Lo enviamos como un json
router.get('/database', async (req,res) => {
    //await db.query('show processlist', (err, result) => {
    await db.query("select * from information_schema.processlist where user not like 'event_scheduler'", (err, result) => {
        
        if (err) throw err;
        res.send(result);
    })
});

// Renderizamos la plantilla de lista de procesos.
router.get('/processlist', (req,res) =>{
    res.render('processlist.hbs');
});

router.post('/processlist/kill/:id' , async (req, res) => {
    await db.query('kill '+req.params.id, (err, result) => {
        if (err) throw err;
        res.redirect('/processlist');
    })
})

module.exports = router;
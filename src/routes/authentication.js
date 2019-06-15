const router = require('express').Router();
const passport = require('passport');
const { isLoggedIn, isMod, isAdmin } = require('../helpers/auth');
const helpers = require('../helpers/helpers');
const db = require('../database');

// Esta ruta simplemente renderiza la plantilla de usuarios
// El "isLoggedIn" y "isSuper" se explicarán mas adelante
router.get('/users', [isLoggedIn, isAdmin], (req, res) => {

    res.render('auth/users');
});
// Esta ruta devuelve todos los usuarios de la base de datos menos a los SUPERADMIN
router.get('/users/data.json', [isLoggedIn, isAdmin], async (req, res) => {

    // Devuelve todos los usuarios menos el administrador principal y el usuario autenticado
    const listUsers = await db.query("SELECT * FROM users WHERE id NOT IN (?,?)", [1, req.user.id]);
    // Y lo devuelve en un objeto JSON
    res.json({ 'success': true, 'data': listUsers });

});

// Esta ruta es para crear usuarios. En vez de usar una función se puede usar de forma directa passport para crear al usuario
// En este caso se usará el sistema 'local.singup' del archivo passport.js
router.post('/users', [isLoggedIn, isAdmin], passport.authenticate('local.signup', {
    successRedirect: '/auth/users', // Si se crea el usuario de forma satisfactoria se redireccionará a la lista de usuarios
    failureRedirect: '/auth/users', // Igual si da un fallo
    successFlash: true, // Habilitamos que se envíen mensajes flash al crear un usuario correctamente
    failureFlash: true, // Y también si da fallo al crearlo
}));

// Esta ruta es para eliminar el usuario
router.delete('/users/data.json', [isLoggedIn, isAdmin], async (req, res) => {
    // Se elimina el usuario que tenga de ID el que se envíe desde el formulario
    try{
        db.query('DELETE FROM users WHERE id = ?', [req.body.id]);
        res.json({
            'success': true,
            'message': 'Se ha eliminado el usuario'
        })
    }catch(e){
        res.json({
            'success': false,
            'message': 'No se ha podido eliminar el usuario'
        })
    };
});

// Ruta para actualizar a los usuarios. En este caso solo se podrá modificar el rol del usuario
router.put('/users/data.json', [isLoggedIn, isAdmin], async (req, res) => {
    // Obtenemos el ID del usuario y el rol nuevo
    const { id, role } = req.body;

    try {
        // Actualizamos el usuario con el rol nuevo
        const result = await db.query('UPDATE users SET role = ? WHERE id_user = ?', [role, id]);
        res.json({ 'success': true });
    } catch (e) {
        res.json({ 'success': false });
    };

});

router.put('/changePassword', isLoggedIn, async (req, res) => {
    const { oldpassword, password, password2 } = req.body;

    const user = await db.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
    const validPassword = await helpers.mathPassword(oldpassword, user[0].password);
    if (validPassword) {
        if (password == password2) {
            try {
				const newPassword = await helpers.encryptPassword(password);
                await db.query('UPDATE users SET password = ?  WHERE id = ?', [newPassword, req.user.id]);
                req.flash('success', 'Contraseña cambiada satisfactoriamente');
            } catch (e) {
                req.flash('error', 'La contraseña no se ha podido cambiar: ' + e);
            }
        } else {
            req.flash('error', 'Las contraseñas no coinciden.');
        }

    } else {
        req.flash('error', 'La contraseña actual no coincide');
    };
    res.redirect('/');

});

// Ruta para renderizar el formulario de login
router.get('/login', (req, res) => {

    res.render('auth/login');
});
// Ruta para obtener los datos del formulario y enviarselos a passport en el sistema 'local.signin'
router.post('/login', async (req, res, next) => {

    // El parámetro next es para que el método ejecute el siguiente y no se quede express bloqueado esperando un resultado.
    passport.authenticate('local.signin', {
        successRedirect: '/', // Si la autenticación es correcta redirecciona al index
        failureRedirect: '/auth/login' // En cambio, si falla la autenticación, redirecciona de nuevo al formulario de login
    })(req, res, next);

});

// Ruta para cerrar la sesión
router.get('/logout', isLoggedIn, (req, res) => {

    req.logOut();
    res.redirect('/auth/login');
});


module.exports = router;
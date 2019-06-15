const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const helpers = require('./helpers');
const db = require('../database');

// Passport es un módulo para poder autenticar usuarios, y passport-local para autenticar usuarios que estén registrados en nuestra propia base de datos.
// local.signin es en nombre que tendrá este sistema de autenticación. En este caso es para iniciar sesión
passport.use('local.signin', new LocalStrategy({
    usernameField: 'username', // Aquí se se le indica el nombre del campo donde vendrá el username.
    passwordField: 'password', // Aquí el nombre del campo donde vendrá la contraseña
    passReqToCallback: true, // Habilitamos que pase también los request de las peticiones
}, async (req, username, password, done) => {

    // Se comprueba si el usuario existe en la base de datos
    const rows = await db.query('SELECT * FROM users WHERE username = ?', [username]);

    if(rows.length > 0){ // Si hay mas de 0 filas significa que el usuario existe.
        const user = rows[0]; // Seleccionamos el primer campo. En la base de datos, al tener el campo de username como unique no debería de haber mas.
        const validPassword = await helpers.mathPassword(password, user.password); // Llamamos a la función mathPassword creada en el archivo helpers para comparar las contraseñas

        // Si las contraseñas coinciden se devuelve el user
        if(validPassword) {
            await db.query('UPDATE users SET last_connection = NOW() WHERE username = ?',  [username]);
            done(null, user); // Done es una función para indicar que ha terminado el método y pueda seguir con las siguientes funciones.
        } else { // En caso de que no coincidan, se devuelve un null (no es un error propio del código), un false ya que no hay usuario y un mensaje flash
            done(null, false, req.flash('error', 'Usuario o contraseña incorrecto'));
        }
    } else  { // En caso de que no haya ninguna columna significa que no existe el usuario, así que se le devuelve un null, false y un mensaje.
        return done(null, false, req.flash('error', 'Usuario o contraseña incorrecto'));
    }

}));


// Passport es un módulo para poder autenticar usuarios, y passport-local para autenticar usuarios que estén registrados en nuestra propia base de datos.
// Este apartado es para la creación de usuarios
// passport.use es para indicar el nombre que tendrá la "estrategia", en este caso local.signup que es para registro.
passport.use('local.signup', new LocalStrategy({ // Se le indica el nombre y que usará una nueva LocalStrategy o Estrategia Local (usamos passport-local)
    // Se le pasa un objeto con distintos campos.

    usernameField: 'username', // Aquí le indicamos a passport qué campo contendrá el nombre de usuario
    passwordField: 'password', // Aquí el campo que contendrá la contraseña
    passReqToCallback: true // Aquí le permitimos que nos pase el request al Callback de más adelante

}, async (req, username, password, done) => { // Este callback recibirá el request, username, password y un done que se explicará mas adelante.

    // Se comprueba si el usuario existe en la base de datos, ya que el campo de username es unique y no queremos que nos de un error la bd.
    const rows = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    // En el caso de que exista un usuario
    if(rows.length > 0){
        // Done es un callback para indicar que todo ha funcionado. Aquí se le pasan unos parámetros
        // null: le pasamos null porque no hay ningún error de código
        // false: aquí se le indica o un booleano o el elemento que se quiere enviar a las siguientes funciones. En este caso enviamos un false
        // Enviamos un mensaje Flash
        done(null,false,req.flash('error', 'Ya existe un usuario con ese username'));
    }
    const {role} = req.body; // Obtenemos el rol del usuario desde el body del request

    // Generamos un objeto llamado newUser que contendrá el username, password y el rol
    const newUser = {
        username,
        password,
        role
    };

    newUser.password = await helpers.encryptPassword(password); // Aquí llamamos a la función generada en helpers para cifrar la contraseña y la guardamos en newUser.password

    // Guardamos el usuario dentro de la base de datos
    const result = await db.query('INSERT INTO users SET ?', [newUser]);

    // Devolvemos done. No le indicamos el usuario creado porque si lo hacemos lo guardará en una sesión y por ahora no es necesario.
    return done(null, false, req.flash('success', 'Usuario añadido correctamente'));
}));

passport.use('local.install', new LocalStrategy({ 

    usernameField: 'username',
    passwordField: 'password', 
    passReqToCallback: true 

}, async (req, username, password, done) => { 

    const rows = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    if(rows.length > 0){
        done(null,false,req.flash('error', 'Ya existe un usuario con ese username'));
    };
    const {role} = req.body;
    const newUser = {
        username,
        password,
        role
    };

    newUser.password = await helpers.encryptPassword(password); 

    const result = await db.query('INSERT INTO users SET ?', [newUser]);
    newUser.id = result.insertId;

    return done(null, newUser, req.flash('success', 'Usuario añadido correctamente'));
}));


// El serializer es para guardar un usuario en una sesión cuando este se autentique.
passport.serializeUser((user, done) => {
    // Mando el ID del usuario para almacenarlo
    done(null, user.id);

});

// Deserializar un usuario es cerrarle de la sesión 
passport.deserializeUser(async (id, done) => {
    // Uso el ID almacenado en el serializer para cerrarle la sesión
    const filas = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    // Devolvemos el primer resultado de la consulta. (no debe de haber más de un usuario con la misma ID)
    done(null, filas[0]);
});

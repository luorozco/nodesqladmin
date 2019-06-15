const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const path = require('path');
const fs = require('fs');
const MySQLStore = require('express-mysql-session');
const passport = require('passport');

const { database } = require('./keys');

// Initializations

const app = express();
const { isLoggedIn, isMod, isAdmin } = require('./helpers/auth');
require('./helpers/passport');
// / Initializations routes
const indexRoute = require('./routes/index');
const processRoute = require('./routes/process');
const variableRoute = require('./routes/variables');
const loginRoute = require('./routes/authentication');
const logRoute = require('./routes/logs');

// Settings

app.set('port', process.env.PORT || 4000);

// / Aquí establecemos donde estarán las plantillas. path es un modulo de NodeJS que sirve para concatenar carpetas
// / con el formato del sistema operativo donde se ejecute.
// / Ej: path.join('c:','users','l-o-a') da como resultado C:\users\l-o-a en Windows
// / __dirname es una variable de nodejs donde se guarda la carpeta en la que reside el archivo donde se inicializa.
// / En este caso, __dirname tendrá el valor C:\Users\l-o-a\Documents\nodesql-app\nodesqladmin\src
// / Al concatenarlo con views le estamos indicando la ruta completa donde está views
app.set('views', path.join(__dirname, 'views'));

// / Aquí se establece un motor de plantillas llamado .hbs y le pasamos un objeto con distintas opciones:
app.engine('.hbs', exphbs({
    defaultLayout: 'main.hbs', // Le indicamos el archivo principal a partir del cual se cargarán todas las plantillas
    layoutsDir: path.join(app.get('views'), 'layouts'), // Aquí se guardarán las plantillas
    partialsDir: path.join(app.get('views'), 'partials'), // Aquí se guardarán las plantillas reutilizables tales como navbars
    extname: '.hbs',// Extensión de los archivos
}));
app.set('view engine', '.hbs'); // Aquí le indicamos a express que use de motor de plantillas el que hemos creado mas arriba

// Middlewares

// / express-session es un módulo para express que sirve para gestionar sesiones de forma simple
app.use(session({
    secret: '4L!#EYxz9i8I37FF8wQWtL2IRl0V14e95J4MwmMH*fJ@nGJ0Jh',// secret es una clave única para firmar las ID de las cookies de sesión
    resave: true, // Sirve para guardar las sesiones a pesar de que no se modifique durante la solicitud
    saveUninitialized: true, // Fuerza que se guarde una sesión no inicializada. Una sesión no está inicializada cuando es nueva
    store: new MySQLStore(database), // Guarda las sesiones en la propia base de datos en vez de el cliente. Le pasamos los datos de conexión desde keys.js
}));

// / Este middleware de express convierte los datos recibidos mediante un formulario en formato JSON para trabajarlos más
// / fácilmente. El parámetro extended es para indicarle que no vamos a recibir datos pesados como archivos.
app.use(express.urlencoded({ extended: false }));
app.use(express.json())
// / Connect-Flash es un conjunto de métodos para poder enviar mensajes entre las plantillas
app.use(flash());

// / Passport es un conjunto de funciones para poder autenticar y manejar sesiones de los usuarios
app.use(passport.initialize());
app.use(passport.session());

// / methodOverride nos permitirá usar métodos mas avanzados en los formularios (como PUT, DELETE...)
app.use(methodOverride('_method')); // Le especificamos que _method será el parametro que usaremos en los formularios.

// Global Variables

// / Declaramos las variables de flash para que se pueda usar en cualquier parte de la aplicación
app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    app.locals.error = req.flash('error');
    app.locals.user = req.user;
    next();
})

// Static files
// / Usando la función static de express le pasamos como parámetro la ruta donde está la carpeta public, que es donde estarán los archivos estáticos.
app.use(express.static(path.join(__dirname, 'public')));

// Routes
if (fs.existsSync(path.join(__dirname, 'routes', 'install.js'))) {
    app.use('/install', require('./routes/install'));
};
app.use('/auth', loginRoute); // Ruta sin restricciones
app.use('/', isLoggedIn, indexRoute); // Para acceder a esta ruta es necesario que el usuario esté autenticado
app.use('/processlist', isLoggedIn, processRoute); // Igual para esta ruta, ya que cualquier usuario creado debe acceder a la lista de procesos
app.use('/variables', [isLoggedIn, isMod], variableRoute); // En cambio, para esta ruta aparte de estar autenticado es necesario que el usuario sea moderador
app.use('/logs', [isLoggedIn, isAdmin], logRoute); // La ruta de los logs está protegida y solo se permite a Administradores



// Server listening

app.listen(app.get('port'), () => {
    console.log('Server listen in port ', app.get('port'));
});
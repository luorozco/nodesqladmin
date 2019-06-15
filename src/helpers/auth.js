// Archivo para comprobar la autenticación para acceder a ciertas partes de la app

module.exports = {
    // Esta función comprueba si el usuario está autenticado
    isLoggedIn(req,res,next) {
        // En caso de que lo sea, dejará pasar al usuario
        if(req.isAuthenticated()) {
            return next();
        };
        // En caso contrario redireccionará a la página de login
        return res.redirect('/auth/login');
    },
    // Esta función comprueba si el usuario es administrador o superadministrador
    // Se pone superadmin también ya que si un administrador puede pasar, un superadmin también
    isMod(req,res,next) {
        // Igual que en la función anterior, comprueba el rol del usuario y si se cumple, deja acceder al usuario
        if(req.user.role == 'MODERADOR' || req.user.role == 'ADMINISTRADOR'){
            return next();
        }
        // En caso contrario, se envía un mensaje flash al usuario y lo redirecciona a index
        req.flash('error', 'No tienes acceso a esta sección');
        return res.redirect('/');

    },
    // Esta función comprueba si el usuario es superadministrador
    isAdmin(req,res,next) {
        if(req.user.role=='ADMINISTRADOR'){
            return next();
        };
        req.flash('error', 'No tienes acceso a esta sección');
        return res.redirect('/');
    },
};
const bcrypt = require('bcryptjs');
const helpers = {};

helpers.encryptPassword = async (password) => { // Función para cifrar la contraseña

    const salt = await bcrypt.genSalt(10); // Iniciamos el algoritmo x veces y generamos un salt o hash
    const hash = await bcrypt.hash(password, salt); // Hash de la contraseña en texto plano.
    return hash;
};

helpers.mathPassword = async (password, savedPassword) => { // Función para comprar la contraseña introducida con la guardada en la base de datos
    try {
        return await bcrypt.compare(password, savedPassword);
    } catch(e) {
        console.log(e);
    };

};


module.exports = helpers;
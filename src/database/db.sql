CREATE TABLE IF NOT EXISTS users (
    id INTEGER AUTO_INCREMENT NOT NULL,
    username VARCHAR(15) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    role enum('ADMINISTRADOR', 'MODERADOR', 'BASICO') DEFAULT('BASICO'),
    last_connection timestamp,
    CONSTRAINT pk_users PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS logs (
    id INTEGER AUTO_INCREMENT NOT NULL,
    user INTEGER NOT NULL,
    date TIMESTAMP NOT NULL DEFAULT current_timestamp,
    description VARCHAR(100),
    name_variable VARCHAR(50),
    old_value VARCHAR(250),
    new_value VARCHAR(250),
    -- Estas dos columnas es para, en el futuro, poder revertir los cambios realizados
    modified BOOLEAN DEFAULT false,
    modificable BOOLEAN DEFAULT true,
    CONSTRAINT pk_logs PRIMARY KEY (id),
    CONSTRAINT fk_user_logs FOREIGN KEY (user) REFERENCES users(id)
);
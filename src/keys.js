module.exports = {

    database: {
        host: process.env.HOSTDB || '',
        user: process.env.USERDB ||'',
        password: process.env.PASSDB || '',
        database: process.env.DBNAME || '',
    }
    
};

const { Router } = require('express');
const router = Router();
const path = require('path');
const mysql_import = require('mysql-import');
const { database } = require('../keys');
const fs = require('fs');

const passport = require('passport');
const db = require('../database');


router.get('/', async (req,res) => {
    try{
        await db.query('SELECT * FROM users');
    }catch(e){
        const importer = mysql_import.config(database);
        await importer.import(path.join(__dirname,'..','database','db.sql'));
        res.redirect('/install/2');
    }
    
});

router.get('/2', (req,res) => {

    res.render('install/install2');
});

 router.post('/2', passport.authenticate('local.install', {
    successRedirect: '/install/3',
})); 

router.get('/3', (req,res) => {
    fs.unlink(path.join(__dirname,'install.js'), (err) => {
        if(err) throw err;
        res.redirect('/');
    });
});

module.exports = router;
/*import {Router} from 'express';
import express from 'express';
import { createPool } from "mysql2/promise";
import {DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT} from '../config.js';
import serviceAccount from '../../todo3d-7bc79-firebase-adminsdk-1hg06-38844ded31.json' with { type: "json" };
import multer from 'multer';
import {initializeApp} from 'firebase/app';
import {getDownloadURL, getStorage, ref} from 'firebase/storage';

import admin from 'firebase-admin';*/

const {Router} = require('express');
const express = require('express');
const { createPool } = require("mysql2/promise");
const {DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT} = require('../config.js');
const serviceAccount = require('../../todo3d-7bc79-firebase-adminsdk-1hg06-38844ded31.json');
const multer = require('multer');
const {initializeApp} = require('firebase/app');
const {getDownloadURL, getStorage, ref} = require('firebase/storage');

const admin = require('firebase-admin');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'gs://todo3d-7bc79.appspot.com'
});

initializeApp({
    apiKey: "AIzaSyDQWTi6OPkszU8pk49o6rpusn3DbhXV5lc",
    authDomain: "todo3d-7bc79.firebaseapp.com",
    projectId: "todo3d-7bc79",
    storageBucket: "todo3d-7bc79.appspot.com",
    messagingSenderId: "1065073633118",
    appId: "1:1065073633118:web:73c6a9ff637399136911cf"
});

const storage = getStorage();

const bucket = admin.storage().bucket();

const upload = multer();

const router= Router();

router.use(express.json());

const config = {
    user: DB_USER,
    password: DB_PASSWORD,
    host: DB_HOST,
    port: DB_PORT,
    database: DB_NAME
};

const pool = createPool(config);

router.get('/', (req, res) =>{
    res.render('index');
});

router.post('/confirmarUsuario', async (req, res) =>{
    const usuario = req.body.usuario;
    const contraseñaSupuesta = req.body.contraseña;
    let constraseñaReal;
    let miRecordset;
    await sql.connect(config1);
    const myQuery = `SELECT contraseña FROM Users WHERE nombre = '${usuario}'`;
    try{
        miRecordset=(await sql.query(myQuery)).recordset;
        constraseñaReal = miRecordset[0].contraseña;
    
        if(constraseñaReal === contraseñaSupuesta){
            res.json({status: 1});
        }else{res.json({status: 0});}
    }catch(e){
        console.log(e);
        res.json({status: 0});
    }
    
});

router.get('/crud', async (req, res) => {
    const myQuery = `SELECT * FROM Productos`;
    let [miRecordset]=await pool.query(myQuery);
    res.render('crud', {miRecordset: miRecordset});
});

async function subirImagen(imagen, nombreArchivo){
    try {
        await bucket.file(nombreArchivo).save(imagen);
        console.log('Imagen subida correctamente a Firebase Storage');
    } catch (error) {
      console.error('Error al subir la imagen a Firebase Storage:', error);
    }
}

async function obtenerURL(nombreArchivo){
    try {
        const imagenStorageRef = ref(storage, nombreArchivo);
        return await getDownloadURL(imagenStorageRef);
    }catch (error) {
        console.error('Error al eliminar la imagen de Firebase Storage:', error);
        return;
    }
}

router.post('/agregarProducto', upload.single('imagen'), async (req, res) => {
    
    const nombre = req.body.nombre;
    const categoria = req.body.categoria;
    const precio = req.body.precio;
    const imagen = req.file.buffer;

    const myQuery1 = `SELECT id FROM Productos WHERE nombreProducto = '${nombre}'`;
    const [resultado1] = await pool.query(myQuery1);
    if(resultado1.length === 0){
        res.json({status:1});
        const myQuery2 = `INSERT Productos (nombreProducto, categoria, precio) values ('${nombre}', '${categoria}', ${precio})`;
        await pool.query(myQuery2);
        const [resultado2] = await pool.query(myQuery1);
        const id = resultado2[0].id;
        await subirImagen(imagen, `${id}.jpg`);
        /*const refImagen = bucket.file(`${id}.jpg`)
        refImagen.getSignedUrl({action: 'read', expires: '03-09-2025'}).then((url) => {console.log(url[0])});*/
        const urlImagen = await obtenerURL(`${id}.jpg`);
        const myQuery3 = `UPDATE Productos SET imagenURL = '${urlImagen}' where id = ${id}`;
        await pool.query(myQuery3);
    }else{
        res.json({status:0});
    }
});

router.post('/editarProducto', upload.single('imagen') /*el upload sirve para que la información del archivo no se pierda*/, async (req, res) => {
    
    const id = req.body.id;
    const nombre = req.body.nombre;
    const categoria = req.body.categoria;
    const precio = req.body.precio;
    const imagen = req.file;

    if(imagen === undefined){
        const myQuery1 = `SELECT nombreProducto FROM Productos WHERE id <> ${id} and nombreProducto = '${nombre}'`;
        const [resultado1] = await pool.query(myQuery1);
        if(resultado1.length === 0){
            const myQuery2 = `UPDATE Productos set nombreProducto = '${nombre}', categoria = '${categoria}', precio = '${precio}' WHERE id = ${id}`;
            await pool.query(myQuery2);
            res.json({status: 1});
        }else{
            res.json({status: 0});
        }
    }else{
        const myQuery1 = `SELECT nombreProducto FROM Productos WHERE id <> ${id} and nombreProducto = '${nombre}'`;
        const [resultado1] = await pool.query(myQuery1);
        if(resultado1.length === 0){
            subirImagen(imagen.buffer, `${id}.jpg`);
            const URL = await obtenerURL(`${id}.jpg`);
            const myQuery2 = `UPDATE Productos set nombreProducto = '${nombre}', categoria = '${categoria}', precio = '${precio}', imagenURL = '${URL}' WHERE id = ${id}`;
            await pool.query(myQuery2);

            res.json({status: 1});
        }else{
            res.json({status: 0});
        }
    }
});

//export default router;
//export default express.Router;

module.exports = router;
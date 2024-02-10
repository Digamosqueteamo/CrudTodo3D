import {Router} from 'express';
import express from 'express';
import sql from 'mssql';
import { DB_HOST1, DB_USER1, DB_PASSWORD1, DB_NAME1, DB_HOST2, DB_USER2, DB_PASSWORD2, DB_NAME2} from '../config.js';
import serviceAccount from '../../todo3d-7bc79-firebase-adminsdk-1hg06-38844ded31.json' with { type: "json" };
import multer from 'multer';
import {initializeApp} from 'firebase/app';
import {getDownloadURL, getStorage, ref} from 'firebase/storage';

import admin from 'firebase-admin';
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

const config1 = {
    user: DB_USER1,
    password: DB_PASSWORD1,
    server: DB_HOST1,
    database: DB_NAME1,
    options: {
      encrypt: false, 
    },
};

const config2 = {
    user: DB_USER2,
    password: DB_PASSWORD2,
    server: DB_HOST2,
    database: DB_NAME2,
    options: {
      encrypt: false, 
    },
};

const pool = await sql.connect(config2);

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

        console.log(constraseñaReal);
        console.log(contraseñaSupuesta);
        console.log(usuario);
    
        if(constraseñaReal === contraseñaSupuesta){
            res.json({status: 1});
        }else{res.json({status: 0});}
    }catch(e){
        console.log(e);
        res.json({status: 0});
    }
    
});

router.get('/crud', async (req, res) => {
    await sql.connect(config2);
    const myQuery = `SELECT * FROM Productos`;
    let miRecordset=(await sql.query(myQuery)).recordset;
    res.render('crud', {miRecordset: miRecordset});
});

/*async function cargarImagen(imagen){
    //let fileBuffer = await sharp(imagen.buffer).resize({width:400, height:400, fit: 'cover'}).toBuffer();
    const fileRef = ref(storage, `files/${imagen.originalname} ${Date.now()}`);
    const fileMetadata ={
        contentType: imagen.mimetype
    };
    const fileUploadPromise = uploadBytesResumable(
        fileRef, imagen.buffer, fileMetadata
    );

    await fileUploadPromise;

    const fileDownloadURL = await getDownloadURL(fileRef);

    return {ref: fileRef, downloadURL: fileDownloadURL}
}

function subirImagen(imagen){
    const mountainsRef = ref(storage, 'mountains.jpg');
    uploadBytes(mountainsRef, imagen).then((snapshot) => {
        console.log('Uploaded a blob or file!');
    });
}*/

function blobToBuffer(blob) {
    return new Promise((resolve, reject) => {
      const chunks = [];
      blob.on('data', chunk => chunks.push(chunk));
      blob.on('end', () => resolve(Buffer.concat(chunks)));
      blob.on('error', error => reject(error));
    });
}

async function subirImagen(imagen,nombreArchivo){
    try {
        await bucket.file(nombreArchivo).save(imagen);
        console.log('Imagen subida correctamente a Firebase Storage');
      /*fs.readFile('src/public/pene.jpg', async (err, data) => {
        console.log(data);
        await bucket.file(nombreArchivo).save(data);
        console.log('Imagen subida correctamente a Firebase Storage');
        });*/
    } catch (error) {
      console.error('Error al subir la imagen a Firebase Storage:', error);
    }
}

router.post('/agregarProducto', upload.single('imagen'), async (req, res) => {
    
    const nombre = req.body.nombre;
    const categoria = req.body.categoria;
    const precio = req.body.precio;
    const imagen = req.file.buffer;

    const myQuery1 = `SELECT id FROM Productos WHERE nombreProducto = '${nombre}'`;
    const resultado1 = await pool.request().query(myQuery1);
    if(resultado1.recordset.length === 0){
        res.json({status:1});
        const myQuery2 = `INSERT Productos (nombreProducto, categoria, precio) values ('${nombre}', '${categoria}', ${precio})`;
        pool.request().query(myQuery2);
        const resultado2 = await pool.request().query(myQuery1);
        const id = resultado2.recordset[0].id;
        await subirImagen(imagen, `${id}.jpg`);
        /*const refImagen = bucket.file(`${id}.jpg`)
        refImagen.getSignedUrl({action: 'read', expires: '03-09-2025'}).then((url) => {console.log(url[0])});*/
        const imagenStorageRef = ref(storage, `${id}.jpg`);
        const urlImagen = await getDownloadURL(imagenStorageRef);
        const myQuery3 = `UPDATE Productos SET imagenURL = '${urlImagen}' where id = ${id}`;
        await pool.request().query(myQuery3);
        const myQuery4 = `SELECT imagenURL FROM Productos where id = ${id}`;
        console.log(pool.request().query(myQuery4));
    }else{
        res.json({status:0});
    }
});

export default router;
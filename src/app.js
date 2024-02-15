/*import express from 'express';
import {dirname, join} from 'path';
import {fileURLToPath} from 'url';
import misRutas from './routes/index.js';
import {PORT} from './config.js';*/

const express = require('express');
const {dirname, join} = require('path');
const {fileURLToPath} = require('url');
const misRutas = require('./routes/index.js');
const {PORT} = require('./config.js');

//const __dirnamePuta = dirname(fileURLToPath(import.meta.url));

const app = express();

app.set('view engine', 'ejs');
app.set('views', join(__dirname,'views'));
app.use(misRutas);

app.use(express.static(join(__dirname,'public')));

app.listen(PORT, () => console.log('El servidor te está escuchando en el puerto: ' + PORT));
import express from 'express'
import mongoose from 'mongoose'
const app = express()

import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static('public'));

mongoose.connect('mongodb+srv://dawid-md:admin@cluster0.tcxhaad.mongodb.net/sample_analytics')
const db = mongoose.connection
db.useDb('results')
db.on('error', (error) => console.log(error))
db.once('open', () => console.log('connected to database'))
app.use(express.json())

import {router} from './routes/routes.js'
app.use(router)     //(routes, router)
app.set('view engine', 'hbs')
//app.set('views', (__dirname + '/public'));

app.listen(3000, () => console.log('..................'))
import express from 'express'
const router = express.Router()
import {scoreShema} from '../models/schemas.js'

//get all
router.get('/', (req, res) => {
    try{
        res.render('index.hbs')
    } catch(err){
        res.status(500).json({message: err.message})
    }
})

router.get('/results', async (req, res) => {
    try{
        let results = await scoreShema.find()
        res.render('board.hbs', { userData: JSON.stringify(results) })
    } catch(err){
        res.status(500).json({message: err.message})
    }
})

router.post('/add', async (req, res) => {
    let newNumber = new digitSchema({
        value: req.body.value
    })
    try {
        let number = await newNumber.save()
        res.status(201).json(number)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

export {router}
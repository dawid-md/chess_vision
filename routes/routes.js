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
        //res.render('board.hbs', { userData: JSON.stringify(results) })
        res.send(JSON.stringify(results))
    } catch(err){
        res.status(500).json({message: err.message})
    }
})

router.post('/add', async (req, res) => {
    let newScore = new scoreShema({
        name: req.body.name,
        score: req.body.score,
        date: req.body.date,
        timer: req.body.timer
    })
    try {
        let score = await newScore.save()
        res.status(201).json(score)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

export {router}
import mongoose from 'mongoose'

const scoreSh = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    timer: {
        type: Number,
        required: true
    }
})

export const scoreShema = mongoose.model('results', scoreSh)        //pierwszy parametr to nazwa kolekcji
// require('dotenv').config({path : './env'})
import dotenv from 'dotenv'
import mongoose from "mongoose";
import connectDB from "./db/index.js";

dotenv.config({
    path: './env'
})


connectDB()














/*
const express = require('express')
const app = express()


;(async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}` ) // URL = URI + DBNAME
        app.on('error' , () => {
            console.log('ERROR: ', error);
            throw error
        })
        
        app.listen(process.env.PORT, () => {
            console.log('app is listening on port: ' , process.env.PORT);
        })
    } catch (error) {
        console.error(error);
        throw error
    }
})()

*/
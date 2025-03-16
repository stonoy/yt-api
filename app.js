const express = require('express')
require("express-async-errors")
require("dotenv").config()
const cors = require("cors")
const connectDB = require('./config')
const errorMiddleware = require('./middlewares/errorMiddleware')
const createError = require('./errorClass')
const Log = require('./models/log')
const path = require("path")

const app = express()

app.use(express.static(path.resolve(__dirname, "./client/dist"))); // PROVIDING FRONTEND APP

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use(express.json())

app.post("/api/v1/addlogs", async (req, res) => {
    const {action} = req.body

    const newLog = new Log({
        action
    })

    await newLog.save()

    res.status(201).json({msg : "log saved"})
})

app.get("/api/v1/error", (req,res) => {
    createError("error tesing", 200)
})

app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "./client/dist", "index.html")); // SERVER GIVEING FRONTEND APP TO USERS
  });

app.use("*", (req, res) => {
    res.status(404).json({msg: "no such route found!"})
})

app.use(errorMiddleware)

const port = process.env.PORT || 80

connectDB(process.env.DB_URI)
    .then(() => {
        app.listen(port, () => {
            console.log(`server is listening on port ${port}`)
        })
    })
    .catch((err) => {
        console.log(`error in connecting to server -> ${err}`)
    })
// importing
import express from "express";
import mongoose from "mongoose";
import Messages from './dbMessages.js';
// app config 

const app = express();
const port = process.env.PORT || 9000;

// middleware

// DB config 

const conection_url = "mongodb+srv://admin:9GZa9db9IVY9GtnW@cluster0.e32k9.mongodb.net/whatsappdb?retryWrites=true&w=majority"

mongoose.connect(conection_url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})

// ?????

// api routes
app.get('/', (req, res) => res.status(200).send('hello world'));

app.post('/messages/new', (req, res) => {
    const dbMessage = req.body;

    Messages.create(dbMessage, (err, data) => {
        if (err) {
            res.status(500).send(err);
        } else {
            // res.status(201).send(`new message created: \n ${data}`)
            res.status(201).send(data);

        }
    })
})

// listen 

app.listen(port, () => console.log(`listening on localhost:${port}`));


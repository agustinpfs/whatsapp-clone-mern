// importing
import express from "express";
import mongoose from "mongoose";
import Messages from './dbMessages.js';
import Pusher from 'pusher';
import cors from 'cors';
// app config 

const app = express();
const port = process.env.PORT || 9000;

const pusher = new Pusher({
    appId: "1098035",
    key: "e6cd545a673436242ea3",
    secret: "2c6be84f312f7dcd33e0",
    cluster: "us2",
    useTLS: true
  });

// middleware
app.use(express.json());
app.use(cors());

// use cors instead:
// app.use((req,res,next) => {
//     res.setHeader("Acces-Control-Allow-Origin", "*");
//     res.setHeader("Acces-Control-Allow-Headers", "*");
//     next();
// });

// DB config 

const conection_url = "mongodb+srv://admin:9GZa9db9IVY9GtnW@cluster0.e32k9.mongodb.net/whatsappdb?retryWrites=true&w=majority"

mongoose.connect(conection_url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.once("open", () => {
    console.log("BD connected");

    const msgCollection = db.collection("messagecontents");
    const changeStream = msgCollection.watch();
    
    changeStream.on('change', (change) => {
        console.log('a change ocurred',change);

        if (change.operationType === 'insert') {
            const messageDetails = change.fullDocument;
            pusher.trigger('message', 'inserted', {
                name: messageDetails.user,
                message: messageDetails.message,
                timestamp: messageDetails.timestamp,
            }
            );
        } else {
            console.log("error triggering Pusher")
        }
    });
});






// ?????

// api routes
app.get('/', (req, res) => res.status(200).send('hello world'));

app.get('/messages/sync', (req, res) => {
    Messages.find((err, data) => {
        if (err) {
            res.status(500).send(err);
        } else {
            // res.status(201).send(`new message created: \n ${data}`)
            res.status(200).send(data);
        }
    })
})

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


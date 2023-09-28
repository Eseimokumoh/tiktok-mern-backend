import express from 'express';
import mongoose from 'mongoose';
import Data from './data.js';
import Videos from './dbModel.js';


// app config
const app = express();
const port = process.env.PORT || 9000;

// middlewares
app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});


// DB config
const connection_url = 'mongodb+srv://admin:dSlAxbqTNwnDpR6y@cluster0.ohzb0wa.mongodb.net/tiktok?retryWrites=true&w=majority';

mongoose.connect(connection_url);

// api endpoints
app.get('/', (req, res) => res.status(200).send('hello world'));

app.get('/v1/posts', (req, res) => res.status(200).send(Data));

app.get('/v2/posts', async (req, res) => {
  try {
    const data = await Videos.find({});
    
    // Set the Content-Type header to "application/json"
    res.setHeader('Content-Type', 'application/json');

    if (data.length === 0) {
      res.status(404).send({ message: 'No videos found' });
    } else {
      res.status(200).send(data);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});


app.post('/v2/posts', async (req, res) => {
    // POST request is to ADD DATA to the database
    // It will let us ADD a video DOCUMENT to the videos COLLECTION
    const dbVideos = req.body;

    try {
        const createdVideo = await Videos.create(dbVideos);
        res.status(201).send(createdVideo);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

// listen
app.listen(port, () => console.log(`listening on localhost: ${port}`));

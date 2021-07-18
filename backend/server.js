const express = require('express');
//const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

const uri = process.env.ATLAS_URI;
//const { MongoClient } = require('mongodb');
//const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
      // Connect the client to the server
      // await client.connect();
      
      // // Establish and verify connection
      // await client.db("test").command({ ping: 1 });
      mongoose 
      .connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,   })   
      .then(() => console.log("Database connected!"))
      .catch(err => console.log(err));

    } finally {
      // Ensures that the client will close when you finish/error
      //await client.close();
    }
  }
  run().catch(console.dir);


const exercisesRouter = require('./routes/exercises');
const userRouter = require('./routes/users');

app.use('/exercises',exercisesRouter);
app.use('/users',userRouter);


app.listen(port,()=>{
    console.log(`Server is running on port : ${port}`);
});
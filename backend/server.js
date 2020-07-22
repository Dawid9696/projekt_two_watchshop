const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const redis = require('redis')

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname + '/public'));

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { 
  useNewUrlParser: true,
  useUnifiedTopology: true, 
  useCreateIndex: true, 
  dbName:"Swiss" }
);

const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully !");
})

const swissRouter = require('./routes/swiss');

app.use('/Swiss', swissRouter);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}...`);
});
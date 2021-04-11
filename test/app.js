const { imgbb } = require('../dist/index');
const express = require('express');
const path = require('path');
const app = express();
const { config } = require('dotenv');
config(); // dotenv is recommended to store the API Key.

const port = 3001;

app.use(express.json({ limit: '32mb' }));
app.set('IMGBB_API_KEY', process.env.API_KEY);

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'index.html'))
});

app.post('/upload', imgbb, (req, res) => {
    res.json(req['iResponses']);
});

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});

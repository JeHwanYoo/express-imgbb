const { imgbb } = require('../dist/index');
const express = require('express');
const path = require('path');
const app = express();

const port = 3001;

app.use(express.json({ limit: '32mb' }));

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'index.html'))
});

app.post('/upload', imgbb, (req, res) => {
    res.json(req['iResponse']);
});

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});

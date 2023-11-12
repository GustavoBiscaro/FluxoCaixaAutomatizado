const express = require('express');
const routes = require('./routes');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());
app.use(routes);

app.get('/', (req, res) => {
    res.send('Hello, world');
});

app.listen(3000, () => {
    console.log('Listening on http://localhost:3000')
})
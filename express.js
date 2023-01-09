const express = require('express');
const app = express();
const COMPANIES = require('./companies');
const PORT = 3000;

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index', {companies : COMPANIES});
});

app.use('/static', express.static('public'));

app.listen(PORT, ()=>{
    console.log(`Server is now running on http://localhost:${PORT}`)
});
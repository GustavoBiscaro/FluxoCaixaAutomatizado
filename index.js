const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser')

const port = 3000;
var path = require('path');
const app = express();

app.use(session({secret: 'abcdefghijklmn@'}));
app.use(bodyParser.urlencoded({extended:true}));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, '/views'));

app.post('/',(req, res)=>{
    console.log(req.body.login)
    res.render('login')
})

app.get('/', (req, res)=> {
    res.render('login');
})

app.listen(port,()=> {
    console.log('servidor rodando');
})
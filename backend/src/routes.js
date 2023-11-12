const express = require('express');

const routes = express.Router();
const users = [{
    id: 1,
    name: 'admin',
    email: 'admin@example.com',
    senha: '123456'
}]

routes.post('/login', (req, res) => {
    const { email, senha } = req.body;
    const user = users.find(user => user.email === email && user.senha === senha);
    if(user)
    {
       return res.status(200).json(user);
    }

    return res.status(401).json({message:'Credenciais inválidas!'});
});

module.exports = routes;
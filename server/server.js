const express = require('express')
const path = require('path')
const app = express()
const porta = 3000

// Para entender formulários enviados
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,'..')))

// Entregar login.html quando acessar /login
app.get('/login',(req,res)=>{
    res.sendFile(path.join(__dirname,'..','login.html'))
})

// Rota principal que entrega o index.html
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname, '..', 'index.html'))
})

// acessa a tela de cadastro de usuário
app.get('/cadastro',(req,res)=>{
    res.sendFile(path.join(__dirname, '..', 'cadastro_usuario.html'))
})

// Quando o formulário de login for enviado

app.post('/inicio',(req,res)=>{
    console.log(req.body)
    res.sendFile(path.join(__dirname,'..','index.html'))
})

app.listen(porta,()=>{
    console.log(`Servidor aberto na porta ${porta}`)
})
const express = require('express')
const app = express()
const path = require('path')
const porta = 3000

// volta uma pasta para o express ter acesso as paginas HTML 
app.use(express.static(path.join(__dirname,'..')))


app.get('/login',(req,res)=>{
    res.sendFile(path.join(__dirname,'..','login.html'))
})

//entende a pagina HTML recebida "extended: true" = recebe objetos complexos
app.use(express.json())
app.use(express.urlencoded({extended:true}))


// redireciona a pagina para o index, após fazer o login
app.post('/',(req,res)=>{
    console.log(req.body)
    res.sendFile(path.join(__dirname,'..','index.html'))
})

// porta em que o express escuta
app.listen(porta,()=>{
    console.log(`Servidor aberto na porta ${porta}`)
})
const express = require('express')
const app = express()
const porta = 3000

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.post('/inicio',(req,res)=>{
    res.send('<h1>Sucesso!</h1>')
    console.log(req.body)
})

app.listen(porta,()=>{
    console.log(`Servidor aberto na porta ${porta}`)
})
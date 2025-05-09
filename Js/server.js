const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const db = require('./db')

const app = express()
const porta = 3000

// volta uma pasta para o express ter acesso as paginas HTML 
app.use(express.static(path.join(__dirname,'..')))

app.get('/:pagina',(req,res)=>{
    // coleta a o parametro da URL, definindo qual tela irá abrir
    const pagina = req.params.pagina
    res.sendFile(path.join(__dirname,'..',`${pagina}.html`))
})

//entende a pagina HTML recebida "extended: true" = recebe objetos complexos
app.use(express.json())
app.use(express.urlencoded({extended:true}))

// redireciona a pagina para o index, após fazer o login
app.post('/listagem',(req,res)=>{
    console.log(req.body)
    res.sendFile(path.join(__dirname,'..','listagem.html'))
})

// Cadastra os itens no banco de dados
app.post('/enviar',(req, res)=>{
    // desestrutura os dados enviados ao servidor
    const { nome, codigo,  quantidade, unidade, preco_custo, preco_venda, fornecedor, descricao} = req.body
    const sql = 'INSERT into ITENS_CADASTRADOS (  CD_ITEM, TIPO_ITEM, MODELO_ITEM, QUANTIDADE_ITEM, PRECO_ITEM_UN, NOME_FORNECEDOR, DATA_AQUISICAO) VALUES (?, ?, ?, ?, ?, ?, ?)'
    db.query(sql,[nome, codigo, quantidade, unidade, preco_custo, preco_venda, fornecedor, descricao], (err,result)=>{
        if (err){
            console.error('Erro ao inserir no banco', err)
            res.status(500).send('Erro ao salvar dados')
        }else{
            res.send('Dados salvos com sucesso')
        }
    })
})

// porta em que o express escuta
app.listen(porta,()=>{
    console.log(`Servidor aberto na porta ${porta}`)
})
const express = require('express')
const path = require('path')
const db = require('./db')
const bcrypt = require('bcrypt')
const fs = require('fs')

const app = express()
const porta = 3000

const estoqueRoutes = require('./estoqueRoutes')

// Middleware para formularios e JSON
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Servir arquivos estáticos (CSS, JS, imagens, etc.)
app.use(express.static(path.join(__dirname,'..'))) // Serve a raiz do projeto

// Rota POST de login
app.post('/listagem', (req, res) => {
    const { email, senha } = req.body

    db.query(
        'SELECT * FROM USUARIOS WHERE EMAIL_USER = ?',
        [email],
        async (err, result) => {
            if (err) {
                console.error('Erro ao buscar usuário:', err)
                return res.status(500).send('Erro no servidor')
            }

            if (result.length === 0) {
                return res.status(401).send('Usuário e/ou senha inválidos')
            }

            const usuario = result[0]

            try {
                const senhaCorreta = await bcrypt.compare(senha, usuario.SENHA_USER)

                if (!senhaCorreta) {
                    return res.status(401).send('Usuário e/ou senha inválidos')
                }

                // Redireciona para a rota personalizada com o nome do usuário
                res.redirect(`/listagem/${usuario.NOME_USER}`)
            } catch (erroBcrypt) {
                console.error('Erro ao comparar senha:', erroBcrypt)
                res.status(500).send('Erro ao verificar senha')
            }
        }
    )
})

// Rota para exibir listagem.html com o nome na URL
app.get('/listagem/:nome', (req, res) => {
    res.sendFile(path.join(__dirname, '..','listagem.html'))
})

// Rota genérica para outros arquivos .html
app.get('/:pagina', (req, res) => {
    const pagina = req.params.pagina
    const caminho = path.join(__dirname, '..',`${pagina}.html`)

    if (fs.existsSync(caminho)) {
        res.sendFile(caminho)
    } else {
        res.status(404).send('Página não encontrada')
    }
})

// Cadastro de item
app.post('/enviar', (req, res) => {
    const { codigo, tipo, modelo, fornecedor, quantidade, preco_venda, nf, dataAquisicao } = req.body

    const sql = 'INSERT INTO estoque (ID_ITEM, TIPO_ITEM, MODELO_ITEM, FORNECEDOR, QUANTIDADE_ITEM, PRECO_ITEM, NOTA_FISCAL, AQUISICAO_ITEM) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'

    db.query(sql, [codigo, tipo, modelo, fornecedor, quantidade, preco_venda, nf, dataAquisicao], (err) => {
        if (err) {
            console.error('Erro ao inserir no banco', err)
            return res.status(500).send('Erro ao salvar dados')
        }

        res.send('Dados salvos com sucesso')
    })
})

// Cadastro de novo usuário
app.post('/cadastrarUsuario', async (req, res) => {
    const { nome, sobrenome, telefone, email, senha } = req.body
    try {
        const hash = await bcrypt.hash(senha, 10)
        const sql = 'INSERT INTO usuarios (NOME_USER, SOBRENOME_USER, TELEFONE_USER, EMAIL_USER, SENHA_USER) VALUES (?, ?, ?, ?, ?)'

        db.query(sql, [nome, sobrenome, telefone, email, hash], (err) => {
            if (err) {
                console.error('Erro ao cadastrar usuário:', err)
                return res.status(500).send('Erro ao cadastrar usuário')
            }

            console.log(`Usuário ${nome} cadastrado com sucesso`)
            res.redirect('/login')
        })
    } catch (err) {
        console.error('Erro ao gerar hash da senha', err)
        res.status(500).send('Erro ao processar senha')
    }
})

// Rotas da API (estoque)
app.use('/api', estoqueRoutes)

app.listen(porta, () => {
    console.log(`Servidor aberto na porta ${porta}`)
})

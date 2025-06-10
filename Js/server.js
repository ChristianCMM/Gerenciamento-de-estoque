const express = require('express')
const path = require('path')
const db = require('./db')
const bcrypt = require('bcrypt')
const fs = require('fs')
const alterarNome = require('./alterar_nome_user')

const app = express()
const porta = 3000

// Middleware para formularios e JSON
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


// Rota da API (estoque)
const estoqueRoutes = require('../Js/estoqueRoutes')
app.use('/api/estoque', estoqueRoutes)

// Servir arquivos estáticos (CSS, JS, imagens, etc.)
app.use(express.static(path.join(__dirname,'..'))) // Serve a raiz do projeto

// Rota POST de login
app.post(`/index`, (req, res) => {
    const { email, senha } = req.body

    db.query(
        `SELECT * FROM USUARIOS WHERE EMAIL_USER = ?`,
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
                res.redirect(`/index`)
            } catch (erroBcrypt) {
                console.error('Erro ao comparar senha:', erroBcrypt)
                res.status(500).send('Erro ao verificar senha')
            }
        }
    )
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

app.listen(porta, () => {
    console.log(`Servidor aberto na porta ${porta}`)
})

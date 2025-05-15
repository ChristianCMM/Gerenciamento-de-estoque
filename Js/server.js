const express = require('express')
const path = require('path')
const db = require('./db')
const bcrypt = require('bcrypt')

const estoqueRoutes = require('./estoqueRoutes');

const app = express()
const porta = 3000

// volta uma pasta para o express ter acesso as paginas HTML 
app.use(express.static(path.join(__dirname,'../')))

// rota que mostra as paginas com base nos parametros inseridos na URL
app.get(
    '/:pagina',
    (req,res)=>{
    // coleta a o parametro da URL, definindo qual tela irá abrir
    const pagina = req.params.pagina
    res.sendFile(path.join(__dirname,'../public',`${pagina}.html`))
})

// rota que consulta o banco de dados "estoque"
app.get('/api/estoque',(req,res)=>{
    db.query(
        'SELECT ID_ITEM, TIPO_ITEM, MODELO_ITEM, FORNECEDOR, QUANTIDADE_ITEM, PRECO_ITEM, NOTA_FISCAL, DATE(AQUISICAO_ITEM) AS AQUISICAO_ITEM FROM estoque', 
        (err, results) => {
        if (err){
            console.error('Erro ao consultar o banco',err)
            return res.status(500).json({error: 'Erro no banco de dados'})
        }else{
            //função que formata a data e hora para não retornar o horario
            const dadosFromatados = results.map(item=>({
                ...item,
                AQUISICAO_ITEM: item.AQUISICAO_ITEM.toISOString().split('T')[0]
            }))
            return res.json(dadosFromatados)
        }
    })
})


//entende a pagina HTML recebida "extended: true" = recebe objetos complexos
app.use(express.json())
app.use(express.urlencoded({extended:true}))

// redireciona a pagina para o index, após fazer o login
app.post('/listagem', (req, res) => {
  const { email, senha } = req.body;

  // Busca o usuário apenas pelo email
  db.query(
    'SELECT * FROM USUARIOS WHERE EMAIL_USER = ?',
    [email],
    async (err, result) => {
        if (err) {
            console.error('Erro ao buscar usuário:', err);
            return res.status(500).send('Erro no servidor');
        }

        if (result.length === 0) {
            return res.status(401).send('Usuário e/ou senha inválidos');
        }

        const usuario = result[0];

        try {
            const senhaCorreta = await bcrypt.compare(senha, usuario.SENHA_USER);

            if (!senhaCorreta) {
                return res.status(401).send('Usuário e/ou senha inválidos');

            }

            // Senha correta → redireciona
            res.redirect(`/listagem/${usuario.NOME_USER}`);
        } catch (erroBcrypt) {
            console.error('Erro ao comparar senha:', erroBcrypt);
            res.status(500).send('Erro ao verificar senha');
        }
    }
  );
});

// Cadastra os itens no banco de dados
app.post(
    '/enviar',
    (req, res)=>{
    const {codigo, tipo, modelo, fornecedor, quantidade, preco_venda,  nf, dataAquisicao} = req.body // desestrutura os dados dos itens enviados ao servidor
    const sql = 'INSERT into estoque (ID_ITEM, TIPO_ITEM, MODELO_ITEM, FORNECEDOR, QUANTIDADE_ITEM, PRECO_ITEM, NOTA_FISCAL, AQUISICAO_ITEM) VALUES (?, ?, ?, ?, ?, ?, ?, ?);'
    console.log(req.body)// mostra o item cadastrado no console
    // insere o produto no db
    db.query(sql,[codigo, tipo, modelo, fornecedor, quantidade, preco_venda,  nf, dataAquisicao], (err,result)=>{
        if (err){
            console.error('Erro ao inserir no banco', err)
            console.log('Erro ao salvar dados')
        }else{
            res.send('Dados salvos com sucesso')
        }
    })
})

//cadastrar usuário no db
app.post(
    '/cadastrarUsuario', 
    async (req,res)=>{
    const {nome,sobrenome,telefone,email,senha} = req.body
    try{
        const hash = await bcrypt.hash(senha,10)
        const sql = 'INSERT into usuarios(NOME_USER,SOBRENOME_USER,TELEFONE_USER,EMAIL_USER,SENHA_USER) VALUES (?, ?, ?, ?, ?)'
        db.query(sql,[nome,sobrenome,telefone,email,hash],(err,result)=>{
            if(err){
                console.error('Erro ao cadastrar usuário:', err)
                res.status(500).send('Erro ao cadastrar usuário')
                setTimeout(res.redirect('/cadastrarUsuario'),5000)
            }else{
                res.redirect('/login')
                console.log(`Usuário ${nome} cadastrado com sucesso`)
            }
        })
    }catch(err){
        console.error('Erro ao gerar hash da senha', err)
        res.status(500).send('Erro ao processar senha')
    }
    
})

module.exports = express

app.use('/api',estoqueRoutes)

// porta em que o express escuta
app.listen(porta,()=>{
    console.log(`Servidor aberto na porta ${porta}`)
})
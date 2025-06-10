const express = require('express')
const db = require('./db')
const router = express.Router()

// Retorna todos os itens do estoque
router.get('/', (req, res) => {
    db.query(
        'SELECT ID_ITEM, TIPO_ITEM, MODELO_ITEM, FORNECEDOR, QUANTIDADE_ITEM, PRECO_ITEM, NOTA_FISCAL, DATE(AQUISICAO_ITEM) AS AQUISICAO_ITEM FROM estoque',
        (err, results) => {
            if (err) {
                console.error('Erro ao consultar o banco', err)
                return res.status(500).json({ error: 'Erro no banco de dados' })
            }

            const dadosFormatados = results.map(item => ({
                ...item,
                AQUISICAO_ITEM: new Date(item.AQUISICAO_ITEM).toISOString().split('T')[0]
            }))

            res.json(dadosFormatados)
        }
    )
})

// Atualiza item do estoque
router.patch('/:id', (req, res) => {
    const { id } = req.params
    const { tipo, modelo, fornecedor, quantidade, preco, nota_fiscal, aquisicao } = req.body

    const query = `
        UPDATE ESTOQUE SET
        TIPO_ITEM = ?,
        MODELO_ITEM = ?,
        FORNECEDOR = ?,
        QUANTIDADE_ITEM = ?,
        PRECO_ITEM = ?,
        NOTA_FISCAL = ?,
        AQUISICAO_ITEM = ?
        WHERE ID_ITEM = ?
    `

    db.query(query, [tipo, modelo, fornecedor, quantidade, preco, nota_fiscal, aquisicao, id], (err) => {
        if (err) {
            return res.status(500).send('Erro ao atualizar item')
        }

        res.send('Item atualizado com sucesso')
    })
})

// recebe a solicitação de cadastro de item
router.post('/enviar', (req, res) => {
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
// recebe a solicitação de exclusão de item
router.delete('/:id',(req,res)=>{
    const id = req.params.id

    const query = `
    DELETE FROM ESTOQUE WHERE ID_ITEM = ?
    `
    
    db.query(
        query,
        [id],
        (err,result)=>{
        if(err){
            console.error('Erro ao excluir item: ',err)
            return res.status(500).send('Erro ao excluir item')
        }
        res.send('Item excuido com sucesso!')
    })
})

module.exports = router

const express = require('express')
const db = require('./db')
const router = express.Router()

// Retorna todos os itens do estoque
router.get('/estoque', (req, res) => {
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
router.patch('/estoque/:id', (req, res) => {
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

module.exports = router

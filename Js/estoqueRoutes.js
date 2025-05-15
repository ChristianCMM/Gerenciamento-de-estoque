const express = require('express')
const db = require('./db')
const router = express.Router()

// atualiza item do estoque
router.patch('/estoque/:id',(req,res)=>{
    const {id} = req.params
    const {tipo,modelo,fornecedor,quantidade,preco,nota_fiscal,aquisicao} = req.body

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

    db.query(query,[tipo,modelo,fornecedor,quantidade,preco,nota_fiscal,aquisicao,id],(err)=>{
        if (err){
            return res.status(500).send('Erro ao atualizar item')
        }
        res.send('Item atualizado com sucesso')
    })
})

module.exports = router
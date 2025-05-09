// Este código faz a conexão com o banco de dados

const mysql = require('mysql2')

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Polybidajuno1@',
    database: 'MEUBANCO'
})

db.connect((err)=>{
    if(err){
        console.error('Erro ao conectar com o banco',err)
    }else{
        console.log('Conectado ao MySQL com sucesso!')
    }
})

module.exports = db
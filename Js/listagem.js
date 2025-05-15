//lista os componentes que estão dentro do db
document.addEventListener('DOMContentLoaded',()=>{
    fetch('/api/estoque')
    .then((response=>response.json()))
    .then(data=>{
        const tbody = document.querySelector('#tabelaComponentes tbody')
        // cria linhas com as informações vindas do db
        data.forEach(componente =>{
            const row = document.createElement('tr')
            row.innerHTML = 
            `
            <td>${componente.ID_ITEM}</td>
            <td>${componente.TIPO_ITEM}</td>
            <td>${componente.MODELO_ITEM}</td>
            <td>${componente.FORNECEDOR}</td>
            <td>${componente.QUANTIDADE_ITEM}</td>
            <td>${componente.PRECO_ITEM}</td>
            <td>${componente.NOTA_FISCAL}</td>
            <td>${componente.AQUISICAO_ITEM}</td>
            `
            tbody.appendChild(row)
        })
        
    })
    .catch(err=>console.error('Erro ao carregar dados', err))
})
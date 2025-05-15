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
            <td><button onclick='carregarFormulario(${JSON.stringify(componente)})'>Editar</button></td>
            `
            tbody.appendChild(row)
        })
        
    })
    .catch(err=>console.error('Erro ao carregar dados', err))
})
// copia os dados do item para a parte de edição
function carregarFormulario(componente){
    document.querySelector('#editCodigo').value = componente.ID_ITEM
    document.querySelector('#editTipo').value = componente.TIPO_ITEM
    document.querySelector('#editModelo').value = componente.MODELO_ITEM
    document.querySelector('#editFornecedor').value = componente.FORNECEDOR
    document.querySelector('#editQuantidade').value = componente.QUANTIDADE_ITEM
    document.querySelector('#editPreco').value = componente.PRECO_ITEM
    document.querySelector('#editNf').value = componente.NOTA_FISCAL
    document.querySelector('#editDate').value = componente.AQUISICAO_ITEM.split('T')[0] // formata para vir só a data
}

document.querySelector('#editForm').addEventListener('submit',e=>{
    e.preventDefault()

    const id = document.querySelector('#editCodigo').value

    const dadosAtualizados = {
        codigo: document.querySelector('#editCodigo').value,
        tipo: document.querySelector('#editTipo').value,
        modelo: document.querySelector('#editModelo').value,
        fornecedor: document.querySelector('#editFornecedor').value,
        quantidade: document.querySelector('#editQuantidade').value,
        preco: document.querySelector('#editPreco').value,
        nota_fiscal: document.querySelector('#editNf').value,
        aquisicao: document.querySelector('#editDate').value,
    }
    
    fetch(`/api/estoque/${id}`,{
        method:'PATCH',
        headers:{
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(dadosAtualizados)
    })
    .then(res=>res.text())
    .then(msg=>{
        alert(msg)
        location.reload()// recarrega a lista
    })
    .catch(err=>console.error('Erro ao editar item: ',err))

})
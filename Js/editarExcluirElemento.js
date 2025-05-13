// Funções JavaScript para editar e excluir (serão implementadas posteriormente)
function editarComponente(id) {
    alert(`Editar componente com ID: ${id}`)
    // Aqui você redirecionaria para uma tela de edição com os dados do componente
}

function excluirComponente(id) {
    if (confirm(`Tem certeza que deseja excluir o componente com ID: ${id}?`)) {
        alert(`Componente com ID: ${id} excluído.`)
        // Aqui você faria a lógica para remover o componente
    }
}
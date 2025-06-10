var girar = false
function girarBotao(){
    const seta = document.getElementById('user_nome_arrow')
    const configuracoes = document.getElementById('configuracoes_user-opcoes')
    const nomeUser = document.getElementById('painel_user-nome-user')

    if(girar==false){
        seta.style.transform = 'rotate(180deg)'
        configuracoes.style.display = 'block'
        nomeUser.style.height = '50%'
    }else {
        seta.style.transform = 'rotate(0deg)'
        configuracoes.style.display = 'none'
        nomeUser.style.height = '100%'
    }
    girar = !girar
}
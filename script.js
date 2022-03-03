const KEY_BD = '@listaRegistros'


var listaRegistros = {
    ultimoIdGerado:0,
    usuarios:[]
}


var FILTRO = ''



function gravarBD(){
    localStorage.setItem(KEY_BD, JSON.stringify(listaRegistros) )
}

function lerBD(){
    const data = localStorage.getItem(KEY_BD)
    if(data){
        listaRegistros = JSON.parse(data)
    }
    desenhar()
}


function pesquisar(value){
    FILTRO = value;
    desenhar()
}


function desenhar(){
    const tbody = document.getElementById('listaRegistrosBody')
    if(tbody){
        var data = listaRegistros.usuarios;
        if(FILTRO.trim()){
            const expReg = eval(`/${FILTRO.trim().replace(/[^\d\w]+/g,'.*')}/i`)
            data = data.filter( usuario => {
                return expReg.test( usuario.data ) || expReg.test( usuario.modelo )
            } )
        }
        data = data
            .sort( (a, b) => {
                return a.modelo < b.modelo ? -1 : 1
            })
            .map( usuario => {
                return `<tr>
                        <td>${usuario.id}</td>
                        <td>${usuario.data}</td>
                        <td>${usuario.modelo}</td>
                        <td>${usuario.cor}</td>
                        <td>${usuario.placa}</td>

                        <td>
                            <button onclick='vizualizar("cadastro",false,${usuario.id})'>Editar</button>
                            <button class='vermelho' onclick='perguntarSeDeleta(${usuario.id})'>Deletar</button>
                        </td>
                    </tr>`
            } )
        tbody.innerHTML = data.join('')
    }
}

function insertUsuario(data, modelo, cor, placa){
    const id = listaRegistros.ultimoIdGerado + 1;
    listaRegistros.ultimoIdGerado = id;
    listaRegistros.usuarios.push({
        id, data , modelo, cor, placa
    })
    gravarBD()
    desenhar()
    vizualizar('lista')
}

function editUsuario(id, data, modelo, cor, placa, ){
    var usuario = listaRegistros.usuarios.find( usuario => usuario.id == id )
    usuario.data = data;
    usuario.modelo = modelo;
    usuario.cor = cor;
    usuario.placa = placa;
    gravarBD()
    desenhar()
    vizualizar('lista')
}

function deleteUsuario(id){
    listaRegistros.usuarios = listaRegistros.usuarios.filter( usuario => {
        return usuario.id != id
    } )
    gravarBD()
    desenhar()
}

function perguntarSeDeleta(id){
    if(confirm('Quer deletar o registro de id '+id)){
        deleteUsuario(id)
    }
}


function limparEdicao(){
    document.getElementById('data').value = ''
    document.getElementById('modelo').value = ''
    document.getElementById('cor').value = ''
    document.getElementById('placa').value = ''

}

function vizualizar(pagina, novo=false, id=null){
    document.body.setAttribute('page',pagina)
    if(pagina === 'cadastro'){
        if(novo) limparEdicao()
        if(id){
            const usuario = listaRegistros.usuarios.find( usuario => usuario.id == id )
            if(usuario){
                document.getElementById('id').value = usuario.id
                document.getElementById('data').value = usuario.data
                document.getElementById('modelo').value = usuario.modelo
                document.getElementById('cor').value = usuario.cor
                document.getElementById('placa').value = usuario.placa

            }
        }
        document.getElementById('data').focus()
    }
}



function submeter(e){
    e.preventDefault()
    const data = {
        id: document.getElementById('id').value,
        data: document.getElementById('data').value,
        modelo: document.getElementById('modelo').value,
        cor: document.getElementById('cor').value,
        placa: document.getElementById('placa').value,


    }
    if(data.id){
        editUsuario(data.id, data.data, data.modelo, data.cor, data.placa)
    }else{
        insertUsuario( data.data, data.modelo, data.cor, data.placa )
    }
}


window.addEventListener('load', () => {
    lerBD()
    document.getElementById('cadastroRegistro').addEventListener('submit', submeter)
    document.getElementById('inputPesquisa').addEventListener('keyup', e => {
        pesquisar(e.target.value)
    })

})
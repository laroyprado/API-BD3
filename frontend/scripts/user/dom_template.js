import { criarNovoUsuario, obterListaDeFuncionarios, atualizarUsuario } from './api_consumer.js';

// Função para salvar um usuário no Local Storage
function salvarUsuarioNoLocalStorage(usuario) {
    // Obtém a lista de usuários já existente no Local Storage (se houver)
    const usuariosArmazenados = JSON.parse(localStorage.getItem("usuarios")) || [];

    // Adiciona o novo usuário à lista
    usuariosArmazenados.push(usuario);

    // Salva a lista atualizada de usuários de volta no Local Storage
    localStorage.setItem("usuarios", JSON.stringify(usuariosArmazenados));
}

function adicionarUsuarioALista(usuario) {
    const listaUsuarios = $(".users");
    const novoUsuario = $("<li>");
    novoUsuario.attr("id", usuario.matricula);
    novoUsuario.addClass("user");
    
    novoUsuario.html(`
        <p class="${usuario.status_usuario === 'ativo' ? 'active' : 'disabled'}">
            ${usuario.status_usuario === 'ativo' ? 'Ativo' : 'Inativo'}
        </p>
        <p>${usuario.nome}</p>
        <p>${usuario.matricula}</p>
        <p>${usuario.funcao}</p>
        <div class="switch-align checkbox-size">
            <input type="checkbox" class="checkbox" id="user-${usuario.matricula}-isEnabled"
                ${usuario.status_usuario === 'ativo' ? 'checked' : ''}>
            <label class="switch" for="user-${usuario.matricula}-isEnabled">
                <span class="slider"></span>
            </label>
        </div>
        <a href="#" id="edit-user-${usuario.matricula}" class="edit-align"><img class="edit-icon" src="../assets/transparent-icons/edit.svg" alt="" srcset="" /></a>
    `);

    // Adiciona o novo usuário à lista de usuários
    listaUsuarios.append(novoUsuario);
    salvarUsuarioNoLocalStorage(usuario);
}

// Adicione um evento de clique ao botão "Confirmar" na modal de adicionar usuário
$("#modal-addUser .btn-confirm").click(function () {
    const nomeInput = $("#modal-addUser input[placeholder='Nome']");
    const matriculaInput = $("#modal-addUser input[placeholder='Matrícula']");
    const funcaoInput = $("#modal-addUser input[placeholder='Função']");

    if (nomeInput.val() === '' || matriculaInput.val() === '' || funcaoInput.val() === '') {
        Alert.warning('Todos os campos são obrigatórios.', 'Preencha todos os campos', { displayDuration: 3000 });
    } else {
        const novoUsuario = {
            nome: nomeInput.val(),
            matricula: matriculaInput.val(),
            funcao: funcaoInput.val(),
            senha: "padrao",
            status_usuario: "ativo"
        };

        criarNovoUsuario(novoUsuario)
            .then( (response) => {
                adicionarUsuarioALista(novoUsuario)
                Alert.success("Novo usuário criado com sucesso...", "Sucesso!", { displayDuration: 5000 });

                // Limpe os campos de entrada
                nomeInput.val('');
                matriculaInput.val('');
                funcaoInput.val('');

                // Feche o modal de adicionar usuário simulando um clique no botão "Cancelar"
                $("#modal-addUser .btn-cancel").click();
            })
            .catch(function (error) {
                // Lida com o erro
                Alert.error(`Erro ao criar o usuário\nDetalhes: ${error}`, "Erro...", { displayDuration: 10000});
                console.error("Erro ao criar o usuário:", error);
            });
    }
});

$(document).on("click", ".edit-align, .edit-icon", function() {
    var editButton = $(this).closest(".edit-align");
    console.log(editButton);

    // Preencha os campos do modal com os dados do usuário
    var matricula = editButton.attr("id").split("-")[2];
    console.log(matricula);

    // Acesse o Local Storage para obter os dados do usuário com base na matrícula
    var usuariosArmazenados = JSON.parse(localStorage.getItem("usuarios")) || [];

    // Encontre o usuário com a matrícula correspondente
    var usuarioParaEditar = usuariosArmazenados.find(function(usuario) {
        return usuario.matricula === matricula;
    });

    // Preencha os campos do modal com os dados do usuário
    if (usuarioParaEditar) {
        $("#modal-editUser input[placeholder='Nome']").val(usuarioParaEditar.nome);
        $("#modal-editUser input[placeholder='Matrícula']").val(usuarioParaEditar.matricula);
        $("#modal-editUser input[placeholder='Matrícula']").prop("disabled", true);
        $("#modal-editUser input[placeholder='Função']").val(usuarioParaEditar.funcao);

        // Abra o modal de edição
        var modalEditUser = document.getElementById("modal-editUser");
        if (modalEditUser) {
            modalEditUser.style.display = "block";
        }
    }
});

// Adicione um evento de clique ao botão "Confirmar" no modal de edição de usuário
$("#modal-editUser .btn-confirm").click(function () {
    const matriculaInput = $("#modal-editUser input[placeholder='Matrícula']");
    const nomeInput = $("#modal-editUser input[placeholder='Nome']");
    const funcaoInput = $("#modal-editUser input[placeholder='Função']");

    // Obtém a matrícula do usuário a partir do campo de entrada (caso você precise dela)
    const matricula = matriculaInput.val();

    // Obtém os novos valores de nome e função do campo de entrada
    const novoNome = nomeInput.val();
    const novaFuncao = funcaoInput.val();

    // Crie um objeto com os dados atualizados
    const dadosAtualizados = {
        nome: novoNome,
        funcao: novaFuncao
    };

    // Chama a função atualizarUsuario para atualizar o usuário
    atualizarUsuario(matricula, dadosAtualizados)
        .then(function (response) {
            console.log(`Usuário com matrícula ${matricula} atualizado com sucesso.`);
            Alert.success(`Usuário com matrícula ${matricula} atualizado com sucesso.`, "Sucesso!", { displayDuration: 5000 });

            // Feche o modal de edição após a conclusão da atualização
            $("#modal-editUser").css("display", "none");
        })
        .catch(function (error) {
            console.error(`Erro ao atualizar o usuário com matrícula ${matricula}:`, error);
            Alert.error(`Erro ao atualizar o usuário com matrícula ${matricula}, detalhes: ${error}`, "Erro!", { displayDuration: 5000 });
        });
});

$(document).on('click', 'input[type="checkbox"].checkbox', function () {
    const isChecked = $(this).prop('checked');
    console.log(`Checkbox marcado: ${isChecked}`);
    
    const checkboxId = $(this).attr("id");
    const matricula = checkboxId.replace("user-", "").replace("-isEnabled", "");
    console.log("Matrícula do usuário clicado:", matricula);

    // Determinar o status do usuário com base no estado da checkbox
    const statusUsuario = isChecked ? 'ativo' : 'inativo';

    // Criar um objeto com os dados atualizados
    const dadosAtualizados = {
        status_usuario: statusUsuario
    };

    // Chamar a função atualizarUsuario para atualizar o usuário
    atualizarUsuario(matricula, dadosAtualizados)
        .then(function (response) {
            console.log(`Usuário com matrícula ${matricula} atualizado com sucesso.\n\nNovo status: ${statusUsuario}`);
            Alert.success(`Usuário com matrícula ${matricula} atualizado com sucesso.\n\nNovo status: ${statusUsuario}`, "Sucesso!", { displayDuration: 5000 });
        })
        .catch(function (error) {
            console.error(`Erro ao atualizar o usuário com matrícula ${matricula}:`, error);
            Alert.error(`Erro ao atualizar o usuário com matrícula ${matricula}, detalhes: ${error}`, "Erro!", { displayDuration: 5000 });
        });
});

// Função para carregar a lista de funcionários ao carregar a página
$(document).ready(function() {
    obterListaDeFuncionarios()
        .then(function (funcionarios) {
            // Iterar sobre a lista de funcionários e adicionar cada um à lista de usuários
            funcionarios.forEach(function (funcionario) {
                adicionarUsuarioALista(funcionario);
            });
        })
        .catch(function (error) {
            // Lida com o erro ao carregar a lista de funcionários
            console.error("Erro ao carregar a lista de funcionários:", error);
        });
});
const tipoHoraInput = document.getElementById("selecionarTipoHora");
const selecionarEmpresaInput = document.getElementById("selecionarEmpresa");
const justificativaHoraInput = document.getElementById("justificativaHora");
const dataInicioInput = document.getElementById("dataInicio");
const horaInicioInput = document.getElementById("horaInicio");
const projetoHoraInput = document.getElementById("projetoHora");
const dataFimInput = document.getElementById("dataFim");
const horaFimInput = document.getElementById("horaFim");
const solicitanteHoraInput = document.getElementById("solicitanteHora");
const selecionarCRInput = document.getElementById("selecionarCr")
const botaoConfirmar = document.getElementById("adicionarBotao");







const obterTodosClientes = async () => {
    try {
        const response = await fetch('http://localhost:8080/clients');

        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro na requisição:', error);
        throw error;
    }
};

const todosClientes = await obterTodosClientes()



const obterTodosCr = async () => {
    try {
        const response = await fetch('http://localhost:8080/cr');

        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro na requisição:', error);
        throw error;
    }
};

const todosCr = await obterTodosCr()






function popularSelectEmpresas(clientes) {
    const selectEmpresa = document.getElementById("selecionarEmpresa");


    selectEmpresa.innerHTML = "";


    clientes.forEach((cliente) => {
        const option = document.createElement("option");
        option.value = cliente.cnpj;
        option.textContent = cliente.razao_social;
        selectEmpresa.appendChild(option);
    });
}



function popularSelectCr(centroDeResultado) {
    const selectCr = document.getElementById("selecionarCr");


    selectCr.innerHTML = "";


    centroDeResultado.forEach((cr) => {
        const option = document.createElement("option");
        option.value = cr.codigoCr;
        option.textContent = cr.nome;
        selectCr.appendChild(option);
    });
}



popularSelectEmpresas(todosClientes)
popularSelectCr(todosCr);





function lancamentoHora() {
    const tipoHora = tipoHoraInput.value;
    const selecionarEmpresa = selecionarEmpresaInput.value;
    const selecionarCR = selecionarCRInput.value
    const justificativaHora = justificativaHoraInput.value;
    const dataInicio = dataInicioInput.value;
    const horaInicio = horaInicioInput.value;
    const projetoHora = projetoHoraInput.value;
    const dataFim = dataFimInput.value;
    const horaFim = horaFimInput.value;
    const solicitanteHora = solicitanteHoraInput.value;

    const dataHora = {
        codcr: selecionarCR,
        lancador: "4533",
        cnpj: selecionarEmpresa,
        data_hora_inicio: `${dataInicio}T${horaInicio}:00Z`,
        data_hora_fim: `${dataFim}T${horaFim}:00Z`,
        tipo: tipoHora,
        justificativa: justificativaHora,
        projeto: projetoHora,
        solicitante: solicitanteHora,
    };

    console.log(dataHora);
    return dataHora;
}

async function lancamentoHoraExtra(dadosParaEnviar) {

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosParaEnviar),
    };

    try {

        const response = await fetch('http://localhost:8080/hora', requestOptions);

        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }

        console.log("enviou");

        const data = await response.json();
        console.log('Resposta da API:', data);
    } catch (error) {
        alert("Houve erro adicionar");
        console.error('Erro na requisição:', error);
    }
}

const listarHoras = async () => {
    try {
        const response = await fetch('http://localhost:8080/hora');
        if (!response.ok) {
            throw new Error('Não foi possível obter os dados.');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
};



const horasCadastradas = await listarHoras()



async function carregarHorasNaLista(horas) {
    const listaHoras = document.getElementById("listaHoras");
    console.log("vou resetar o ul")

    listaHoras.innerHTML = "";


    horas.forEach((hora) => {

        const razaoSocial = todosClientes.find(item => hora.cnpj === item.cnpj)?.razao_social || null;
        const centroResultado = todosCr.find(item => hora.codcr === item.codigoCr)?.nome || null;






        const li = document.createElement("li");
        const tipoHora = document.createElement("p");
        const statusHora = document.createElement("p");
        const inicioHora = document.createElement("p");
        const fimHora = document.createElement("p");
        const crHora = document.createElement("p");
        const clienteHora = document.createElement("p");
        const projetoHora = document.createElement("p");
        const justificativaHora = document.createElement("p");

        tipoHora.textContent = hora.tipo;
        statusHora.textContent = "Pendente";


        const dataHoraInicio = new Date(hora.data_hora_inicio);
        const dataInicioFormatada = dataHoraInicio.toLocaleDateString('pt-BR');
        const horaInicioFormatada = dataHoraInicio.toLocaleTimeString('pt-BR');
        inicioHora.textContent = `${dataInicioFormatada} | ${horaInicioFormatada}`;


        const dataHoraFim = new Date(hora.data_hora_fim);
        const dataFimFormatada = dataHoraFim.toLocaleDateString('pt-BR');
        const horaFimFormatada = dataHoraFim.toLocaleTimeString('pt-BR');
        fimHora.textContent = `${dataFimFormatada} | ${horaFimFormatada}`;

        crHora.textContent = centroResultado
        clienteHora.textContent = razaoSocial
        projetoHora.textContent = hora.projeto;
        justificativaHora.textContent = hora.justificativa;

        li.classList.add("horaLancada");

        li.append(tipoHora, statusHora, inicioHora, fimHora, crHora, clienteHora, projetoHora, justificativaHora);
        listaHoras.appendChild(li);
    });
}



await carregarHorasNaLista(horasCadastradas);

botaoConfirmar.addEventListener("click", async (event) => {
    event.preventDefault()


    if (
        tipoHoraInput.value === "" ||
        selecionarEmpresaInput.value === "" ||
        selecionarCRInput.value === "" ||
        justificativaHoraInput.value === "" ||
        dataInicioInput.value === "" ||
        horaInicioInput.value === "" ||
        projetoHoraInput.value === "" ||
        dataFimInput.value === "" ||
        horaFimInput.value === "" ||
        solicitanteHoraInput.value === ""
    ) {
        alert("Preencha todos os campos obrigatórios!");
        return; 
    }


    const dataHora = lancamentoHora();
    await lancamentoHoraExtra(dataHora);

    const novasHoras = await listarHoras();
    carregarHorasNaLista(novasHoras);
});

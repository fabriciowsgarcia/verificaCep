// 1. Seleciona os elementos do HTML
const cepInput = document.querySelector("#cep-input");
const buscarBtn = document.querySelector("#buscar-btn");
const resultadoDiv = document.querySelector("#resultado");

// 2. Adiciona o evento de clique ao botão
buscarBtn.addEventListener("click", async () => {
    const cep = cepInput.value.trim();

    // Validação simples: verifica se o CEP tem 8 dígitos e é composto apenas por números.
    if (!cep || cep.length !== 8 || !/^\d+$/.test(cep)) {
        resultadoDiv.innerHTML = "<p>⚠️ Por favor, digite um CEP válido com 8 números.</p>";
        return;
    }

    // Monta a URL da API. Note que não há chave de API!
    const apiURL = `https://viacep.com.br/ws/${cep}/json/`;

    buscarBtn.disabled = true;
    resultadoDiv.innerHTML = "<p>Buscando...</p>";

    try {
        // Faz a chamada para a API ViaCEP
        const response = await fetch(apiURL);
        const data = await response.json();

        // A API ViaCEP retorna um objeto com a propriedade "erro" se o CEP não for encontrado.
        if (data.erro) {
            resultadoDiv.innerHTML = "<p>❌ CEP não encontrado. Verifique o número e tente novamente.</p>";
        } else {
            // Se o CEP for encontrado, formata e exibe o endereço.
            const enderecoFormatado = `
                <strong>Logradouro:</strong> ${data.logradouro || 'Não disponível'}<br>
                <strong>Bairro:</strong> ${data.bairro || 'Não disponível'}<br>
                <strong>Cidade:</strong> ${data.localidade || 'Não disponível'}<br>
                <strong>Estado:</strong> ${data.uf || 'Não disponível'}<br>
                <strong>IBGE:</strong> ${data.ibge || 'Não disponível'}
            `;
            resultadoDiv.innerHTML = enderecoFormatado;
        }

    } catch (error) {
        // Trata erros de rede (ex: sem internet)
        console.error("Erro:", error);
        resultadoDiv.innerHTML = "<p>❌ Não foi possível realizar a busca. Verifique sua conexão com a internet.</p>";
    } finally {
        // Reabilita o botão, independentemente do resultado
        buscarBtn.disabled = false;
    }
});

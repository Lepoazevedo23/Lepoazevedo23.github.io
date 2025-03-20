let carrinho = [];

// Mostrar o carrinho
function mostrarCarrinho() {
    document.getElementById("carrinhoModal").style.display = "flex";
    atualizarCarrinho();
}

// Fechar o carrinho
function fecharCarrinho() {
    document.getElementById("carrinhoModal").style.display = "none";
}

// Adicionar produto ao carrinho
function adicionarCarrinho(id, nome, preco, imagem) {
    let item = carrinho.find(produto => produto.id === id);

    if (item) {
        item.quantidade += 1;
    } else {
        carrinho.push({ id, nome, preco, quantidade: 1, imagem });
    }

    atualizarCarrinho();
}

// Atualizar o carrinho
function atualizarCarrinho() {
    let listaCarrinho = document.getElementById("carrinho-list");
    let total = 0;
    listaCarrinho.innerHTML = "";

    carrinho.forEach(produto => {
        total += produto.preco * produto.quantidade;

        let li = document.createElement("li");
        li.innerHTML = `
            <img src="${produto.imagem}" width="50">
            ${produto.nome} - R$ ${produto.preco.toFixed(2)} x ${produto.quantidade}
            <button class="remover-item" onclick="removerItem(${produto.id})">Remover</button>
        `;
        listaCarrinho.appendChild(li);
    });

    document.getElementById("total").innerText = `Total: R$ ${total.toFixed(2)}`;
    document.getElementById("quantidade-carrinho").innerText = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
}

// Remover item do carrinho
function removerItem(id) {
    carrinho = carrinho.filter(produto => produto.id !== id);
    atualizarCarrinho();
}

// Exibir informações de pagamento PIX
function exibirPIX() {
    document.getElementById("pix-info").style.display = "block";
    document.getElementById("cartao-info").style.display = "none";
}

// Exibir informações de pagamento Cartão
function exibirCartao() {
    document.getElementById("pix-info").style.display = "none";
    document.getElementById("cartao-info").style.display = "block";
}

// Copiar chave PIX
function copiarPIX() {
    let pixInput = document.getElementById("pix-chave");
    pixInput.select();
    document.execCommand("copy");
    alert("Chave PIX copiada!");
}

// Formatar número do cartão (0000 0000 0000 0000)
function formatarCartao(input) {
    let valor = input.value.replace(/\D/g, "").slice(0, 16);
    valor = valor.replace(/(\d{4})(?=\d)/g, "$1 ");
    input.value = valor;
}

// Formatar data de validade (MM/AA)
function formatarValidade(input) {
    let valor = input.value.replace(/\D/g, "").slice(0, 4);
    if (valor.length > 2) {
        valor = valor.replace(/(\d{2})(\d{2})/, "$1/$2");
    }
    input.value = valor;
}

// Função para formatar o CEP (12345-678)
function formatarCEP(input) {
    let valor = input.value.replace(/\D/g, "").slice(0, 8);
    if (valor.length > 5) {
        valor = valor.replace(/(\d{5})(\d{3})/, "$1-$2");
    }
    input.value = valor;
}

// Finalizar compra (captura todos os dados, incluindo endereço)
function finalizarCompra() {
    let endereco = {
        rua: document.getElementById("rua").value.trim(),
        numero: document.getElementById("numero").value.trim(),
        bairro: document.getElementById("bairro").value.trim(),
        cidade: document.getElementById("cidade").value.trim(),
        estado: document.getElementById("estado").value.trim(),
        cep: document.getElementById("cep").value.trim()
    };
    
    let metodoPagamento = document.querySelector('input[name="pagamento"]:checked')?.value;
    let numCartao = document.getElementById("num-cartao").value.trim();
    let validadeCartao = document.getElementById("validade-cartao").value.trim();
    let cvv = document.getElementById("cvv").value.trim();

    // Validação básica
    if (!endereco.rua || !endereco.numero || !endereco.bairro || !endereco.cidade || !endereco.estado || !endereco.cep) {
        alert("Por favor, preencha todos os dados de endereço.");
        return;
    }
    
    if (!metodoPagamento) {
        alert("Por favor, selecione um método de pagamento.");
        return;
    }
    
    if (metodoPagamento === "cartao" && (!numCartao || !validadeCartao || !cvv)) {
        alert("Por favor, preencha todos os dados do cartão.");
        return;
    }

    // Capturar os dados do pedido
    let dadosCompra = {
        endereco,
        metodoPagamento,
        produtos: carrinho
    };

    if (metodoPagamento === "cartao") {
        dadosCompra.cartao = {
            numCartao,
            validadeCartao,
            cvv
        };
    }

    console.log("Dados da compra:", dadosCompra);
    alert("Compra finalizada com sucesso!\n\n" + JSON.stringify(dadosCompra, null, 2));

    // Limpar carrinho após finalizar compra
    carrinho = [];
    atualizarCarrinho();
    fecharCarrinho();
}


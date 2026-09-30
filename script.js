const produtos = [
    {
        id: 1,
        nome: "Burger Especial",
        categoria: "burgers",
        preco: 27.90,
        descricao: "Pão brioche, hambúrguer artesanal, queijo prato, alface, tomate e molho especial.",
        imagem: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=85"
    },
    {
        id: 2,
        nome: "Cheddar Bacon",
        categoria: "burgers",
        preco: 29.90,
        descricao: "Pão brioche, carne artesanal, cheddar cremoso, bacon crocante e molho da casa.",
        imagem: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=700&q=85"
    },
    {
        id: 3,
        nome: "X-Burger",
        categoria: "burgers",
        preco: 22.90,
        descricao: "Pão, carne artesanal e queijo prato, com molho especial da Burger House.",
        imagem: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=700&q=85"
    },
    {
        id: 4,
        nome: "Duplo Bacon",
        categoria: "burgers",
        preco: 34.90,
        descricao: "Dois hambúrgueres artesanais, queijo, bacon crocante e molho especial.",
        imagem: "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=700&q=85"
    },
    {
        id: 5,
        nome: "Combo Burger",
        categoria: "combos",
        preco: 39.90,
        descricao: "Burger Especial + batata frita + refrigerante.",
        imagem: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?auto=format&fit=crop&w=700&q=85"
    },
    {
        id: 6,
        nome: "Combo Cheddar",
        categoria: "combos",
        preco: 42.90,
        descricao: "Cheddar Bacon + batata frita + refrigerante.",
        imagem: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=700&q=85"
    },
    {
        id: 7,
        nome: "Refrigerante",
        categoria: "bebidas",
        preco: 6.00,
        descricao: "Refrigerante gelado 350 ml.",
        imagem: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?auto=format&fit=crop&w=700&q=85"
    },
    {
        id: 8,
        nome: "Milkshake",
        categoria: "bebidas",
        preco: 14.90,
        descricao: "Milkshake cremoso de chocolate.",
        imagem: "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=700&q=85"
    }
];

let carrinho = JSON.parse(localStorage.getItem("burgerHouseCarrinho")) || [];
let produtoSelecionado = produtos[1];
let quantidadeSelecionada = 1;
let localizacaoCliente = JSON.parse(localStorage.getItem("burgerHouseLocalizacao") || "null");

function salvarLocalizacao(latitude, longitude) {
    localizacaoCliente = { latitude, longitude };
    localStorage.setItem("burgerHouseLocalizacao", JSON.stringify(localizacaoCliente));
    const confirmacao = document.querySelector("#localizacao-confirmada");
    const coordenadas = document.querySelector("#coordenadas-localizacao");
    const status = document.querySelector("#status-localizacao");
    if (confirmacao) confirmacao.classList.add("mostrar");
    if (coordenadas) coordenadas.textContent = `Coordenadas: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
    if (status) status.textContent = "Localização capturada. O entregador poderá usar o ponto indicado para encontrar você.";
}

function usarLocalizacao() {
    if (!window.isSecureContext && location.hostname !== "localhost" && location.hostname !== "127.0.0.1") {
        mostrarNotificacao("Abra o projeto pelo localhost ou por um site HTTPS para usar a localização.");
        return;
    }

    if (!navigator.geolocation) {
        mostrarNotificacao("Este navegador não oferece localização.");
        return;
    }

    const botao = document.querySelector("#usar-localizacao");
    botao.textContent = "📍 LOCALIZANDO...";
    botao.disabled = true;

    navigator.geolocation.getCurrentPosition(
        posicao => {
            salvarLocalizacao(posicao.coords.latitude, posicao.coords.longitude);
            botao.textContent = "✓ LOCALIZAÇÃO DEFINIDA";
            botao.disabled = false;
            mostrarNotificacao("Localização definida para a entrega!");
        },
        erro => {
            botao.textContent = "📍 USAR MINHA LOCALIZAÇÃO";
            botao.disabled = false;
            if (erro.code === 1) {
                mostrarNotificacao("A permissão de localização foi negada. Permita no cadeado do navegador.");
            } else if (erro.code === 2) {
                mostrarNotificacao("Não foi possível encontrar sua localização. Tente novamente.");
            } else {
                mostrarNotificacao("A localização demorou demais. Tente novamente.");
            }
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
    );
}

function carregarLocalizacaoSalva() {
    if (localizacaoCliente && localizacaoCliente.latitude && localizacaoCliente.longitude) {
        salvarLocalizacao(localizacaoCliente.latitude, localizacaoCliente.longitude);
        const botao = document.querySelector("#usar-localizacao");
        if (botao) botao.textContent = "✓ LOCALIZAÇÃO DEFINIDA";
    }
}


const dinheiro = valor => valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
});

function salvarCarrinho() {
    localStorage.setItem("burgerHouseCarrinho", JSON.stringify(carrinho));
    atualizarContador();
}

function atualizarContador() {
    const quantidade = carrinho.reduce((total, item) => total + item.quantidade, 0);
    document.querySelector("#contador-carrinho").textContent = quantidade;
}

function criarCard(produto) {
    return `
        <article class="produto">
            <div class="produto-imagem">
                <img src="${produto.imagem}" alt="${produto.nome}">
            </div>
            <div class="produto-conteudo">
                <h3>${produto.nome}</h3>
                <p>${produto.descricao}</p>
                <div class="produto-rodape">
                    <span class="preco">${dinheiro(produto.preco)}</span>
                    <button class="botao-pequeno" onclick="abrirProduto(${produto.id})">VER PRODUTO</button>
                </div>
            </div>
        </article>
    `;
}

function renderProdutos(lista = produtos) {
    document.querySelector("#lista-produtos").innerHTML = lista.map(criarCard).join("");
}

function renderDestaques() {
    document.querySelector("#produtos-inicio").innerHTML = produtos.slice(0, 3).map(criarCard).join("");
}

function abrirProduto(id) {
    produtoSelecionado = produtos.find(produto => produto.id === id);
    quantidadeSelecionada = 1;

    document.querySelector("#detalhe-imagem").src = produtoSelecionado.imagem;
    document.querySelector("#detalhe-imagem").alt = produtoSelecionado.nome;
    document.querySelector("#detalhe-nome").textContent = produtoSelecionado.nome;
    document.querySelector("#detalhe-preco").textContent = dinheiro(produtoSelecionado.preco);
    document.querySelector("#detalhe-descricao").textContent = produtoSelecionado.descricao;
    document.querySelector("#detalhe-categoria").textContent = produtoSelecionado.categoria.toUpperCase();
    document.querySelector("#quantidade").textContent = quantidadeSelecionada;
    document.querySelectorAll("#pagina-produto input[type=checkbox]").forEach(input => input.checked = false);

    navegar("produto");
}

function navegar(rota) {
    document.querySelectorAll(".pagina").forEach(pagina => pagina.classList.remove("ativa"));
    const pagina = document.querySelector(`#pagina-${rota}`);
    if (pagina) pagina.classList.add("ativa");

    document.querySelectorAll("[data-rota]").forEach(elemento => {
        if (elemento.tagName === "A") elemento.classList.remove("selecionado");
    });

    window.scrollTo({ top: 0, behavior: "smooth" });

    if (rota === "pedidos") renderCarrinho();
}

function mostrarNotificacao(mensagem) {
    const caixa = document.querySelector("#notificacao");
    caixa.textContent = mensagem;
    caixa.classList.add("mostrar");
    setTimeout(() => caixa.classList.remove("mostrar"), 2200);
}

function adicionarAoCarrinho() {
    const adicionais = [...document.querySelectorAll("#pagina-produto input[type=checkbox]:checked")];
    const valorAdicionais = adicionais.reduce((total, item) => total + Number(item.value), 0);
    const nomesAdicionais = adicionais.map(item => item.dataset.extra);

    const chave = produtoSelecionado.id + "-" + nomesAdicionais.join("-");

    const existente = carrinho.find(item => item.chave === chave);

    if (existente) {
        existente.quantidade += quantidadeSelecionada;
    } else {
        carrinho.push({
            chave,
            id: produtoSelecionado.id,
            nome: produtoSelecionado.nome,
            imagem: produtoSelecionado.imagem,
            preco: produtoSelecionado.preco + valorAdicionais,
            adicionais: nomesAdicionais,
            quantidade: quantidadeSelecionada
        });
    }

    salvarCarrinho();
    mostrarNotificacao("Produto adicionado ao carrinho!");
    navegar("pedidos");
}

function renderCarrinho() {
    const container = document.querySelector("#itens-pedido");

    if (!carrinho.length) {
        container.innerHTML = `
            <div style="text-align:center;padding:50px 10px">
                <h2>Seu carrinho está vazio</h2>
                <p style="color:#777">Escolha um hambúrguer delicioso para começar.</p>
                <button class="botao-principal" data-rota="cardapio">IR PARA O CARDÁPIO</button>
            </div>
        `;
        atualizarValores(0);
        return;
    }

    container.innerHTML = carrinho.map((item, indice) => `
        <div class="item-pedido">
            <img src="${item.imagem}" alt="${item.nome}">
            <div>
                <h3>${item.nome}</h3>
                <p>${item.adicionais.length ? item.adicionais.join(", ") : "Sem adicionais"}</p>
                <div class="controles-item">
                    <button onclick="alterarQuantidade(${indice}, -1)">−</button>
                    <span>${item.quantidade}</span>
                    <button onclick="alterarQuantidade(${indice}, 1)">+</button>
                </div>
            </div>
            <strong>${dinheiro(item.preco * item.quantidade)}</strong>
        </div>
    `).join("");

    const subtotal = carrinho.reduce((total, item) => total + item.preco * item.quantidade, 0);
    atualizarValores(subtotal);
}

function alterarQuantidade(indice, alteracao) {
    carrinho[indice].quantidade += alteracao;

    if (carrinho[indice].quantidade <= 0) {
        carrinho.splice(indice, 1);
    }

    salvarCarrinho();
    renderCarrinho();
}

function atualizarValores(subtotal) {
    const taxa = subtotal > 0 ? 6.99 : 0;
    document.querySelector("#subtotal").textContent = dinheiro(subtotal);
    document.querySelector("#entrega").textContent = dinheiro(taxa);
    document.querySelector("#total").textContent = dinheiro(subtotal + taxa);
}

function salvarEnderecoManual() {
    const rua = document.querySelector("#endereco-rua").value.trim();
    const numero = document.querySelector("#endereco-numero").value.trim();
    const bairro = document.querySelector("#endereco-bairro").value.trim();
    const cidade = document.querySelector("#endereco-cidade").value.trim();

    if (!rua || !numero || !bairro || !cidade) {
        mostrarNotificacao("Preencha rua, número, bairro e cidade.");
        return;
    }

    localizacaoCliente = { endereco: `${rua}, ${numero} - ${bairro} - ${cidade}` };
    localStorage.setItem("burgerHouseLocalizacao", JSON.stringify(localizacaoCliente));
    document.querySelector("#localizacao-confirmada").classList.add("mostrar");
    document.querySelector("#coordenadas-localizacao").textContent = localizacaoCliente.endereco;
    document.querySelector("#status-localizacao").textContent = "Endereço de entrega salvo.";
    mostrarNotificacao("Endereço salvo para a entrega!");
}

function finalizarPedido() {
    if (!carrinho.length) {
        if (!localizacaoCliente || (!localizacaoCliente.latitude && !localizacaoCliente.endereco)) { mostrarNotificacao("Informe sua localização ou endereço antes de finalizar."); return; }
        mostrarNotificacao("Adicione algum produto antes de finalizar.");
        return;
    }

    const subtotal = carrinho.reduce((total, item) => total + item.preco * item.quantidade, 0);
    const total = subtotal + 6.99;

    document.querySelector("#recibo-itens").innerHTML = carrinho.map(item => `
        <div class="linha">
            <span>${item.quantidade}x ${item.nome}</span>
            <strong>${dinheiro(item.preco * item.quantidade)}</strong>
        </div>
    `).join("");

    document.querySelector("#recibo-total").textContent = dinheiro(total);

    carrinho = [];
    salvarCarrinho();
    navegar("sucesso");
}

document.addEventListener("click", evento => {
    const elemento = evento.target.closest("[data-rota]");
    if (!elemento) return;

    evento.preventDefault();
    navegar(elemento.dataset.rota);
    history.replaceState(null, "", "#" + elemento.dataset.rota);
});

document.querySelector("#abrir-carrinho").addEventListener("click", () => navegar("pedidos"));

document.querySelector("#aumentar").addEventListener("click", () => {
    quantidadeSelecionada++;
    document.querySelector("#quantidade").textContent = quantidadeSelecionada;
});

document.querySelector("#diminuir").addEventListener("click", () => {
    if (quantidadeSelecionada > 1) quantidadeSelecionada--;
    document.querySelector("#quantidade").textContent = quantidadeSelecionada;
});

document.querySelector("#adicionar-produto").addEventListener("click", adicionarAoCarrinho);
document.querySelector("#finalizar-pedido").addEventListener("click", finalizarPedido);

document.querySelector("#filtros").addEventListener("click", evento => {
    const botao = evento.target.closest(".filtro");
    if (!botao) return;

    document.querySelectorAll(".filtro").forEach(item => item.classList.remove("ativo"));
    botao.classList.add("ativo");

    const categoria = botao.dataset.categoria;
    const lista = categoria === "todos"
        ? produtos
        : produtos.filter(produto => produto.categoria === categoria);

    renderProdutos(lista);
});

window.addEventListener("hashchange", () => {
    const rota = location.hash.replace("#", "") || "inicio";
    if (document.querySelector(`#pagina-${rota}`)) navegar(rota);
});

renderDestaques();
renderProdutos();
atualizarContador();

const rotaInicial = location.hash.replace("#", "") || "inicio";
if (document.querySelector(`#pagina-${rotaInicial}`)) navegar(rotaInicial);

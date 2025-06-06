jQuery(document).ready(function () {

    // Armazena todas as magias e as magias filtradas
    let todasAsMagias = [];
    let magiasFiltradas = [];

    // Variaveis para a paginação
    let paginaAtual = 1;
    let itensPorPagina = 8;

    //Pega o HTML do modal e coloca no body
    carregarModalEMagias();
  
  
    // ============================= PAGINA ================================

    // Busca e salva elas, também configura os filtros com base nos dados das magias
    // A configuração dinâmica dos filtros é para permitir a escalabidade com novas magias
    function carregarDadosMagias() {
        jQuery.getJSON('/data/magias.json', function (dados) {

            // filtros e controles
            const $filtroNome = jQuery('#filtro-magias');
            const $filtroTipo = jQuery('#filtro-tipo');
            const $filtroCirculo = jQuery('#filtro-circulo');
            const $filtroEscola = jQuery('#filtro-escola');
            const $btnLimpar = jQuery('#limpar-filtros');
            const $itensPorPagina = jQuery('#itens-por-pagina');

            const magias = Object.values(dados);
            const tipos = new Set();
            const circulos = new Set();
            const escolas = new Set();

            // preenche os filtros e salva as magias válidas
            magias.forEach((magia) => {
                if (magia.nome && magia.tipo && magia.circulo && magia.escola) {
                    tipos.add(magia.tipo);
                    circulos.add(magia.circulo);
                    escolas.add(magia.escola);
                    todasAsMagias.push(magia);
                }
            });

            magiasFiltradas = [...todasAsMagias];


            preencherOpcoesDeFiltro($filtroTipo, $filtroCirculo, $filtroEscola, tipos, circulos, escolas);  

            //configura os filtros para que sejam reativos.
            configurarFiltros($filtroNome, $filtroTipo, $filtroCirculo, $filtroEscola, $btnLimpar);

            // Listener para quantas magias serão mostradas por página
            $itensPorPagina.on('change', function () {
                itensPorPagina = parseInt(jQuery(this).val());
                paginaAtual = 1; // Volta pra primeira página
                exibirPagina();
            });

            exibirPagina();
        });
    }

    // Método que carrega a página e atualiza ela.
    function exibirPagina() {
        const $lista = jQuery('#lista-magias');
        const totalItens = magiasFiltradas.length;
        const totalPaginas = Math.ceil(totalItens / itensPorPagina);

        // Corrige a página se estiver fora do esperado
        if (paginaAtual > totalPaginas && totalPaginas > 0) {
            paginaAtual = totalPaginas;
        }
        if (paginaAtual < 1) {
            paginaAtual = 1;
        }

        // Lógica para pegar o valor no array equivalente as magias que devem ser mostradas na página
        //   Exemplo simples seria se a página fosse a 2 e mostrando 10 magias por página
        //   paginaAtual seria = 2-1 = 1 e itensPorPagina = 10. logo  inicio = 1 * 10 = 10
        //   ou seja mostraria a partir da magia 10
        const inicio = (paginaAtual - 1) * itensPorPagina; 
        const fim = inicio + itensPorPagina;
        const magiasPagina = magiasFiltradas.slice(inicio, fim);

        // Limpa a lista e adiciona as magias atuais
        $lista.empty();
        magiasPagina.forEach((magia) => {
            const card = criarCardMagia(magia);
            $lista.append(card);
        });

        // Atualiza os textos e controles de paginação
        atualizarInfoPaginacao(totalItens, inicio, fim);
        atualizarControlesPaginacao(totalPaginas);
    }

    // Ouve mudanças nos filtros e atualiza a lista de magias
    function configurarFiltros($nome, $tipo, $circulo, $escola, $btnLimpar) {

      function aplicarFiltros() {

        const nomeFiltro = $nome.val().toLowerCase().trim();
        const tipoFiltro = $tipo.val();
        const circuloFiltro = $circulo.val();
        const escolaFiltro = $escola.val();

        magiasFiltradas = todasAsMagias.filter((magia) => {
          // dados da magia normalizados
          const nome = magia.nome.toLowerCase();  
          const tipo = magia.tipo;                         
          const circulo = magia.circulo.toString();        
          const escola = magia.escola;                     

          // Retorna true se a magia atender a todos os critérios, adicionando ao array de magias filtradas:
          return nome.includes(nomeFiltro) &&
                (!tipoFiltro || tipoFiltro === tipo) &&
                (!circuloFiltro || circuloFiltro === circulo) &&
                (!escolaFiltro || escolaFiltro === escola);
        });


        paginaAtual = 1; // Retorna para a primeira página
        exibirPagina(); 
      }

      // Listeners para os filtros
      $nome.on('input', aplicarFiltros);
      $tipo.on('change', aplicarFiltros);
      $circulo.on('change', aplicarFiltros);
      $escola.on('change', aplicarFiltros);
      $btnLimpar.on('click', function () {
        $nome.val('');
        $tipo.val('');
        $circulo.val('');
        $escola.val('');
        aplicarFiltros();
      });
    }

    // Métodos auxiliares
    function criarCardMagia(magia) {
        const { nome, tipo, circulo, escola, descricao, info, melhoramentos = {} } = magia;

        const card = jQuery(`
            <div class="col-12 col-md-6 col-lg-3">
                <div class="card h-100 card-magia" style="cursor: pointer;">
                    <div class="card-body">
                        <h5 class="card-title">${nome}</h5>
                        <hr class="p-3">
                        <p class="card-text mb-1"><strong>Tipo:</strong> ${tipo}</p>
                        <p class="card-text mb-1"><strong>Círculo:</strong> ${circulo}º</p>
                        <p class="card-text mb-1"><strong>Escola:</strong> ${escola}</p>
                        <p class="card-text text-muted small">${criarResumo(descricao)}</p>
                    </div>
                </div>
            </div>
        `);

        //Listener de clique para abrir o modal
        card.on('click', () => exibirModalMagia(nome, tipo, circulo, escola, descricao, info, melhoramentos));
        return card;
    }
    function criarResumo(texto, limite = 100) {
        return typeof texto === 'string' && texto.length > limite
            ? texto.substring(0, limite) + '...'
            : texto || '';
    }
    function atualizarInfoPaginacao(total, inicio, fim) {
        const $info = jQuery('#info-paginacao');
        if (total === 0) {
            $info.text('Nenhuma magia encontrada');
        } else {
            const inicioReal = inicio + 1;
            const fimReal = Math.min(fim, total);
            $info.text(`Mostrando ${inicioReal}-${fimReal} de ${total} magias`);
        }
    }
    function atualizarControlesPaginacao(totalPaginas) {
        const $paginacao = jQuery('#paginacao');
        $paginacao.empty();

        if (totalPaginas <= 1) return; // Sem paginação se só tiver uma página

        // Botão anterior
        const $anterior = jQuery(`
            <li class="page-item ${paginaAtual === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" data-pagina="${paginaAtual - 1}">Anterior</a>
            </li>
        `);
        $paginacao.append($anterior);

        // Define quais páginas serão exibidas com ou sem reticências
        let paginasParaMostrar = [];
        if (totalPaginas <= 7) {
            for (let i = 1; i <= totalPaginas; i++) {
                paginasParaMostrar.push(i);
            }
        } else if (paginaAtual <= 4) {
            paginasParaMostrar = [1, 2, 3, 4, 5, '...', totalPaginas];
        } else if (paginaAtual >= totalPaginas - 3) {
            paginasParaMostrar = [1, '...', totalPaginas - 4, totalPaginas - 3, totalPaginas - 2, totalPaginas - 1, totalPaginas];
        } else {
            paginasParaMostrar = [1, '...', paginaAtual - 1, paginaAtual, paginaAtual + 1, '...', totalPaginas];
        }

        // Adiciona os botões de página
        paginasParaMostrar.forEach((pagina) => {
            if (pagina === '...') {
                $paginacao.append('<li class="page-item disabled"><span class="page-link">...</span></li>');
            } else {
                const $pagina = jQuery(`
                    <li class="page-item ${pagina === paginaAtual ? 'active' : ''}">
                        <a class="page-link" href="#" data-pagina="${pagina}">${pagina}</a>
                    </li>
                `);
                $paginacao.append($pagina);
            }
        });

        // Botão próximo
        const $proximo = jQuery(`
            <li class="page-item ${paginaAtual === totalPaginas ? 'disabled' : ''}">
                <a class="page-link" href="#" data-pagina="${paginaAtual + 1}">Próximo</a>
            </li>
        `);
        $paginacao.append($proximo);

        // Evento de clique nos botões de página
        $paginacao.find('a.page-link').on('click', function (e) {
            e.preventDefault();
            const novaPagina = parseInt(jQuery(this).data('pagina'));
            if (novaPagina && novaPagina !== paginaAtual && novaPagina >= 1 && novaPagina <= totalPaginas) {
                paginaAtual = novaPagina;
                exibirPagina();
                // Rolagem suave até o topo da lista
                jQuery('#lista-magias').get(0).scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }
    function preencherOpcoesDeFiltro($tipo, $circulo, $escola, tipos, circulos, escolas) {
        tipos.forEach((tipo) => $tipo.append(`<option value="${tipo}">${tipo}</option>`));
        [...circulos].sort((a, b) => a - b).forEach((circulo) => $circulo.append(`<option value="${circulo}">${circulo}º</option>`));
        escolas.forEach((escola) => $escola.append(`<option value="${escola}">${escola}</option>`));
    }
  

    // ============================= MODAL ================================
    // Exibe o modal com os detalhes completos da magia

    function exibirModalMagia(nome, tipo, circulo, escola, descricao, info, melhoramentos = []) {
        const atributosHTML = `
            <div class="row g-3 mb-3">
                ${criarColunaInfo('Tipo', tipo)}
                ${criarColunaInfo('Círculo', `${circulo}º`)}
                ${criarColunaInfo('Escola', escola)}
                ${criarColunaInfo('Execução', info.execucao)}
                ${criarColunaInfo('Alcance', info.alcance)}
                ${criarColunaInfo('Alvo', info.alvo)}
                ${criarColunaInfo('Duração', info.duracao)}
                ${criarColunaInfo('Resistência', info.resistencia)}
            </div>
        `;

        const descricaoHTML = descricao
            ? `<div class="bg-light border rounded p-3 pt-0 mb-3" style="white-space: pre-line;">
                   <h6 class="fw-bold mb-2">Descrição</h6>
                   <p class="mb-0 magia-descricao">${descricao}</p>
               </div>`
            : '';

        const melhoramentosHTML = melhoramentos?.length
            ? `<div class="bg-white border rounded p-3">
                   <h6 class="fw-bold mb-2">Melhoramentos</h6>
                   <ul class="list-group list-group-flush magia-descricao">
                       ${melhoramentos.map(m => `
                           <li class="list-group-item px-0">
                               <span class="badge bg-secondary me-2"> + ${m.custo}</span>
                               ${m.efeito}
                           </li>
                       `).join('')}
                   </ul>
               </div>`
            : '';

        // Coloca o contéudo no modal e o exibe
        jQuery('#modalMagiaLabel').text(nome);
        jQuery('#modalMagiaBody').html(`
            <div class="carta-rpg">
                ${atributosHTML}
                ${descricaoHTML}
                ${melhoramentosHTML}
            </div>
        `);

        new bootstrap.Modal(document.getElementById('modal-magia')).show();
    } 
    function criarColunaInfo(label, valor) {
        return valor
            ? `<div class="col-md-6"><p class="mb-1"><strong>${label}:</strong> <span class="magia-atributo">${valor} </span></p></div>`
            : '';
    }
    function carregarModalEMagias() {
        jQuery.get('componentes/magia-modal/magia-modal.html', function (modalHtml) {
            jQuery('body').append(modalHtml); 
            carregarDadosMagias(); 
        });
    } 

  });
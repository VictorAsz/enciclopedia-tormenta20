tormenta20-grimorio/
│
├── index.html                 # Homepage
│
├── pages/                     # Páginas do site
│   ├── classes.html           # Página de classes
│   ├── racas.html             # Página de raças
│   ├── magias.html            # Página de magias
│   └── habilidades.html       # Página de habilidades
│
├── assets/                    # Recursos estáticos
│   ├── css/
│   │   ├── main.css           # Estilos principais
│   │   ├── components/        # Componentes CSS reutilizáveis
│   │   │   ├── header.css
│   │   │   ├── footer.css
│   │   │   ├── cards.css
│   │   │   └── modals.css
│   │   └── pages/             # Estilos específicos para cada página
│   │       ├── home.css
│   │       ├── classes.css
│   │       ├── racas.css
│   │       └── magias.css
│   │
│   ├── js/
│   │   ├── main.js            # JavaScript principal
│   │   ├── utils/             # Funções utilitárias
│   │   │   ├── api.js         # Funções para carregar dados
│   │   │   ├── search.js      # Funções de busca
│   │   │   └── filters.js     # Funções de filtro
│   │   ├── components/        # Componentes JS reutilizáveis
│   │   │   ├── card.js
│   │   │   ├── modal.js
│   │   │   └── navbar.js
│   │   └── pages/             # Scripts específicos para cada página
│   │       ├── home.js
│   │       ├── classes.js
│   │       ├── racas.js
│   │       └── magias.js
│   │
│   ├── img/
│   │   ├── logo.png
│   │   ├── backgrounds/
│   │   ├── icons/
│   │   ├── classes/
│   │   └── racas/
│   │
│   └── vendor/                # Bibliotecas de terceiros
│       ├── bootstrap/
│       │   ├── css/
│       │   └── js/
│       └── jquery/
│
└── data/                      # Dados do jogo em formato JSON
    ├── classes.json
    ├── racas.json
    ├── magias.json
    ├── habilidades.json
    ├── atributos.json
    ├── pericias.json
    ├── talentos.json
    ├── origens.json
    └── divindades.json
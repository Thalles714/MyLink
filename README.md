# MyLink · Thalles Leal

Página pessoal preparada para Rodrigo Cacioli. Mantém a composição clara da referência aprovada, três contextos e os 14 links originais.

## Desenvolvimento

```sh
npm ci
npm run dev
```

Prévia local: http://127.0.0.1:5173/

```sh
npm run build
npm run preview
```

Na Vercel: preset **Vite**, comando de build `npm run build`, pasta de saída `dist`. Nenhuma variável de ambiente é necessária.

## Estrutura

- `index.html`: conteúdo e estrutura da página.
- `src/main.js`: grupos de links, modais acessíveis e parallax.
- `src/styles.css`: composição original e responsividade.
- `src/icons.js`: marcas GitHub/LinkedIn e pictogramas semânticos para os projetos.
- `src/mascot.js`: personagem original modelado com Three.js, física e falas.
- `src/mascot.css`: apresentação do personagem e refinamentos mobile.
- `public/`: fonte local e favicon vetorial do personagem.

O HTML original permanece localmente em `reference/index.original.html`. As referências visuais e esse backup não são incluídos no repositório nem no site compilado.

## Mascote

Arraste com mouse ou toque e solte para arremessar. O impulso deriva do gesto: gravidade, quique, atrito, inclinação e deformação são calculados em tempo real. Olhos acompanham o ponteiro; gestos de descanso têm intervalos variáveis e não repetem o gesto anterior. As falas são locais, sem chatbot, microfone, serviço externo ou coleta de dados.

Teclado: setas movem, Enter/Espaço brincam, Home volta ao canto e Escape recolhe. Os botões abaixo do personagem permitem voltar ao canto ou recolher. O ícone no canto o traz de volta. Com movimento reduzido, arrasto e teclado continuam disponíveis, sem arremesso, parallax, giros ou piscadas. Sem WebGL, há uma representação CSS com arrasto e falas.

## Verificação desta entrega

Build de produção concluído. Inspeção visual no navegador em desktop e 390 × 844; modais e pictogramas conferidos. Arremesso e fala de resposta observados no navegador. Não houve envio de candidatura, mensagem ou alteração dos projetos vinculados.

O modelo do mascote e os pictogramas foram desenhados no código deste projeto, inspirados na silhueta enviada. Nenhum modelo 3D ou código do site de referência foi copiado. Three.js e Vite são distribuídos sob licença MIT; suas licenças acompanham os pacotes instalados.

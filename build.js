/* Gerador do catalogo — Senhor das Tintas
   Uso: node build.js
   Gera produtos.html e produto/<slug>.html a partir dos dados abaixo.
   Para adicionar produto novo: processe a foto para assets/produtos/<slug>.jpg
   e acrescente uma entrada em PRODUTOS. */

const fs = require('fs');
const path = require('path');

const WA = 'https://wa.me/5512988088754';
const SITE = 'https://senhordastintas.com.br';

const CATEGORIAS = [
  ['tintas',      'Tintas e vernizes',      'Acabamento automotivo: tintas prontas, vernizes de alto brilho, fosco e aditivos.'],
  ['primers',     'Primers e preparação',   'A base do serviço bem feito — aderência, enchimento e correção antes da cor.'],
  ['solventes',   'Solventes e limpeza',    'Diluição na proporção certa e superfície limpa: sem isso, a tinta não fixa.'],
  ['massas',      'Massas, colas e reparo', 'Correção de imperfeições, colagem e reparo estrutural em plástico e fibra.'],
  ['abrasivos',   'Lixas e abrasivos',      'Corte, desbaste e lixamento — da remoção de solda ao acabamento fino.'],
  ['polimento',   'Polimento e acabamento', 'A etapa que revela o brilho e entrega o carro pronto.'],
  ['imobiliaria', 'Linha imobiliária',      'Revestimentos e ferramentas para parede, fachada e obra.'],
  ['acessorios',  'Acessórios',             'Os itens de apoio que fazem o serviço render.'],
];

// slug | nome | categoria | descricao curta (card) | o que faz (pagina) | onde se aplica
const PRODUTOS = [
  ['nason-tinta-pronta-vermelho','Nason Tinta Pronta Automotiva','tintas',
   'Tinta automotiva pronta para uso, sem necessidade de mistura.',
   'Tinta automotiva que já vem na consistência de aplicação, dispensando a etapa de mistura e acerto de proporção. Reduz erro de preparo e desperdício, o que faz diferença em serviço pequeno, onde preparar um volume grande não compensa.',
   ['Retoques e reparos pontuais','Repintura de peças avulsas','Serviços rápidos de funilaria']],

  ['nason-tinta-pronta-verde','Nason Tinta Pronta — Linha Cores','tintas',
   'Mesma linha pronta para uso, em diferentes cores.',
   'Versão da linha pronta para uso em outras cores do catálogo. Mantém a mesma praticidade: abre, aplica e não precisa de acerto de proporção.',
   ['Reparo em peças de cor sólida','Retoque de detalhes e frisos','Pintura de componentes avulsos']],

  ['nason-preto-fosco-vinilico','Nason Preto Fosco Vinílico','tintas',
   'Acabamento preto fosco para grades, parachoques e detalhes. Acompanha catalisador.',
   'Acabamento preto fosco de base vinílica, indicado para as áreas do veículo que originalmente não têm brilho. Acompanha o catalisador F0604, que dá a resistência necessária para peça exposta ao tempo.',
   ['Grades e frisos','Parachoques texturizados','Detalhes escurecidos e capotas']],

  ['duxone-dx4800-verniz','DuxONE DX4800 Verniz Alto Sólidos 2:1','tintas',
   'Verniz de acabamento com alto brilho e resistência. Fecha o serviço de repintura.',
   'Verniz poliuretano de alto teor de sólidos, na proporção 2:1. É a camada final que protege a cor dos raios UV, da chuva ácida e de riscos leves — e a que define o brilho que o cliente enxerga.',
   ['Acabamento final de repintura','Pintura completa de veículo','Proteção sobre cor sólida ou metálica']],

  ['duxone-dx0990-verniz-fosco','DuxONE DX0990 Verniz PU Fosco','tintas',
   'Acabamento fosco em poliuretano, sem abrir mão da proteção do verniz.',
   'Verniz poliuretano de acabamento fosco. Entrega o visual sem brilho que virou tendência mantendo a mesma barreira de proteção de um verniz comum — algo que tinta fosca sem verniz não oferece.',
   ['Personalização em acabamento fosco','Detalhes e capôs foscos','Peças que pedem baixo reflexo']],

  ['skylack-acelerador-secagem','Skylack Skydur Acelerador de Secagem','tintas',
   'Reduz o tempo de secagem em dias frios ou úmidos.',
   'Aditivo que acelera a cura da tinta e do verniz. Serve para manter o giro da oficina quando a temperatura cai ou a umidade sobe, situações em que a secagem natural trava a produção.',
   ['Dias frios e úmidos','Oficina sem cabine aquecida','Serviço com prazo apertado']],

  ['skylack-aditivo-anticratera','Skylack Skydur Aditivo Anticratera','tintas',
   'Elimina crateras e olhos-de-peixe causados por resíduo de silicone ou óleo.',
   'Aditivo que corrige o defeito conhecido como cratera ou olho-de-peixe: aquelas marcas circulares que aparecem quando resta silicone ou óleo na superfície. Atua na tensão do filme, permitindo que a tinta se acomode mesmo com contaminação residual.',
   ['Superfície com resíduo de silicone','Retrabalho de pintura com cratera','Oficina com ar comprimido contaminado']],

  ['duxone-dx1504-primer-pu','DuxONE DX1504 Primer PU Cinza','primers',
   'Primer poliuretano cinza que nivela imperfeições e prepara para a tinta.',
   'Primer poliuretano na cor cinza, usado depois da massa e antes da cor. Nivela microimperfeições e cria a superfície uniforme de que a tinta precisa. O tom cinza também padroniza o fundo, evitando que a cor final fique irregular.',
   ['Preparação após massa e lixamento','Uniformização de fundo','Base para cores sólidas']],

  ['duxone-dx1820-primer-alto-solidos','DuxONE DX1820 Primer PU Alto Sólidos','primers',
   'Alto poder de enchimento: cobre riscos de lixa com menos demãos.',
   'Primer com alto teor de sólidos, o que significa mais material sólido por demão. Preenche riscos de lixa mais fundos com menos aplicações, reduzindo tempo de cabine e retrabalho.',
   ['Superfície com risco de lixa grossa','Reparos que exigem enchimento','Redução de demãos e tempo de secagem']],

  ['duxone-dx7600-blender','DuxONE DX7600 Blender de Retoque','primers',
   'Dissolve a borda do retoque e disfarça a emenda com a pintura original.',
   'Produto específico para o acabamento da emenda entre o reparo e a pintura original. Dissolve a borda da tinta nova, criando uma transição gradual em vez de uma linha visível. É o que separa um retoque profissional de um remendo aparente.',
   ['Retoque parcial de painel','Emenda com pintura original','Reparo localizado sem repintar a peça inteira']],

  ['nason-primer-f1259','Nason Primer F1259','primers',
   'Primer de alto poder de enchimento. Acompanha catalisador F496.',
   'Primer de alto poder de enchimento para correção de superfície antes da cor. Acompanha o catalisador F496, que garante a cura e a dureza necessárias para o lixamento posterior.',
   ['Correção de superfície irregular','Preparação de painel completo','Base antes da cor']],

  ['nason-primer-p1600','Nason Primer P1600','primers',
   'Primer de fácil lixamento, para preparação rápida.',
   'Primer formulado para lixar com facilidade, sem empastar a lixa. Isso encurta a etapa de acabamento do fundo, que costuma ser a mais demorada da preparação.',
   ['Preparação rápida','Serviços de alto giro','Fundo antes do acabamento']],

  ['nason-primer-f1000','Nason Primer PU F1000 5:1','primers',
   'Primer poliuretano de secagem rápida e ótimo poder de enchimento.',
   'Primer poliuretano na proporção 5:1, que combina secagem rápida com bom enchimento. Prepara a superfície para acabamentos da linha Nason.',
   ['Preparação de superfície','Fundo para linha Nason','Serviço com prazo curto']],

  ['axalta-u9000-wash-primer','Axalta U9000 Super Wash Primer','primers',
   'Primer de aderência para metal nu, com proteção anticorrosiva.',
   'Wash primer aplicado direto sobre metal exposto. Cria a ponte de aderência que impede a tinta de descolar e forma uma barreira contra corrosão — etapa que não pode ser pulada em chapa nova ou área que chegou ao metal.',
   ['Chapa nova e metal exposto','Áreas lixadas até o substrato','Prevenção de corrosão sob a pintura']],

  ['axalta-u6065-seladora-plastico','Axalta U6065 Seladora para Plástico','primers',
   'Garante aderência da tinta em parachoques e peças plásticas.',
   'Seladora específica para substrato plástico. Plástico tem baixa energia de superfície e a tinta comum não fixa — este produto resolve isso, evitando o descascamento que aparece meses depois do serviço.',
   ['Parachoques e spoilers','Retrovisores e molduras','Qualquer peça plástica a ser pintada']],

  ['norton-tack-cloth','Norton Tack Cloth — Pano Pega-Pó','primers',
   'Retira partículas e poeira logo antes da pintura.',
   'Pano com tratamento pegajoso que captura poeira e partículas soltas da superfície no último momento antes da pintura. É o que evita o grão preso no verniz, defeito que só aparece depois de seco e obriga a repolir.',
   ['Limpeza final antes da cor','Entre demãos','Preparação dentro da cabine']],

  ['itaqua-thinner','Thinner Itaqua','solventes',
   'Diluição de tintas automotivas e limpeza de pistolas e equipamentos.',
   'Solvente de uso geral na oficina: dilui tintas automotivas até o ponto de aplicação e limpa pistolas, mangueiras e ferramentas. Manter o equipamento limpo é o que garante leque uniforme na próxima pintura.',
   ['Diluição de tinta e verniz','Limpeza de pistola e equipamento','Remoção de respingos frescos']],

  ['itaqua-aguarras','Aguarrás Itaqua','solventes',
   'Diluente para tintas e vernizes à base de óleo. Também limpa pincéis.',
   'Solvente indicado para produtos à base de óleo — esmaltes sintéticos, vernizes e tintas alquídicas. Mais suave que o thinner, também serve para limpar pincéis e rolos sem atacar as cerdas.',
   ['Diluição de esmalte sintético','Limpeza de pincéis e rolos','Remoção de graxa leve']],

  ['itaqua-diluente-pu','Itaqua Diluente para PU','solventes',
   'Diluente específico para tintas e vernizes poliuretano.',
   'Diluente formulado para sistemas poliuretano. Usar o diluente correto mantém a proporção da mistura e o tempo de evaporação previsto pelo fabricante — com solvente errado, o verniz pode velar ou escorrer.',
   ['Diluição de verniz PU','Sistemas poliuretano em geral','Ajuste de viscosidade para pistola']],

  ['itaqua-desengraxante','Itaqua Desengraxante','solventes',
   'Remove gordura e resíduos antes da aplicação da tinta.',
   'Desengraxante para a limpeza que antecede a pintura. Retira óleo, gordura e resíduo de manuseio da superfície — contaminação invisível que causa falha de aderência e cratera.',
   ['Limpeza antes do primer','Preparação de superfície','Remoção de marca de dedo e óleo']],

  ['itaqua-querosene','Querosene Itaqua','solventes',
   'Limpeza pesada de peças, ferramentas e equipamentos. Lata de 900 ml e galão de 5 L.',
   'Solvente de limpeza pesada, usado para desengraxar peças e ferramentas com sujeira acumulada. Disponível em lata de 900 ml e em galão de 5 litros para quem consome volume.',
   ['Limpeza de peças mecânicas','Desengraxe de ferramentas','Remoção de sujeira pesada']],

  ['axalta-u0200-desengraxante','Axalta U0200 Solução Desengraxante','solventes',
   'Remove ceras, silicones e gorduras — evita falha de aderência.',
   'Solução desengraxante da linha Axalta, formulada para retirar ceras e silicones que resistem à limpeza comum. É justamente o silicone o vilão das crateras, e ele não sai só com água e sabão.',
   ['Antes do primer e da cor','Veículo que passou por polimento','Remoção de cera e silicone']],

  ['apc-desengraxante','APC Auto Advanced — Limpador Concentrado','solventes',
   'Limpador multiuso concentrado para sujeira pesada.',
   'Limpador multiuso concentrado, diluível conforme a sujeira. Cobre a limpeza geral do veículo que não faz parte do processo de pintura — interior, motor e plásticos.',
   ['Limpeza de interior e estofado','Plásticos e painéis','Motor e compartimentos']],

  ['maxi-rubber-retoque-rapido','Maxi Rubber Retoque Rápido','massas',
   'Massa para pequenas correções e imperfeições pontuais.',
   'Massa de acabamento em bisnaga para as imperfeições pequenas que sobram depois da massa plástica — poros, riscos finos e pequenas ondulações. Seca rápido e lixa fácil.',
   ['Poros e riscos finos','Acabamento antes do primer','Correções pontuais de última hora']],

  ['restaura-tudo-kit-reparo','Restaura Tudo — Kit de Reparo','massas',
   'Reparo em fibra de vidro e plásticos: parachoques, grades e cascos.',
   'Kit de reparo estrutural para fibra de vidro e plásticos, com resina e endurecedor. Recompõe peça trincada ou com pedaço faltando, em vez de substituir — o que muda completamente o custo do serviço.',
   ['Parachoques trincados','Grades e peças plásticas quebradas','Caixas d’água e cascos de barco']],

  ['tekbond-793-instantaneo','Tekbond 793 — Adesivo Instantâneo','massas',
   'Colagem instantânea de alta resistência em plástico, borracha e metal.',
   'Adesivo instantâneo à base de cianoacrilato, de pega rápida e alta resistência. Resolve a colagem de peça pequena sem precisar imobilizar por horas.',
   ['Peças plásticas pequenas','Borracha e vedações','Fixações rápidas de emergência']],

  ['tekbond-cola-contato','Tekbond Cola de Contato','massas',
   'Colagem de forros, carpetes, laminados e revestimentos.',
   'Cola de contato para colagem de superfícies amplas, onde o adesivo instantâneo não serve. Aplica-se nas duas faces, aguarda o ponto e une — a aderência é imediata em toda a área.',
   ['Forro de teto automotivo','Carpetes e revestimentos','Laminados e acabamentos internos']],

  ['norton-disco-desbaste-metal','Norton Classic — Disco de Desbaste','abrasivos',
   'Remove solda, rebarba e excesso de material em aço.',
   'Disco de desbaste para remoção agressiva de material: cordão de solda, rebarba e excesso de chapa. Trabalha em ângulo, com a face lateral do disco.',
   ['Rebaixamento de solda','Remoção de rebarba','Preparação de chapa antes da massa']],

  ['norton-disco-corte','Norton Classic — Disco de Corte 1,0 mm','abrasivos',
   'Corte fino em aço e inox, com pouca rebarba.',
   'Disco de corte fino de 1,0 mm. A espessura reduzida corta mais rápido, exige menos força e gera menos rebarba e calor — o que preserva a peça e a esmerilhadeira.',
   ['Corte de chapa e perfil','Aço carbono e inox','Corte de precisão com pouca perda']],

  ['norton-disco-flap-120','Norton Disco Flap 7" Grão 120','abrasivos',
   'Lixa e acaba aço e inox numa só operação.',
   'Disco de lâminas sobrepostas que desbasta e acaba na mesma passada. Grão 120 entrega acabamento refinado, dispensando uma etapa de lixamento separada. As lâminas se renovam conforme desgastam, mantendo o corte constante.',
   ['Acabamento de solda','Aço e inox','Preparação de superfície metálica']],

  ['disco-limpeza-remocao','Disco de Limpeza Abrasivo','abrasivos',
   'Remove ferrugem, tinta velha e cola sem agredir o metal.',
   'Disco de fibra abrasiva aberta que remove ferrugem, tinta velha, cola e óxidos preservando o metal por baixo. Diferente do disco de desbaste, ele tira a camada indesejada sem comer a chapa.',
   ['Remoção de ferrugem','Retirada de tinta velha','Limpeza de solda e óxido']],

  ['roda-borracha-remove-adesivo','Roda de Borracha Removedora','abrasivos',
   'Tira adesivos, faixas e resíduo de cola sem danificar a pintura.',
   'Roda de borracha acoplada à furadeira que remove adesivo, faixa e resíduo de cola por atrito, sem solvente e sem atacar a pintura original. Resolve em minutos o que na mão levaria horas.',
   ['Remoção de adesivo e plotagem','Faixas e emblemas','Resíduo de fita dupla face']],

  ['disco-fibra-lixa','Disco de Fibra para Lixar','abrasivos',
   'Desbaste e preparação de superfícies metálicas.',
   'Disco de lixa sobre base de fibra, usado com prato de apoio em esmerilhadeira. Ferramenta padrão do desbaste inicial em chapa.',
   ['Desbaste inicial de chapa','Remoção de pintura','Preparação antes da massa']],

  ['disco-roloc','Disco Roloc — Troca Rápida','abrasivos',
   'Limpeza de pontos de solda e áreas de difícil acesso.',
   'Disco pequeno com sistema de rosca de troca rápida. O diâmetro reduzido alcança cantos, frestas e pontos de solda onde o disco grande não entra, e a troca leva segundos.',
   ['Pontos de solda','Cantos e frestas','Áreas de difícil acesso']],

  ['disco-pvc-7','Disco de PVC 7"','abrasivos',
   'Base de apoio para discos de lixa de 7 polegadas.',
   'Prato de apoio em PVC para fixar discos de lixa de 7 polegadas na esmerilhadeira. Dá a rigidez e o plano corretos ao abrasivo.',
   ['Apoio para disco de fibra','Lixamento em esmerilhadeira','Superfícies planas amplas']],

  ['suporte-disco-pvc','Suporte de Disco PVC','abrasivos',
   'Prato de fixação que mantém o disco firme e plano.',
   'Suporte que prende o disco abrasivo e mantém a planicidade durante o trabalho. Sem ele, o disco flexiona e o lixamento sai irregular.',
   ['Fixação de disco abrasivo','Lixamento uniforme','Uso em esmerilhadeira']],

  ['bloco-lixar-manual','Bloco de Lixar Manual','abrasivos',
   'Mantém a lixa plana e o lixamento uniforme.',
   'Bloco com sistema de fixação da lixa nas extremidades. Distribui a pressão da mão por toda a área, evitando a ondulação que a mão sozinha inevitavelmente cria na chapa.',
   ['Lixamento de massa','Superfícies planas','Acabamento antes do primer']],

  ['esponja-lixar','Esponja de Lixar','abrasivos',
   'Acompanha superfícies curvas mantendo pressão uniforme.',
   'Base em espuma que permite ao abrasivo acompanhar curvas e reentrâncias sem perder o contato uniforme. Onde o bloco rígido marcaria, a esponja se adapta.',
   ['Paralamas e curvas','Reentrâncias e frisos','Acabamento em superfície irregular']],

  ['taco-lixar','Taco de Lixar','abrasivos',
   'Apoio ergonômico para lixamento manual em áreas planas.',
   'Taco de apoio para lixamento manual, com formato que reduz o cansaço da mão em serviço prolongado.',
   ['Lixamento manual','Áreas planas','Serviço de longa duração']],

  ['taco-lixar-pequeno','Taco de Lixar Compacto','abrasivos',
   'Versão menor para detalhes, cantos e áreas de pouco acesso.',
   'Versão compacta do taco, para detalhes e regiões estreitas onde o taco grande não alcança.',
   ['Cantos e detalhes','Áreas estreitas','Acabamento fino']],

  ['nobrecar-massa-polir','Nobre Car NC Technology — Massa de Polir','polimento',
   'Remove riscos e marcas de lixa, devolvendo o brilho.',
   'Massa de polir que remove riscos finos e as marcas deixadas pelo lixamento, recuperando o brilho da pintura. É a etapa que transforma uma superfície fosca e riscada no acabamento espelhado que o cliente espera.',
   ['Pós-lixamento de verniz','Remoção de risco fino','Recuperação de brilho']],

  ['ets-dupla-acao-polidor','ETS Dupla Ação — Polidor','polimento',
   'Refino e lustro em uma só etapa.',
   'Polidor que combina refino e lustro numa aplicação só. Encurta o processo de polimento, que tradicionalmente exige dois produtos e duas passadas.',
   ['Polimento em etapa única','Refino após corte','Lustro final']],

  ['nobrecar-super-pretinho','Nobre Car Super Pretinho','polimento',
   'Renova pneus e plásticos externos.',
   'Renovador de pneus e plásticos externos, com opção de acabamento brilhante ou seco. É o detalhe final que faz o carro parecer recém-saído da revisão.',
   ['Pneus','Plásticos externos e parachoques','Acabamento de entrega']],

  ['pano-microfibra','Pano de Microfibra','polimento',
   'Aplica e remove cera e polidor sem marcar a pintura.',
   'Pano de microfibra para aplicação e remoção de ceras e polidores. As fibras capturam a sujeira em vez de arrastá-la, evitando os microrriscos que um pano comum provoca.',
   ['Remoção de polidor e cera','Secagem sem marcar','Limpeza de acabamento']],

  ['graff-arte-textura','Graff-Arte — Grafiato, Textura e Massa Corrida','imobiliaria',
   'Revestimento acrílico para fachadas e paredes, com proteção antimofo.',
   'Linha de revestimento acrílico para parede e fachada, cobrindo seladora, textura, grafiato e massa corrida. Além do acabamento decorativo, agrega proteção antimofo e antibactéria — relevante em fachada exposta e área úmida.',
   ['Fachadas e muros','Paredes internas','Acabamento texturizado e grafiato']],

  ['desempenadeira-tigre','Desempenadeira Tigre','imobiliaria',
   'Aplica e alisa massa corrida, gesso e argamassa.',
   'Ferramenta de aplicação e alisamento para massa corrida, gesso e argamassa. A lâmina flexível é o que define a planicidade da parede antes da pintura.',
   ['Aplicação de massa corrida','Alisamento de gesso','Acabamento de argamassa']],

  ['fita-dupla-face','Fita Dupla Face Automotiva','acessorios',
   'Fixa emblemas, molduras e acabamentos externos.',
   'Fita dupla face de uso automotivo, formulada para resistir a sol, chuva e variação de temperatura. É a fixação usada de fábrica em emblema e moldura — cola comum não aguenta a exposição.',
   ['Emblemas e logotipos','Molduras e frisos','Acabamentos externos']],

  ['tekbond-fita-isolante','Tekbond Fita Isolante','acessorios',
   'Isolamento de emendas elétricas e proteção de chicotes.',
   'Fita isolante para emendas elétricas e proteção de chicotes. Item de consumo constante em qualquer serviço que mexa na parte elétrica.',
   ['Emendas elétricas','Proteção de chicote','Identificação e amarração']],

  ['espatula-plastica','Espátula Plástica','acessorios',
   'Aplicação de massa plástica e poliéster sem riscar.',
   'Espátula plástica flexível para aplicar e espalhar massa. Por não ser metálica, não risca nem contamina a superfície com partícula de metal.',
   ['Aplicação de massa plástica','Espalhamento uniforme','Superfícies delicadas']],

  ['espatula-laranja','Espátula de Aplicação','acessorios',
   'Espalha massa e adesivo de forma uniforme em superfícies curvas.',
   'Espátula de aplicação com flexibilidade adequada para acompanhar superfícies curvas, mantendo camada uniforme.',
   ['Superfícies curvas','Aplicação de adesivo','Espalhamento de massa']],

  ['pincel-14','Pincel Nº 14','acessorios',
   'Aplicação de tinta e verniz em retoques e áreas pequenas.',
   'Pincel para retoque e aplicação em área pequena, onde a pistola não compensa ou não alcança.',
   ['Retoques pontuais','Molduras e detalhes','Áreas de difícil acesso']],
];

// ---------------------------------------------------------------- helpers
const esc = s => String(s).replace(/&(?![a-zA-Z#][a-zA-Z0-9]*;)/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const catNome = k => (CATEGORIAS.find(c => c[0] === k) || [,k])[1];
const catDesc = k => (CATEGORIAS.find(c => c[0] === k) || [,,''])[2];

const ICO_WA = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47s1.06 2.87 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.28.17-1.41-.07-.13-.27-.2-.57-.35zM12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 004.79 1.22h.01c5.46 0 9.9-4.45 9.9-9.91C21.95 6.45 17.5 2 12.04 2z"/></svg>';

function cabecalho({titulo, descricao, base, canonical, ogImage}) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(titulo)}</title>
<meta name="description" content="${esc(descricao)}">
<link rel="canonical" href="${SITE}/${canonical}">
<meta name="theme-color" content="#050A3D">
<meta property="og:type" content="website">
<meta property="og:locale" content="pt_BR">
<meta property="og:site_name" content="Senhor das Tintas">
<meta property="og:title" content="${esc(titulo)}">
<meta property="og:description" content="${esc(descricao)}">
<meta property="og:url" content="${SITE}/${canonical}">
<meta property="og:image" content="${SITE}/${ogImage}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="${base}assets/logo.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${base}assets/estilo.css">
</head>
<body>

<div class="topbar">
  <div class="wrap">
    <span class="hide-sm">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
      Av. Pres. Tancredo Neves, 3100 &ndash; Sala 3 &middot; Nova Michigan &middot; São José dos Campos/SP
    </span>
    <span>
      <!-- CONFIRMAR HORARIO REAL COM O CLIENTE ANTES DE PUBLICAR -->
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
      Seg a Sex 8h&ndash;18h &middot; Sáb 8h&ndash;13h
    </span>
    <a href="https://instagram.com/senhordastintasoficial" target="_blank" rel="noopener">@senhordastintasoficial</a>
  </div>
</div>

<header id="header">
  <div class="wrap">
    <a href="${base}index.html" class="logo"><img src="${base}assets/logo.png" alt="Senhor das Tintas"></a>
    <nav id="nav">
      <a href="${base}index.html#solucoes">Linhas de tinta</a>
      <a href="${base}index.html#diferenciais">Por que nós</a>
      <a href="${base}index.html#loja">A loja</a>
      <a href="${base}produtos.html" class="ativo">Produtos</a>
      <a href="${base}index.html#avaliacoes">Avaliações</a>
      <a href="${base}index.html#local">Onde estamos</a>
    </nav>
    <a class="btn btn-wa header-cta" href="${WA}?text=Ol%C3%A1!%20Vim%20pelo%20site%20e%20gostaria%20de%20um%20or%C3%A7amento." target="_blank" rel="noopener">${ICO_WA} WhatsApp</a>
    <button class="burger" id="burger" aria-label="Abrir menu"><span></span><span></span><span></span></button>
  </div>
</header>
`;
}

function rodape(base) {
  return `
<footer>
  <div class="wrap">
    <div class="foot-grid">
      <div>
        <div class="foot-logo"><img src="${base}assets/logo.png" alt="Senhor das Tintas"></div>
        <p>Loja de tintas em São José dos Campos com mais de 7 anos de experiência. Linhas automotiva, industrial e imobiliária, com atendimento consultivo e entrega rápida.</p>
        <div class="social">
          <a href="https://instagram.com/senhordastintasoficial" target="_blank" rel="noopener" aria-label="Instagram">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/></svg>
          </a>
          <a href="${WA}" target="_blank" rel="noopener" aria-label="WhatsApp">${ICO_WA}</a>
        </div>
      </div>
      <div>
        <h4>Navegação</h4>
        <ul>
          <li><a href="${base}index.html#solucoes">Linhas de tinta</a></li>
          <li><a href="${base}index.html#diferenciais">Por que nós</a></li>
          <li><a href="${base}index.html#loja">A loja</a></li>
          <li><a href="${base}produtos.html">Produtos</a></li>
          <li><a href="${base}index.html#avaliacoes">Avaliações</a></li>
          <li><a href="${base}index.html#local">Onde estamos</a></li>
        </ul>
      </div>
      <div>
        <h4>Contato</h4>
        <ul>
          <li><a href="${WA}" target="_blank" rel="noopener">(12) 98808-8754</a></li>
          <li><a href="mailto:senhordastintas@senhordastintas.com.br">senhordastintas@<br>senhordastintas.com.br</a></li>
          <li>Av. Pres. Tancredo Neves, 3100 &ndash; Sala 3<br>Nova Michigan &ndash; São José dos Campos/SP</li>
        </ul>
      </div>
    </div>
    <div class="foot-bottom">
      <span>&copy; 2026 Senhor das Tintas. Todos os direitos reservados.</span>
      <span>CNPJ e políticas a confirmar</span>
    </div>
  </div>
</footer>

<a class="wa-float" href="${WA}?text=Ol%C3%A1!%20Vim%20pelo%20site%20e%20gostaria%20de%20um%20or%C3%A7amento." target="_blank" rel="noopener" aria-label="Falar no WhatsApp">${ICO_WA}</a>

<script>
(function(){
  var header=document.getElementById('header');
  window.addEventListener('scroll',function(){header.classList.toggle('scrolled',window.scrollY>12)},{passive:true});
  var burger=document.getElementById('burger'),nav=document.getElementById('nav');
  burger.addEventListener('click',function(){nav.classList.toggle('open');burger.classList.toggle('x')});
  nav.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){nav.classList.remove('open');burger.classList.remove('x')})});
  var io=new IntersectionObserver(function(e){e.forEach(function(x){if(x.isIntersecting){x.target.classList.add('on');io.unobserve(x.target)}})},{threshold:.1,rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('.reveal').forEach(function(el,i){el.style.transitionDelay=(i%4)*70+'ms';io.observe(el)});
})();
</script>

</body>
</html>
`;
}

function cardProduto(p, base) {
  return `        <a class="produto" href="${base}produto/${p[0]}.html">
          <div class="produto-img"><img src="${base}assets/produtos/${p[0]}.jpg" alt="${esc(p[1])}" loading="lazy"></div>
          <div class="produto-txt">
            <h3>${esc(p[1])}</h3>
            <p>${esc(p[3])}</p>
            <span class="produto-link">Ver detalhes
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </span>
          </div>
        </a>`;
}

// ---------------------------------------------------------------- produtos.html
function geraCatalogo() {
  const navCats = CATEGORIAS.map(c => {
    const n = PRODUTOS.filter(p => p[2] === c[0]).length;
    return n ? `      <a href="#${c[0]}">${esc(c[1])} <b>${n}</b></a>` : '';
  }).filter(Boolean).join('\n');

  const secoes = CATEGORIAS.map(c => {
    const itens = PRODUTOS.filter(p => p[2] === c[0]);
    if (!itens.length) return '';
    return `  <section class="cat-bloco" id="${c[0]}">
    <div class="wrap">
      <div class="cat-head reveal">
        <div>
          <span class="eyebrow">${esc(c[1])}</span>
          <h2>${esc(c[2])}</h2>
        </div>
        <span class="cat-contador">${itens.length} ${itens.length === 1 ? 'item' : 'itens'}</span>
      </div>
      <div class="produtos-grid">
${itens.map(p => cardProduto(p, '')).join('\n')}
      </div>
    </div>
  </section>`;
  }).filter(Boolean).join('\n\n');

  return cabecalho({
    titulo: 'Produtos | Senhor das Tintas — Tintas, primers, abrasivos e acabamento em SJC',
    descricao: `Catálogo com ${PRODUTOS.length} produtos: tintas e vernizes automotivos, primers, solventes, massas, abrasivos Norton, polimento e linha imobiliária. Consulte pelo WhatsApp.`,
    base: '', canonical: 'produtos.html', ogImage: 'assets/letreiro.jpg'
  }) + `
<div class="pagina-topo">
  <div class="wrap">
    <nav class="trilha"><a href="index.html">Início</a> <span>/</span> <b>Produtos</b></nav>
    <h1>O que você encontra na loja</h1>
    <p class="lead">Da preparação da superfície ao acabamento final. Trabalhamos com muito mais itens do que os listados aqui &mdash; se não achar o que procura, chame no WhatsApp que a gente verifica.</p>
  </div>
</div>

<nav class="cat-nav">
  <div class="wrap">
${navCats}
  </div>
</nav>

${secoes}

<section class="cta-final">
  <div class="wrap">
    <h2 class="reveal">Não achou o que procurava?</h2>
    <p class="reveal">Nosso estoque é maior que esta vitrine. Manda uma mensagem dizendo o que você precisa pintar que a gente indica o produto certo e confirma a disponibilidade.</p>
    <a class="btn btn-wa reveal" href="${WA}?text=Ol%C3%A1!%20Vi%20o%20cat%C3%A1logo%20no%20site%20e%20gostaria%20de%20consultar%20um%20produto." target="_blank" rel="noopener">${ICO_WA} Consultar no WhatsApp</a>
    <p class="cta-sub reveal">Resposta rápida no horário comercial &middot; (12) 98808-8754</p>
  </div>
</section>
` + rodape('');
}

// ---------------------------------------------------------------- produto/<slug>.html
function geraProduto(p) {
  const [slug, nome, cat, curta, longa, aplicacoes] = p;
  const relacionados = PRODUTOS.filter(x => x[2] === cat && x[0] !== slug).slice(0, 4);

  const schema = {
    '@context':'https://schema.org','@type':'Product',
    name: nome, description: longa,
    image: `${SITE}/assets/produtos/${slug}.jpg`,
    category: catNome(cat),
    brand: { '@type':'Brand', name: nome.split(' ')[0] },
    offers: { '@type':'Offer', availability:'https://schema.org/InStock',
              priceCurrency:'BRL', seller:{ '@type':'Organization', name:'Senhor das Tintas' },
              url: `${SITE}/produto/${slug}.html` }
  };

  return cabecalho({
    titulo: `${nome} | Senhor das Tintas`,
    descricao: curta,
    base: '../', canonical: `produto/${slug}.html`,
    ogImage: `assets/produtos/${slug}.jpg`
  }) + `
<script type="application/ld+json">${JSON.stringify(schema)}</script>

<div class="produto-pagina">
  <div class="wrap">
    <nav class="trilha">
      <a href="../index.html">Início</a> <span>/</span>
      <a href="../produtos.html">Produtos</a> <span>/</span>
      <a href="../produtos.html#${cat}">${esc(catNome(cat))}</a> <span>/</span>
      <b>${esc(nome)}</b>
    </nav>

    <div class="produto-detalhe">
      <div class="produto-foto">
        <img src="../assets/produtos/${slug}.jpg" alt="${esc(nome)}">
      </div>
      <div class="produto-info">
        <span class="produto-tag">${esc(catNome(cat))}</span>
        <h1>${esc(nome)}</h1>
        <p class="produto-resumo">${esc(curta)}</p>

        <div class="produto-bloco">
          <h2>Para que serve</h2>
          <p>${esc(longa)}</p>
        </div>

        <div class="produto-bloco">
          <h2>Onde se aplica</h2>
          <ul class="check-list">
${aplicacoes.map(a => `            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6"><path d="M20 6L9 17l-5-5"/></svg> ${esc(a)}</li>`).join('\n')}
          </ul>
        </div>

        <a class="btn btn-wa produto-cta" href="${WA}?text=${encodeURIComponent('Olá! Vi o produto "' + nome + '" no site e gostaria de consultar preço e disponibilidade.')}" target="_blank" rel="noopener">${ICO_WA} Consultar preço e disponibilidade</a>
        <p class="produto-aviso">Preço e estoque confirmados na hora pelo WhatsApp. Retirada na loja ou entrega em São José dos Campos.</p>
      </div>
    </div>
  </div>
</div>

${relacionados.length ? `<section class="relacionados">
  <div class="wrap">
    <div class="sec-head reveal">
      <span class="eyebrow">Da mesma categoria</span>
      <h2>Também pode te interessar</h2>
    </div>
    <div class="produtos-grid">
${relacionados.map(r => cardProduto(r, '../')).join('\n')}
    </div>
    <div class="produtos-cta reveal" style="margin-top:36px">
      <a class="btn btn-outline" href="../produtos.html#${cat}">Ver todos em ${esc(catNome(cat))}</a>
    </div>
  </div>
</section>` : ''}
` + rodape('../');
}

// ------------------------------------------------- teaser na home (entre marcadores)
function geraTeaser() {
  const tiles = CATEGORIAS.map(c => {
    const itens = PRODUTOS.filter(p => p[2] === c[0]);
    if (!itens.length) return '';
    return `        <a class="cat-tile" href="produtos.html#${c[0]}">
          <div class="cat-tile-img"><img src="assets/produtos/${itens[0][0]}.jpg" alt="${esc(c[1])}" loading="lazy"></div>
          <div class="cat-tile-txt">
            <h3>${esc(c[1])}</h3>
            <span>${itens.length} ${itens.length === 1 ? 'item' : 'itens'}</span>
          </div>
        </a>`;
  }).filter(Boolean).join('\n');

  return `<!-- INICIO-TEASER-PRODUTOS -->
<section class="teaser-produtos" id="produtos">
  <div class="wrap">
    <div class="sec-head reveal">
      <span class="eyebrow">Nossos produtos</span>
      <h2>Da preparação ao acabamento, num lugar só</h2>
      <p class="lead">São ${PRODUTOS.length} itens no catálogo, organizados por categoria &mdash; e o estoque da loja é maior que isso.</p>
    </div>
    <div class="cat-tiles reveal">
${tiles}
    </div>
    <div class="produtos-cta reveal">
      <a class="btn btn-outline" href="produtos.html">
        Ver catálogo completo
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
      </a>
    </div>
  </div>
</section>
<!-- FIM-TEASER-PRODUTOS -->`;
}

// ---------------------------------------------------------------- execucao
const RAIZ = __dirname;
const DIR_PROD = path.join(RAIZ, 'produto');
if (!fs.existsSync(DIR_PROD)) fs.mkdirSync(DIR_PROD);

// valida imagens antes de gerar
const semImagem = PRODUTOS.filter(p => !fs.existsSync(path.join(RAIZ, 'assets/produtos', p[0] + '.jpg')));
if (semImagem.length) {
  console.log('ERRO — produtos sem imagem:');
  semImagem.forEach(p => console.log('  ' + p[0]));
  process.exit(1);
}
const slugs = new Set(PRODUTOS.map(p => p[0]));
if (slugs.size !== PRODUTOS.length) { console.log('ERRO: slug duplicado'); process.exit(1); }

const orfas = fs.readdirSync(path.join(RAIZ,'assets/produtos'))
  .filter(f => f.endsWith('.jpg') && !slugs.has(f.replace('.jpg','')));
if (orfas.length) console.log('AVISO — imagens sem cadastro: ' + orfas.join(', '));

fs.writeFileSync(path.join(RAIZ,'produtos.html'), geraCatalogo());
PRODUTOS.forEach(p => fs.writeFileSync(path.join(DIR_PROD, p[0] + '.html'), geraProduto(p)));

// atualiza o teaser dentro da index.html
const idxPath = path.join(RAIZ,'index.html');
let idx = fs.readFileSync(idxPath,'utf8');
const re = /<!-- INICIO-TEASER-PRODUTOS -->[\s\S]*?<!-- FIM-TEASER-PRODUTOS -->/;
if (!re.test(idx)) { console.log('ERRO: marcadores do teaser ausentes na index.html'); process.exit(1); }
fs.writeFileSync(idxPath, idx.replace(re, geraTeaser()));
console.log('teaser da home atualizado');

// sitemap + robots
const urls = [
  { loc: `${SITE}/`, pri: '1.0' },
  { loc: `${SITE}/produtos.html`, pri: '0.9' },
  ...PRODUTOS.map(p => ({ loc: `${SITE}/produto/${p[0]}.html`, pri: '0.7' })),
];
fs.writeFileSync(path.join(RAIZ,'sitemap.xml'),
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${u.loc}</loc><priority>${u.pri}</priority></url>`).join('\n')}
</urlset>
`);
fs.writeFileSync(path.join(RAIZ,'robots.txt'),
`User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
console.log('sitemap.xml (' + urls.length + ' URLs) e robots.txt gerados');

console.log('produtos.html gerado');
console.log(PRODUTOS.length + ' paginas de produto geradas em produto/');
CATEGORIAS.forEach(c => {
  const n = PRODUTOS.filter(p => p[2] === c[0]).length;
  if (n) console.log('  ' + c[1] + ': ' + n);
});

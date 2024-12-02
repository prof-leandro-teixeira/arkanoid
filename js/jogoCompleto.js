// Seleciona a tela e define o contexto 2D
const tela = document.getElementById("jogoTela");
const ctx = tela.getContext("2d");

// Configurações gerais da tela do jogo
tela.width = 1200;  // Define a largura da tela
tela.height = 500;  // Define a altura da tela

// Variáveis da bolinha
let velocidade = 10; // Velocidade da bolinha
let bolaTamanho = 10;   // Raio da bolinha
let x = tela.width / 2; // Posição inicial horizontal da bolinha
let y = tela.height - 30; // Posição inicial vertical da bolinha
let dx = velocidade; // Velocidade horizontal da bolinha
let dy = -velocidade; // Velocidade vertical da bolinha

// Variáveis de status do jogo
let vidas = 3;  // Número inicial de vidas
let fase = 1;   // Fase inicial do jogo
let pontos = 0; // Pontuação inicial
let recorde = 0;

// Configurações da barra 
let barraAltura = 15;
let barraLargura = 110;
let barraX = (tela.width - barraLargura) / 2; // Posição inicial da barra

// Variáveis para controle das teclas de seta
let setaDireita = false;
let setaEsquerda = false;

// Configurações dos blocos
let blocoLinhas = 5;      // Número de linhas de blocos
let blocoColunas = 10;    // Número de colunas de blocos
let blocoLargura = 80;   // Largura de cada bloco
let blocoAltura = 25;     // Altura de cada bloco
let blocoPadding = 35;    // Espaço entre blocos
let topoMargem = 5;      // Margem superior para os blocos
let esquerdaMargem = 30;  // Margem à esquerda para os blocos


// Eventos de teclado para controlar a barra
document.addEventListener("keydown", teclaPressionadaHandler);
document.addEventListener("keyup", teclaSoltaHandler);

// Função chamada quando uma tecla é pressionada
function teclaPressionadaHandler(e) {
    if (e.key === "ArrowRight") {
        setaDireita = true;
    } else if (e.key === "ArrowLeft") {
        setaEsquerda = true;
    }
}

// Função chamada quando uma tecla é liberada
function teclaSoltaHandler(e) {
    if (e.key === "ArrowRight") {
        setaDireita = false;
    } else if (e.key === "ArrowLeft") {
        setaEsquerda = false;
    }
}

// Função para reiniciar a posição da bolinha
function reposicionarBola() {
    x = tela.width / 2;
    y = tela.height - 30;
    dx = 4;   // Reinicia a velocidade horizontal
    dy = -4;  // Reinicia a velocidade vertical
    setaDireita = false;
    setaEsquerda = false;
    barraX = (tela.width - barraLargura) / 2;
}

// Função para gerar uma cor hexadecimal aleatória
function gerarCorAleatoria() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

// Cria uma matriz de blocos com cores aleatórias
let blocos = [];
for (let i = 0; i < blocoColunas; i++) {
    blocos[i] = [];
    for (let j = 0; j < blocoLinhas; j++) {
        blocos[i][j] = {
            x: 0,               // Coordenada x do bloco
            y: 0,               // Coordenada y do bloco
            status: 1,          // Status (1 = ativo, 0 = destruído)
            cor: gerarCorAleatoria() // Cor aleatória para cada bloco
        };
    }
}

document.getElementById("recordeValor").innerText = recorde;

// Função para verificar colisão da bolinha com os blocos
function colisaoBlocos() {
    checarProximaFase();
    for (let i = 0; i < blocoColunas; i++) {
        for (let j = 0; j < blocoLinhas; j++) {
            let bloco = blocos[i][j];
            if (bloco.status === 1) {
                if (x > bloco.x && x < bloco.x + blocoLargura && y > bloco.y && y < bloco.y + blocoAltura) {
                    dy = -dy;
                    bloco.status = 0;
                    pontos++;
                    document.getElementById("pontosValor").innerText = pontos;
                    if (pontos >= recorde){
                        document.getElementById("recordeValor").innerText = recorde;
                    }

                    // Atualiza o recorde apenas se a pontuação for maior
                    if (pontos > recorde) {
                        recorde = pontos;
                        localStorage.setItem("recorde", recorde);
                        //document.getElementById("recordeValor").innerText = recorde;
                    }
                }
            }
        }
    }
}

// Função para registrar o recorde
function verificarRecorde() {
    // Verifica se já existe um recorde no localStorage
    let recordeSalvo = localStorage.getItem("recorde");

    // Se não houver recorde, cria um recorde inicial de 0
    if (!recordeSalvo) {
        recordeSalvo = 0;
        localStorage.setItem("recorde", recordeSalvo); // Armazena no localStorage
    }

    // Verifica se a pontuação atual é maior que o recorde
    if (pontos > recordeSalvo) {
        localStorage.setItem("recorde", pontos); // Atualiza o recorde no localStorage
        recordeSalvo = pontos; // Atualiza o recorde na variável
        document.getElementById("recordeValor").innerText = recordeSalvo; // Atualiza o display
        console.log("Novo recorde! Record: " + recordeSalvo);
    }
}

// Ao carregar a página, verificamos o recorde
window.onload = function() {
    // Recupera o recorde salvo no localStorage e atualiza a interface
    let recordeSalvo = localStorage.getItem("recorde");
    if (recordeSalvo) {
        document.getElementById("recordeValor").innerText = recordeSalvo;
    }
};

function checarProximaFase() {
    let todosBlocosDestruidos = true;
    for (let i = 0; i < blocoColunas; i++) {
        for (let j = 0; j < blocoLinhas; j++) {
            if (blocos[i][j].status === 1) {
                todosBlocosDestruidos = false;
                break;
            }
        }
    }
    if (todosBlocosDestruidos) {
        alert("Parabéns! Próxima fase!");
        fase++;
        document.getElementById("faseValor").innerText = fase;
        blocos = []; // Reinicia os blocos
        reposicionarBola()
        draw();
    }
}

// Função para desenhar a bolinha na tela
function drawBola() {
    ctx.beginPath();
    ctx.arc(x, y, bolaTamanho, 0, Math.PI * 2); // Desenha um círculo (bolinha)
    ctx.fillStyle = "#0095DD"; // Cor da bolinha
    ctx.fill();
    ctx.closePath();
}

// Função para desenhar a barra 
function drawBarra() {
    ctx.beginPath();
    ctx.roundRect(barraX, tela.height - barraAltura, barraLargura, barraAltura, 5); // Raio de arredondamento = 10
    ctx.fillStyle = "#0095DD"; // Cor da barra
    ctx.fill();
    ctx.closePath();
}

// Função para desenhar os blocos
function drawBlocos() {
    for (let i = 0; i < blocoColunas; i++) {
        for (let j = 0; j < blocoLinhas; j++) {
            if (blocos[i][j].status === 1) { // Desenha apenas blocos ativos
                let blocoX = i * (blocoLargura + blocoPadding) + esquerdaMargem;
                let blocoY = j * (blocoAltura + blocoPadding) + topoMargem;
                blocos[i][j].x = blocoX;
                blocos[i][j].y = blocoY;
                ctx.beginPath();
                ctx.roundRect(blocoX, blocoY, blocoLargura, blocoAltura, 5);
                ctx.fillStyle = blocos[i][j].cor; // Usa a cor aleatória do bloco
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

// Função principal de renderização do jogo
function draw() {
    ctx.clearRect(0, 0, tela.width, tela.height); // Limpa a tela
    drawBlocos(); // Desenha os blocos
    drawBola();   // Desenha a bolinha
    drawBarra();  // Desenha a barra
    colisaoBlocos(); // Verifica colisão com os blocos

    // Movimenta a bolinha
    x += dx;
    y += dy;

    // Detecta colisão com as bordas laterais da tela
    if (x + dx > tela.width - bolaTamanho || x + dx < bolaTamanho) {
        velocidade = 4;
        dx = -dx; // Inverte a direção horizontal
    }
    // Detecta colisão com o topo da tela
    if (y + dy < bolaTamanho) {
        velocidade = 4;
        dy = -dy; // Inverte a direção vertical
    }
    // Verifica se a bolinha atingiu a parte inferior da tela (perda de vida)
    else if (y + dy > tela.height - bolaTamanho + 2) {
        if (vidas == 0){
            alert("Fim do jogo! Suas vidas acabaram.");
            alert("Pressione qualquer tecla para jogar novamente.");
            document.location.reload(); // Reinicia o jogo
        }
        if (x > barraX + 2 && x < barraX + barraLargura + 2) {
            dy = -dy; // Rebote na barra
            if(setaDireita === true){
                dx = Math.abs(dx)+1; 
            }
            if(setaEsquerda === true){
                dx = -Math.abs(dx)-1; // Move para a direita
            }
        } else {
            vidas--; // Perde uma vida
            document.getElementById("vidasValor").innerText = vidas; // Atualiza as vidas exibidas
            if (vidas > 0) {
                alert("Você perdeu uma vida! Vidas restantes: " + vidas);
                reposicionarBola(); // Reinicia a posição da bolinha
            }
        }
    }

    // Movimenta a barra conforme o usuário pressiona as teclas
    if (setaDireita && barraX < tela.width - barraLargura) {
        barraX += 10;
    } else if (setaEsquerda && barraX > 0) {
        barraX -= 10;
    }

    // Chama a função novamente para atualizar o quadro (animação)
    requestAnimationFrame(draw);
}

// Inicia o jogo
draw();

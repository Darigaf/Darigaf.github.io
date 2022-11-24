const canvas = document.getElementById("tela");
const ctx = canvas.getContext("2d");
const tamanho_bola = 10;
const plataforma_x = 150;
const plataforma_y = 10;
const qnt_linhas = 3;
const qnt_colunas = 11;
const separacao_tijolo = 10;
const distancia_esquerda = 30;
const distancia_topo = 30;
const velocidade = 3;
const tempo = 120;
let fase = 1;
let velocidade_atual = velocidade;
let tamanho_tijolo = [];
let posicao_bola = [];
let velocidade_bola = [];
let posicao_plataforma = (canvas.width - plataforma_x) / 2;
let pontuacao = 0;
let vidas = 3;
let pontuacao_maxima = 0;
let tempo_restante = tempo-((tempo/10)*fase);
let velocidade_plataforma = 5+fase;
tempo_restante *= 100;
posicao_bola[0] = canvas.width/2;
posicao_bola[1] = canvas.height -110;
velocidade_bola[0] = -velocidade*fase;
velocidade_bola[1] = velocidade*fase;
tamanho_tijolo[0] = 80;
tamanho_tijolo[1] = 20;
var esquerda_pressionado = false;
var direita_pressionado = false;
var musica = new Audio("dance_furies.opus");
var som_batida = new Audio("som_batida.opus");
var som_morte_1 = new Audio("som_morte_1.opus");
var som_morte_2 = new Audio("som_morte_2.opus");
var som_morte_3 = new Audio("som_morte_3.opus");
var som_tijolo = new Audio("som_tijolo.opus");
var som_vitoria = new Audio("som_vitoria.opus");

musica.play();
function instanciar_tijolos(){
	const tijolos = [];
	
		for (let coluna = 0; coluna < qnt_colunas; coluna++){
			tijolos[coluna] = [];
			for (let linha = 0; linha < qnt_linhas; linha++){
				existe = Math.floor((Math.random() * (fase+1)));
				var cor_aleatoria = ('rgb(' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) +')');
				console.log(cor_aleatoria);
				tijolos[coluna][linha] = {x:0, y:0, destruido: 0, cor: cor_aleatoria};
				if(existe == 0){
					tijolos[coluna][linha] = {x:0, y:0, destruido: 1};
				} else{
					pontuacao_maxima ++;
				}
				
			}
		}
	return tijolos;
}
tijolos = instanciar_tijolos();

function desenhar_bola(){
	ctx.beginPath();
	ctx.arc(posicao_bola[0], posicao_bola[1], tamanho_bola, 20, 0, Math.PI * 2, false);
	ctx.fillStyle = "white";
	ctx.fill();
	ctx.closePath();
}

function desenhar_plataforma(){
	ctx.beginPath();
	ctx.rect(posicao_plataforma, canvas.height - plataforma_y - 100, plataforma_x, plataforma_y);
	ctx.fillStyle = "white";
	ctx.fill();
	ctx.closePath();
}

function verificar_tecla_pressionada(e){
        tecla_pressionada = e.key
        if (tecla_pressionada == 'ArrowLeft') {
                esquerda_pressionado = true;
        }else if (tecla_pressionada == 'ArrowRight') {
                direita_pressionado = true;
        }
}

function verificar_tecla_despressionada(e){
        tecla_pressionada = e.key
        if (tecla_pressionada == 'ArrowLeft') {
                esquerda_pressionado = false;
        }else if (tecla_pressionada == 'ArrowRight') {
                direita_pressionado = false;
        }
}
window.addEventListener('keydown', (e) => verificar_tecla_pressionada(e));
window.addEventListener('keyup', (e) => verificar_tecla_despressionada(e));


function detectar_colisao_paredes(){
	if(posicao_bola[0] + velocidade_bola[0] > canvas.width - tamanho_bola || posicao_bola[0] + velocidade_bola[0] < tamanho_bola) {
		velocidade_bola[0] = -velocidade_bola[0];
	}
	if(posicao_bola[1] + velocidade_bola[1] > canvas.height - tamanho_bola || posicao_bola[1] + velocidade_bola[1] < tamanho_bola) {
		velocidade_bola[1] = -velocidade_bola[1];
		vidas --;
		som_batida.play();
	}
}

function perdeu(){
	musica.pause();
	som = Math.floor((Math.random() * 3)+1);
	switch (som){
	case 1:
		som_morte_1.play();
		break;
	case 2:
		som_morte_2.play();
		break;
	case 3:
		som_morte_3.play();
	}
	
	alert("You died");
	document.location.reload();
	clearInterval(interval);

}

function vitoria(){
	som_vitoria.play()
	alert("VOCE GANHOU");
	document.location.reload();
	clearInterval(interval);

}

function passou_fase(){
	fase += 1;
	velocidade_bola[0] = velocidade*fase;
	velocidade_bola[1] = velocidade*fase;
	tijolos = instanciar_tijolos();
	tempo_restante = tempo-((tempo/10)*fase);
	tempo_restante *= 100;
	vidas += 2;
}

function detectar_colisao_plataforma(){
	if(posicao_bola[1] + velocidade_bola[1] < tamanho_bola) {
		velocidade_bola[1] = -velocidade_bola[1]
	} else if (posicao_bola[1] + velocidade_bola[1] > canvas.height - 100 - tamanho_bola){
		if (posicao_bola[0] > posicao_plataforma && posicao_bola[0] < posicao_plataforma + plataforma_x && posicao_bola[1] < canvas.height - 100 + plataforma_y) {
			velocidade_atual = +(((posicao_bola[0] - posicao_plataforma) / plataforma_x) *5) ;
			velocidade_bola[0] = velocidade_bola[0] + velocidade_atual - 2;
			velocidade_bola[1] = -velocidade_bola[1]
			if(velocidade_bola[0] > 5){
				velocidade_bola[0] = 5;
			}
		 	if (vidas < 0){
				perdeu();
			}
		}
	}

}

function detectar_colisao_tijolos(){
	for(var coluna = 0; coluna < qnt_colunas; coluna++){
		for(var linha = 0; linha < qnt_linhas; linha++){
			var tijolada = tijolos[coluna][linha];
			if (tijolada.destruido == 0){
				if (posicao_bola[0] > tijolada.x && posicao_bola[0] < tijolada.x + tamanho_tijolo[0] && posicao_bola[1] > tijolada.y && posicao_bola[1] < tijolada.y + tamanho_tijolo[1]){
					velocidade_bola[1] = -velocidade_bola[1];
					tijolada.destruido = 1;
					pontuacao += 1;
					console.log(pontuacao);
					console.log(pontuacao_maxima);
					som_tijolo.play();
					if (pontuacao === pontuacao_maxima){
						passou_fase();
						if(fase == 4){
							vitoria();
						}
					}
				}
			}
		}
	}
}

function desenhar_tijolos(){
	for(let coluna = 0; coluna < qnt_colunas; coluna++){
		for(let linha = 0; linha < qnt_linhas; linha++){
			if (tijolos[coluna][linha].destruido === 0){
				const tijolo_x = coluna * (tamanho_tijolo[0] + separacao_tijolo) + distancia_esquerda;
				const tijolo_y = linha * (tamanho_tijolo[1] + separacao_tijolo) + distancia_topo;
				tijolos[coluna][linha].x = tijolo_x;
				tijolos[coluna][linha].y = tijolo_y;
				ctx.beginPath();
				ctx.rect(tijolo_x, tijolo_y, tamanho_tijolo[0], tamanho_tijolo[1]);
				//ctx.fillStyle = 'rgb(' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255);
				ctx.fillStyle = tijolos[coluna][linha].cor;
				ctx.fill();
				ctx.closePath();
			}
		}
	}
}

function desenhar_pontuacao(){
	ctx.font = "20px Comic Sans";
	ctx.fillStyle = "gold";
	ctx.fillText("Pontuacao:" + pontuacao, 8, 20);
}
function desenhar_vidas(){
	ctx.font = "20px Comic Sans";
	ctx.fillStyle = "red";
	ctx.fillText("Vidas Restantes:" + vidas, canvas.width - 200, 20);
}
function desenhar_tempo(){
	ctx.font = "20px Comic Sans";
	ctx.fillStyle = "blue";
	ctx.fillText("Tempo Restante:" + tempo_restante/100, canvas.width/2 - 100, 20);
}
function desenhar_fase(){
	ctx.font = "20px Comic Sans";
	ctx.fillStyle = "white";
	ctx.fillText("Fase:" + fase, canvas.width - 800, 20);
}

function atualizar_tela(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	desenhar_bola();
	if(esquerda_pressionado){
		posicao_plataforma -= velocidade_plataforma;	
		if(posicao_plataforma + plataforma_x > canvas.width){
			posicao_plataforma = canvas.width - plataforma_x;
		}
	}
	if(direita_pressionado){
		posicao_plataforma += velocidade_plataforma;	
		if(posicao_plataforma < 0){
			posicao_plataforma = 0;
		}
	}
	detectar_colisao_plataforma();
	desenhar_plataforma();
	detectar_colisao_tijolos();
	desenhar_tijolos();
	detectar_colisao_paredes();
	desenhar_pontuacao();
	desenhar_vidas();
	desenhar_tempo();
	desenhar_fase();
	posicao_bola[0] += velocidade_bola[0];
	posicao_bola[1] += velocidade_bola[1];
	tempo_restante -= 1
	if (vidas < 0){
		perdeu();
	}
	if(tempo_restante < 0){
		perdeu();
	}
	console.log(velocidade_bola[0]);
}


setInterval(atualizar_tela, 10);

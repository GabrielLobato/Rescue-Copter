/* window.onload = menu();

 function menu() {

 	var menuSom = document.getElementById("somMenu");

 	menuSom.addEventListener("ended", function () { menuSom.currentTime = 0; menuSom.play(); }, false);
 	menuSom.play();
 	menuSom.muted = false;
 }*/

function start() { // Inicio da function start()

	$("#inicio").hide();
	document.getElementById("somMenu").pause();
	document.getElementById("somMenu").currentTime = 0;
	

	$("#fundoGame").append("<div id='jogador' class = 'anima1'></div>");
	$("#fundoGame").append("<div id='inimigo1' class = 'anima2'></div>");
	$("#fundoGame").append("<div id='inimigo2' ></div>");
	$("#fundoGame").append("<div id='amigo' class = 'anima3'></div>");
	$("#fundoGame").append("<div id='placar'></div>");
	$("#fundoGame").append("<div id='energia'></div>");


	//Principais variáveis do jogo
	var energiaAtual = 3;
	var fimdejogo = false;
	var atira = true;
	var pontos = 0;
	var pontosFantasma = 0;
	var salvos = 0;
	var perdidos = 0;
	var jogo = {};
	var vel = { heli: 5, mapa: 2, carro: 3 };
	var random = parseInt(Math.random() * 330);
	var TECLA = { W: 87, S: 83, D: 68, A: 65, SPACE: 32 }
	var somDisparo = document.getElementById("somDisparo");
	var somExplosao = document.getElementById("somExplosao");
	var musica = document.getElementById("musica");
	var somGameover = document.getElementById("somGameover");
	var somPerdido = document.getElementById("somPerdido");
	var somResgate = document.getElementById("somResgate");

	//Musica em loop
	musica.addEventListener("ended", function () { musica.currentTime = 0; musica.play(); }, false);
	musica.play();




	//Verifica se o usuário pressionou alguma tecla	
	jogo.pressionou = [];
	$(document).keydown(function (e) {
		jogo.pressionou[e.which] = true;
	});


	$(document).keyup(function (e) {
		jogo.pressionou[e.which] = false;
	});


	//Game Loop
	jogo.timer = setInterval(loop, 30);

	function loop() {
		movefundo();
		movejogador();
		moveinimigo1();
		moveinimigo2();
		moveamigo();
		colisao();
		placar()
		energia();
		vida();
	} // Fim game loop()


	//movimenta o fundo do jogo
	function movefundo() {

		fundo = parseInt($("#fundoGame").css("background-position"));
		$("#fundoGame").css("background-position", fundo - vel.mapa/*velMapa*/);

	} // fim movefundo()

	// movimentos do personagem
	function velocidade(velAtual, velAdicional) {

	}

	function movejogador() {

		let horizontal = parseInt($("#jogador").css("left"));
		let vertical = parseInt($("#jogador").css("top"));
		let x = "left", y = "top";


		//função das teclas
		function para(css, lado) {
			$("#jogador").css(css, lado + 0);
		}

		function upLeft(css, vai) {
			$("#jogador").css(css, vai - 10);
		}

		function downRight(css, vai,) {
			$("#jogador").css(css, vai + 10);
		}


		// teclas 
		if (jogo.pressionou[TECLA.W]) {
			if (vertical <= 10) {

				para(y, vertical);
			}
			else {
				upLeft(y, vertical);
			}

		}

		if (jogo.pressionou[TECLA.S]) {
			if (vertical >= 430) {

				para(y, vertical)
			}
			else {
				downRight(y, vertical);
			}
		}

		if (jogo.pressionou[TECLA.D]) {
			if (horizontal >= 690) {

				para(x, horizontal);
			}
			else {
				downRight(x, horizontal);
			}
		}

		if (jogo.pressionou[TECLA.A]) {
			if (horizontal <= 8) {

				para(x, horizontal);
			}
			else {
				upLeft(x, horizontal);
			}
		}

		if (jogo.pressionou[TECLA.SPACE]) {
			dispara();

		}

	} // fim movejogador()


	// define posição do inimigo 1 ao resetar
	function heliatorio() {
		random = parseInt(Math.random() * 330);
		$("#inimigo1").css("left", 694);
		$("#inimigo1").css("top", random);
	} //fim heliatorio()


	function moveinimigo1() {
		posicaoY = $("#inimigo1").css("top", random);
		posicaoX = parseInt($("#inimigo1").css("left"));
		// $("#inimigo1").css("top", posicaoY);
		posicaoY;
		$("#inimigo1").css("left", posicaoX - vel.heli);

		if (posicaoX <= 0) {

			heliatorio();
		}
	} //Fim moveinimigo1()


	function moveinimigo2() {
		let posX = parseInt($("#inimigo2").css("left"));
		$("#inimigo2").css("left", posX - vel.carro);

		if (posX <= 0) {

			$("#inimigo2").css("left", 775);

		}
	} // Fim moveinimigo2()

	function moveamigo() {

		let posX = parseInt($("#amigo").css("left"));
		$("#amigo").css("left", posX + 1);

		if (posX > 906) {

			$("#amigo").css("left", 0);

		}

	} // fim moveamigo()

	function dispara() {

		if (atira == true) {
			if (somDisparo.currentTime > 0) {

				somDisparo.pause();
				somDisparo.currentTime = 0;
			}
			somDisparo.play();
			atira = false;

			var posTiroY = parseInt($("#jogador").css("top"))
			var posTiroX = parseInt($("#jogador").css("left"))
			var tiroX = posTiroX + 190;
			var tiroY = posTiroY + 37;
			$("#fundoGame").append("<div id='disparo'></div");
			$("#disparo").css("top", tiroY);
			$("#disparo").css("left", tiroX);

			var tempoTiro = window.setInterval(fazDisparo, 30);

		}

		function fazDisparo() {

			posTiroX = parseInt($("#disparo").css("left"));
			$("#disparo").css("left", posTiroX + 15);

			if (posTiroX > 900) {
				window.clearInterval(tempoTiro);
				tempoTiro = null;
				$("#disparo").remove();
				atira = true;
			}

		} // fim fazDisparo()

	} // fim dispara()

	//colisões
	function colisao() {

		var colI1 = ($("#jogador").collision($("#inimigo1")));
		var colI2 = ($("#jogador").collision($("#inimigo2")));
		var disI1 = ($("#disparo").collision($("#inimigo1")));
		var disI2 = ($("#disparo").collision($("#inimigo2")));
		var colAmi = ($("#jogador").collision($("#amigo")));
		var i2Ami = ($("#inimigo2").collision($("#amigo")));

		// jogador com o inimigo1
		if (colI1.length > 0) {

			energiaAtual--;
			inimigo1X = parseInt($("#inimigo1").css("left"));
			inimigo1Y = parseInt($("#inimigo1").css("top"));
			explosao1(inimigo1X, inimigo1Y);

			heliatorio();
		}

		// jogador com o inimigo2 
		if (colI2.length > 0) {

			energiaAtual--;
			inimigo2X = parseInt($("#inimigo2").css("left"));
			inimigo2Y = parseInt($("#inimigo2").css("top"));
			explosao2(inimigo2X, inimigo2Y);

			$("#inimigo2").remove();

			reposicionaInimigo2();

		}

		// Disparo com o inimigo1	
		if (disI1.length > 0) {

			// velocidade += 0.1;
			pontosFantasma += 100;
			pontos += 100;
			inimigo1X = parseInt($("#inimigo1").css("left"));
			inimigo1Y = parseInt($("#inimigo1").css("top"));

			explosao1(inimigo1X, inimigo1Y);
			$("#disparo").css("left", 950);

			heliatorio();

		}

		// Disparo com o inimigo2
		if (disI2.length > 0) {

			pontosFantasma += 50;
			pontos += 50;
			inimigo2X = parseInt($("#inimigo2").css("left"));
			inimigo2Y = parseInt($("#inimigo2").css("top"));
			$("#inimigo2").remove();

			explosao2(inimigo2X, inimigo2Y);
			$("#disparo").css("left", 950);

			reposicionaInimigo2();

		}

		// jogador com o amigo
		if (colAmi.length > 0) {

			somResgate.play();
			salvos++;
			reposicionaAmigo();
			$("#amigo").remove();
			if (energiaAtual < 3) {
				energiaAtual++;
			}
		}

		//Inimigo2 com o amigo
		if (i2Ami.length > 0) {

			somPerdido.play();
			perdidos++;
			amigoX = parseInt($("#amigo").css("left"));
			amigoY = parseInt($("#amigo").css("top"));
			explosao3(amigoX, amigoY);
			$("#amigo").remove();

			reposicionaAmigo();

		}

	} //Fim colisao()


	//Explosão 1
	function explosao1(inimigo1X, inimigo1Y) {

		if (somExplosao.currentTime > 0) {
			somExplosao.pause();
			somExplosao.currentTime = 0;
		}

		somExplosao.play();
		$("#fundoGame").append("<div id='explosao1'></div");
		$("#explosao1").css("background-image", "url(imgs/explosao.png)");
		var div = $("#explosao1");
		div.css("top", inimigo1Y);
		div.css("left", inimigo1X);
		div.animate({ width: 200, opacity: 0 }, "slow");

		var tempoExplosao = window.setInterval(removeExplosao, 1000);

		function removeExplosao() {

			div.remove();
			window.clearInterval(tempoExplosao);
			tempoExplosao = null;

		}
	} // Fim da function explosao1()

	//Explosao2
	function explosao2(inimigo2X, inimigo2Y) {

		if (somExplosao.currentTime > 0) {
			somExplosao.pause();
			somExplosao.currentTime = 0;
		}

		somExplosao.play();
		$("#fundoGame").append("<div id='explosao2'></div");
		$("#explosao2").css("background-image", "url(imgs/explosao.png)");
		var div2 = $("#explosao2");
		div2.css("top", inimigo2Y);
		div2.css("left", inimigo2X);
		div2.animate({ width: 200, opacity: 0 }, "slow");

		var tempoExplosao2 = window.setInterval(removeExplosao2, 1000);

		function removeExplosao2() {

			div2.remove();
			window.clearInterval(tempoExplosao2);
			tempoExplosao2 = null;

		}
	} // Fim da funcao explosao2()

	//Explosao3
	function explosao3(amigoX, amigoY) {
		$("#fundoGame").append("<div id='explosao3' class='anima4'></div");
		$("#explosao3").css("top", amigoY);
		$("#explosao3").css("left", amigoX);
		var tempoExplosao3 = window.setInterval(resetaExplosao3, 1000);
		function resetaExplosao3() {
			$("#explosao3").remove();
			window.clearInterval(tempoExplosao3);
			tempoExplosao3 = null;

		}

	} // Fim da funcao explosao3

	//Reposiciona Inimigo2
	function reposicionaInimigo2() {

		var tempoColisao4 = window.setInterval(reposiciona4, 5000);

		function reposiciona4() {
			window.clearInterval(tempoColisao4);
			tempoColisao4 = null;

			if (fimdejogo == false) {

				$("#fundoGame").append("<div id=inimigo2></div");

			}

		}
	}

	//Reposiciona Amigo
	function reposicionaAmigo() {

		var tempoAmigo = window.setInterval(reposiciona6, 6000);

		function reposiciona6() {
			window.clearInterval(tempoAmigo);
			tempoAmigo = null;

			if (fimdejogo == false) {

				$("#fundoGame").append("<div id='amigo' class='anima3'></div>");

			}

		}

	} // Fim da funcao reposicionaAmigo()


	function placar() {

		// $("#placar").html("<h2> Pontos: " + pontos + " Salvos: " + salvos + " Perdidos: " + perdidos + "</h2>");
		$("#placar").html(`<h2> Pontos: ${pontos}  Salvos: ${salvos}  Perdidos: ${perdidos} </h2>`);
	} //fim da funcao placar()

	//Barra de energia
	function energia() {

		if (energiaAtual == 3) {

			$("#energia").css("background-image", "url(imgs/energia3.png)");
		}

		if (energiaAtual == 2) {

			$("#energia").css("background-image", "url(imgs/energia2.png)");
		}

		if (energiaAtual == 1) {

			$("#energia").css("background-image", "url(imgs/energia1.png)");
		}

		if (energiaAtual == 0) {

			$("#energia").css("background-image", "url(imgs/energia0.png)");
			gameOver();
			//Game Over
		}

	} // Fim da funcao energia()

	// recupera vida a cada 100 pontos
	function vida() {
		if (pontosFantasma >= 1000) {
			pontosFantasma -= 1000;
			vel.heli++;
			vel.mapa++;
			vel.carro += 0.5;

			if (energiaAtual < 3) {
				energiaAtual++;
				somResgate.play();
			}
		}
	}//fim vida();

	//fim de jogo
	function gameOver() {
		fimdejogo = true;
		musica.pause();
		somGameover.play();

		window.clearInterval(jogo.timer);
		jogo.timer = null;

		$("#jogador").remove();
		$("#inimigo1").remove();
		$("#inimigo2").remove();
		$("#amigo").remove();
		$("#placar").remove();
		$("#energia").remove();

		$("#fundoGame").append("<div id='fim'></div>");

		// $("#fim").html("<h1> Game Over </h1><p>Sua pontuação foi: " + pontos + "</p>" + "<div id='reinicia' onClick=reiniciaJogo()><h3>Jogar Novamente</h3></div>");
		$("#fim").html(`<h1> Game Over <h1><p>seus pontos no jogo: ${pontos} </p> <div id='reinicia' onClick = restart() <h3> Jogar Novamente</h3></div>`);
	} // Fim gameOver();

} // Fim start();

//Reinicia o Jogo	
function restart() {

	somGameover.pause();
	$("#fim").remove();
	start();

} //Fim reiniciaJogo()


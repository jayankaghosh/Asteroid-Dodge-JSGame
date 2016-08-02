window.onload = function(){


			window.onfocus = function () {
				document.body.cursor = "none";
				spaceShip.style.opacity = "1";
				pauseInfo.style.display = "none";
				isPaused = false;
				audioToggle(); 
			};

			window.onblur = function () {
				if(isPaused) return;
				document.body.cursor = "default";
				spaceShip.style.opacity = "0.3";
				pauseInfo.style.display = "block";
				isPaused = true; 
				audioToggle();
			};



			document.getElementById('info').innerHTML = getHighscore();
			document.getElementById("no").innerHTML = getCurrentScore();
			high = getHighscore();
			document.addEventListener('keypress', function(e){
				//console.log(e.keyCode);
				if(e.keyCode==109){
					if(isAudio){
						isAudio = false;
					}
					else{
						isAudio = true;
					}
					audioToggle();
				}
				else if(e.keyCode==112){
					document.body.cursor = "none";
					spaceShip.style.opacity = "1";
					if(isPaused){
						pauseInfo.style.display = "none";
						isPaused =false;
					}
					else{
						apause.play();
						document.body.cursor = "default";
						spaceShip.style.opacity = "0.3";
						pauseInfo.style.display = "block";
						isPaused = true;
					}
					audioToggle();
				}
				else if(e.keyCode == 32){
					makeBullets();
				}
			})
			aover = document.getElementById("over");
			ascore = document.getElementById("point");
			apower = document.getElementById("powerup");
			aexplode = document.getElementById("explode");
			afire = document.getElementById("fire");
			apause = document.getElementById('pause');
			abump = document.getElementById("bump");
			abg = document.getElementById("bg");
			aAsteroidExplode = document.getElementById("asteroid-explode");
			abg.loop = true;
		}

		var MAX_LIFE = 3;
		var GAME_SPEED = 12;

		var activeBullets = [];
		var health,healthBar,isPaused,pauseInfo,spaceShip;
		var totalBullets;
		var busyFlag = false,asteroidBusy = false;
		var aover,abump,ascore,abg,apower,aAsteroidExplode,aexplode,afire,apause,high;
		var playerElem,invincible=false,invincibleCounter;
		var game,animation;
		var player={};
		var scoreboard;
		var Enemy = function(){
			this.left=getRandomInt(0,window.innerWidth)+"px";
			this.padding=getRandomInt(20,70)+"px";
			if(getRandomInt(0,100)<10){
							this.friend = true;
						}
			else this.friend = false;

			if(getRandomInt(0,100)<20) this.health = true;
			else this.health = false;
		};

		function start(){
			if(isPaused) return;
			var prev_enemies = document.getElementsByClassName("enemy");
			for(var i = 0; i<prev_enemies.length; i++){
				document.body.removeChild(prev_enemies[i]);
			}
			GAME_SPEED = 12;
			isPaused = false;
			document.getElementById("no").innerHTML = getCurrentScore();
			pauseInfo = document.getElementById('pause-info');
			invincibleCounter = 0;
			totalBullets = 10;
			var bulletSpace = document.getElementById("total-bullets");
			health = MAX_LIFE;
			healthBar = document.getElementById("health-bar");
			healthBar.innerHTML = "";
			for(var i=0;i<health;i++){
				healthBar.innerHTML += "|";
			}
			bulletSpace.innerHTML = "";
			for(var i=0;i<totalBullets;i++){
				bulletSpace.innerHTML += '<img src="src/style/img/bullet.png" class="bullet-info">';
			}
			
			document.getElementById('menu').style.display = "none";
			setTimeout(function(){
				addPlayer(document.getElementById('cursor'));
			},200);
			spaceShip = document.getElementById('cursor');
			playerElem = document.getElementById("player-sprite");
			document.body.setAttribute("style", "cursor:none");
			scoreboard = document.getElementById("no");
			makeObjects();
			abg.play();
			scoreboard.innerHTML = 0;
			player.width = 25;
			player.height = 25;
			document.addEventListener('mousemove',
					function(e){
						player.x = e.clientX;
						player.y = e.clientY;
					}
				);
		}


		function stop(){
			var score = scoreboard.innerHTML;
			var highscore = getHighscore();
			document.getElementById('menu').style.display = "inline-block";
			document.getElementById('info').innerHTML = highscore;
			document.getElementById("pscore").innerHTML = "<br>Your Score : "+score;
			abg.pause();
			abg.currentTime = 0;
			aover.play();
			setHighscore(score);
			document.body.removeEventListener("click",makeBullets());
			//document.body.removeEventListener("mousemove");
			//window.location.reload();
		}

		function makeObjects(){
			game = setInterval(function(){
						if(isPaused) return;
						var newEnemy = new Enemy();
						var obj = document.createElement("span");
						obj.className = "enemy";
						obj.style.position = "absolute";
						obj.style.marginTop = "-100px";
						obj.style.marginLeft = newEnemy.left;
						obj.style.padding = newEnemy.padding;
						obj.style.backgroundImage = "url('src/style/img/asteroid.png')";
						obj.style.backgroundSize = "cover";
						if(newEnemy.friend === true){
							obj.style.backgroundImage = "url('src/style/img/friend.gif-c200')";
							obj.style.padding = "40px";
							obj.style.zIndex = "999";
							if(newEnemy.health === true){
								obj.style.backgroundImage = "url('src/style/img/heart.png')";
								obj.setAttribute("isHeart", "true");
							}
						}
						else{
							obj.style.zIndex = "998";
						}
						obj.setAttribute('MY_SPEED', getRandomInt(0,5));
						var enemy = document.body.appendChild(obj);
						animate(enemy);
					}, getRandomInt(50,200));
		}

		function animate(ele){
			var availHeight = window.innerHeight;
			var mAnimation = setInterval(
					function(){
						if(isPaused) {
								return;
						}
						animation = mAnimation;
						var ctop = ele.style.marginTop;
						ctop = ctop.substr(0,ctop.length-2);
						ctop = parseInt(ctop);
						detectCollision(ele);
						if(ctop > availHeight) {
							scoreboard.innerHTML = parseInt(scoreboard.innerHTML)+1;
							clearInterval(animation);
							document.body.removeChild(ele);
							//console.log(ele+" removed");
							if(scoreboard.innerHTML %100 == 0){
								GAME_SPEED--;
								if(GAME_SPEED < 1){
									GAME_SPEED = 1;
								}
								apower.play();
								document.getElementById("cursor").style.boxShadow = "0px 0px 30px #f0f0f0";
								setTimeout(function(){
									document.getElementById("cursor").style.boxShadow = "none";
								}, 1000);
							}
							var score = scoreboard.innerHTML;
							setHighscore(score);
						}
						ele.style.marginTop = (ctop+5)+"px";
					},
				GAME_SPEED+parseInt(ele.getAttribute('MY_SPEED')));
		}


		function simulateMKeyPress(){
			var keyboardEvent = document.createEvent("KeyboardEvent");
			var initMethod = typeof keyboardEvent.initKeyboardEvent !== 'undefined' ? "initKeyboardEvent" : "initKeyEvent";
			keyboardEvent[initMethod](
                   "keydown", // event type : keydown, keyup, keypress
                    true, // bubbles
                    true, // cancelable
                    window, // viewArg: should be window
                    false, // ctrlKeyArg
                    false, // altKeyArg
                    false, // shiftKeyArg
                    false, // metaKeyArg
                    40, // keyCodeArg : unsigned long the virtual key code, else 0
                    0 // charCodeArgs : unsigned long the Unicode character associated with the depressed key, else 0
			);
			document.dispatchEvent(keyboardEvent);
		}



		function detectCollision(ele){
			var left = parseInt(ele.style.marginLeft.substr(0,ele.style.marginLeft.length-2));
			var top = parseInt(ele.style.marginTop.substr(0,ele.style.marginTop.length-2));
			var width = parseInt(ele.style.padding.substr(0,ele.style.padding.length-2))*2;
			var height = width;

			//Bullet Collison
			if(ele.style.zIndex != "999"){
				for(var i=0; i<activeBullets.length; i++){
					var bleft = activeBullets[i].left;
					var btop = activeBullets[i].top;
					if(bleft===null||btop===null){
						continue;
					}
					if(bleft>=left&&bleft<=left+width){
						if(btop>=top&&btop<=top+height){
							ele.style.backgroundImage = "url('src/style/img/explosion.gif')";
							aAsteroidExplode.play();
							setTimeout(function(){
								document.body.removeChild(ele);
							}, 500);
							clearInterval(animation);
							return;
						}
					}
				}
			}


			if((player.x+player.width)>left&&(player.x-player.width)<(left+width)){
				if((player.y+player.height)>top&&(player.y-player.height)<(top+height)) {


					if(ele.getAttribute("isHeart") == "true"){
							if(health == MAX_LIFE) return;
							if(busyFlag) return;
							busyFlag = true;
							setTimeout(function(){
								busyFlag = false;
							}, 500);
							health++;
							if(health>MAX_LIFE) health=MAX_LIFE;
							healthBar.innerHTML = "";
							for(var i=0;i<health;i++){
								healthBar.innerHTML += "|";
							}
							apower.play();
							document.body.removeChild(ele);
							return;
					}

					if(ele.style.zIndex == "999"){
						scoreboard.innerHTML = parseInt(scoreboard.innerHTML)+2;
						ascore.play();
						ele.style.display = "none";
						document.body.style.backgroundColor = "#0000ff";
						setTimeout(function(){
									document.body.style.backgroundColor = "#ffff88";
						}, 100);
						if(busyFlag) return;
						else{
						totalBullets= parseInt(totalBullets)+1;
						if(totalBullets>10){
							totalBullets = 10;
						}
						var bulletSpace = document.getElementById("total-bullets");
						bulletSpace.innerHTML = "";
						for(var i=0;i<totalBullets;i++){
							bulletSpace.innerHTML += '<img src="src/style/img/bullet.png" class="bullet-info">';
						}
						invincibleCounter = parseInt(invincibleCounter)+1;

						document.getElementById("invincible-counter").innerHTML += "I";
						if(document.getElementById("invincible-counter").innerHTML == "IIIIII")
							document.getElementById("invincible-counter").innerHTML = "IIIII";
						busyFlag = true;
						setTimeout(function(){
								busyFlag = false;
							}, 500);
						}

						if(invincibleCounter == 5){
							invincible = true;
							var spaceship =	document.getElementById("cursor");
							spaceship.style.boxShadow = "1px 1px 50px #0000ff";
							var invcounter = document.getElementById("invincible-counter");
							invcounter.style.color = "blue";
							invcounter.style.textShadow = "1px 1px 5px #f0f0f0";
							document.body.style.backgroundImage = "url('src/style/img/invincible.jpg')";

							setTimeout(function(){
								invincibleCounter = 0;
								invincible = false;
								invcounter.style.color = "#f0f0f0";
								invcounter.innerHTML = "";
								invcounter.style.textShadow = "none";
								spaceship.style.boxShadow = "none";
								document.body.style.backgroundImage = "url('src/style/img/bg.jpg')";
							}, 5000);
						}
						return;
					}
					else if(invincible){
						return;
					}
					if(asteroidBusy) return;
					health--;
					var spaceship =	document.getElementById("cursor");
					spaceship.style.boxShadow = "5px 5px 50px #ff0000";
					setTimeout(function(){
						spaceship.style.boxShadow = "none";
					}, 200);		
					abump.play();
					healthBar.innerHTML = "";
					for(var i=0;i<health;i++){
						healthBar.innerHTML += "|";
					}
			
					asteroidBusy = true;
					setTimeout(function(){
						asteroidBusy = false;
					}, 1000);
					//console.log(health);
					if(health > 0) return;
					clearInterval(game);
					ele.style.display = "none";
					playerElem.src = "src/style/img/explosion.gif";
					aexplode.play();
					setTimeout(function(){
					playerElem.src = "src/style/img/player.png";
					stop();
					},800);
				}
			}
		}


		function getRandomInt(min, max) {
 		   return Math.floor(Math.random() * (max - min + 1)) + min;
		}

		var addPlayer = function(ele){
			document.addEventListener('mousemove',function(e){
				ele.style.position = "absolute";
				ele.style.marginLeft = e.clientX-60+"px";
				ele.style.marginTop = e.clientY-60+"px";
				document.body.style.cursor = "none";
			});
			document.addEventListener("click", function(e){
				makeBullets();
			})
		}

		function makeBullets(){
			if(isPaused) return;
			if(totalBullets==0) return;
			totalBullets--;
			if(totalBullets<0){
				totalBullets = 0;
			}
			var bulletSpace = document.getElementById("total-bullets");
			bulletSpace.innerHTML = "";
			for(var i=0;i<totalBullets;i++){
				bulletSpace.innerHTML += '<img src="src/style/img/bullet.png" class="bullet-info">';
			}
						
			var bullet = document.createElement("span");
			bullet.style.position = "absolute";
			bullet.style.padding = "5px";
			bullet.style.paddingTop = "15px";
			bullet.style.backgroundImage = "url('src/style/img/bullet.png')";
			bullet.style.backgroundSize = "cover";
			bullet.style.marginLeft = player.x-20+"px";
			bullet.style.marginTop = player.y-20+"px";
			bullet.setAttribute("bNumber", activeBullets.length);
			activeBullets.push({
				left: player.x-20,
				top: player.y-20
			});
			afire.play();
			var newBullet = document.body.appendChild(bullet);
			animateBullet(newBullet);
		}

		function animateBullet(b){
			var anim = setInterval(function(){
				if(isPaused) return;
				if(parseInt(b.style.marginTop.substr(0,b.style.marginTop.length-2))<=-40){
					clearInterval(anim);
					activeBullets[b.getAttribute("bNumber")].top = null;
					activeBullets[b.getAttribute("bNumber")].left = null;
					document.body.removeChild(b);
				}
				b.style.marginTop = parseInt(b.style.marginTop.substr(0,b.style.marginTop.length-2))-2+"px";
				activeBullets[b.getAttribute("bNumber")].top = parseInt(b.style.marginTop.substr(0,b.style.marginTop.length-2));
			}, 2);
		}




		function getHighscore() {
			var cname = "score";
		    var name = cname + "=";
		    var ca = document.cookie.split(';');
		    for(var i = 0; i <ca.length; i++) {
		        var c = ca[i];
		        while (c.charAt(0)==' ') {
		            c = c.substring(1);
		        }
		        if (c.indexOf(name) == 0) {
		            return c.substring(name.length,c.length);
		        }
		    }
		    return "0";
		}

		function getCurrentScore() {
			var cname = "cscore";
		    var name = cname + "=";
		    var ca = document.cookie.split(';');
		    for(var i = 0; i <ca.length; i++) {
		        var c = ca[i];
		        while (c.charAt(0)==' ') {
		            c = c.substring(1);
		        }
		        if (c.indexOf(name) == 0) {
		            return c.substring(name.length,c.length);
		        }
		    }
		    return "0";
		}

		function setHighscore(cvalue) {
			setCurrentScore(cvalue);
			if(parseInt(cvalue) <= parseInt(high)) return;
			var cname = "score";
		    document.cookie = cname + "=" + cvalue + "; ";
		}

		function setCurrentScore(cvalue){
			var cname = "cscore";
		    document.cookie = cname + "=" + cvalue + "; ";	
		}

		var isAudio = false;
		function audioToggle(){
			if(isPaused){
				document.getElementById('audio-toggle').innerHTML = "Audio: off";
				aover.volume = 0;
				aAsteroidExplode.volume = 0;
				ascore.volume = 0;
				apower.volume = 0;
				aexplode.volume = 0;
				afire.volume = 0;
				abump.volume = 0;
				abg.volume = 0;
				return;
			}

			if(isAudio){
				document.getElementById('audio-toggle').innerHTML = "Audio: off";
				aover.volume = 0;
				aAsteroidExplode.volume = 0;
				ascore.volume = 0;
				apower.volume = 0;
				aexplode.volume = 0;
				afire.volume = 0;
				abump.volume = 0;
				abg.volume = 0;
			}
			else{
				document.getElementById('audio-toggle').innerHTML = "Audio: on";
				aover.volume = 1;
				aAsteroidExplode.volume = 1;
				ascore.volume = 1;
				apower.volume = 1;
				aexplode.volume = 1;
				afire.volume = 1;
				abump.volume = 1;
				abg.volume = 1;
			}
		}
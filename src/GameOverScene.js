function GameOverScene(sceneManager) {
  this._sceneManager = sceneManager;
  
  this._script = new Script();
  this._script.enqueue(new Delay(this._script, 10));
  this._script.enqueue({execute: function () {SoundManager.play("game_over");}});
  this._script.enqueue(new Delay(this._script, 100));
  // --- INICIO: CÓDIGO PARA GUARDAR PUNTOS ---
    this._script.enqueue({execute: function () {
        // 1. Obtener puntaje
        var finalScore = 0;
        try {
            if (typeof Globals !== 'undefined' && Globals.player) {
                finalScore = Globals.player.getScore();
            }
        } catch(e) { console.log("Error score:", e); }

        // 2. Pedir nombre
        var name = prompt("💀 GAME OVER 💀\nPuntuación: " + finalScore + "\n\nEscribe tu nombre para el Ranking:");

        // 3. Enviar a Base de Datos
        if (name) {
            // Usamos la IP de tu servidor local
           fetch('https://battle-city-backend-rph9.onrender.com/api/score', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ jugador: name, puntos: finalScore })
            })
            .then(res => res.json())
            .then(data => {
                alert("✅ ¡Guardado! Tu ID es: " + data.id);
                sceneManager.toMainMenuScene();
            })
            .catch(err => {
                console.error(err);
                alert("❌ Error: Revisa que el servidor (node server.js) esté prendido.");
                sceneManager.toMainMenuScene();
            });
        } else {
            sceneManager.toMainMenuScene();
        }
    }});
    // --- FIN ---
};

GameOverScene.prototype.update = function () {
  this._script.update();
};

GameOverScene.prototype.draw = function (ctx) {
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  
  ctx.drawImage(ImageManager.getImage('game_over'), 128, 128);
};

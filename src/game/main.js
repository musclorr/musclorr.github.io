game.module(
    'game.main'
)
.require(
    'engine.core',
    'engine.physics',
    'engine.particle',
    'engine.audio'
)
.body(function() {
    game.System.orientation =game.System.LANDSCAPE;
    game.addAsset('media/bubble.png', 'bubble');
    game.addAsset('media/font.fnt');
    // game.addAsset('media/BUBBLE.WAV', 'plop');


Bubble = game.Sprite.extend({
  anchor: {x: 0.5, y:0.5},
  interactive: true,
  init: function(img, x, y) {
    this._super.apply(this, arguments);

    this.alpha=0.0;

    var text = new game.BitmapText(''+ nextNumber++, {font:'HelveticaNeue'});
    text.x = -35;
    text.y = -60;
    text.scale.set(4, 4);
    text.color = 'blue';

    this.addChild(text);

    var tween = new game.Tween(this);
    tween.to({alpha: 0.8}, 400);
    tween.easing(game.Tween.Easing.Quadratic.InOut);
    tween.start();


  },

  mousedown: function(ev) {
    // this.interactive= false;
    // this.alpha = 0;
    console.log(1, ev);

    // game.audio.playSound('plop');

  }

});

var nextNumber = 1;

SceneGame = game.Scene.extend({
    backgroundColor: 0xF7DD86,
    interactive: false,
    init: function() {
      this.bubbles = [];
    },
    mousedown: function(ev, x, y) {
      var i;
      var that = this;
      // console.log(2,ev);
      if (nextNumber < 10) {
        var bubble = new Bubble('bubble', ev.global.x, ev.global.y);
        this.stage.addChild(bubble);
        this.bubbles.push(bubble);
      } else {
        nextNumber = 1;

        for (i = 0; i < this.bubbles.length; i++) {
          this.bubbles[i].interactive=false;
          var tween = new game.Tween(this.bubbles[i]);
          tween.to({alpha: 0}, 600);
          tween.onComplete = function () {
            that.stage.remove(this.bubbles[i]);
          };
          // tween.easing(game.Tween.Easing.Quadratic.InOut);
          tween.start();
        }
      }
    }
});




  game.start(SceneGame, 1024 , 768);

});

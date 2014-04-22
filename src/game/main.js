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
    game.addAsset('media/homard.png', 'homard');
    game.addAsset('media/elephant.png', 'elephant');
    game.addAudio('media/BUBBLE.WAV', 'plop');



aWildHomardAppeared = function(parent) {
  var homard = new game.Sprite('homard', 1024+693,-100);
  homard.scale.set(1.4, 1.4);
  var tween = new game.Tween(homard.position);
  tween.to({x: -2*693}, 6000);
  tween.easing(game.Tween.Easing.Quadratic.InOut);
  tween.start();
  tween.onComplete = function() {
    console.log("removing homard");
    homard.remove();
  };
  parent.addChild(homard);
};
var canAddMore = true;
Bubble = game.Sprite.extend({
  anchor: {x: 0.5, y:0.5},
  interactive: true,
  init: function(img, x, y) {
    this._super.apply(this, arguments);
    this.alpha=0.0;

    game.scene.addObject(this);

    var text = new game.BitmapText(''+ nextNumber++, {font:'HelveticaNeue'});
    text.x = -35;
    text.y = -60;
    text.scale.set(4, 4);
    text.color = 'blue';
    this.addChild(text);



    canAddMore = false;
    var tween = new game.Tween(this);
    tween.to({alpha: 0.8}, 400);
    tween.easing(game.Tween.Easing.Quadratic.InOut);
    tween.start();
    tween.onComplete(function() { canAddMore = true;});


    this.body = new game.Body({
      position: {x: x, y: y},
      velocityLimit: {x: 1000, y: 1000},
      collideAgainst: 1,
      collisionGroup: 1,
      velocity: {x: Math.random()*140 - 70, y: Math.random()*140 - 70},
      mass: 1
    });
    this.body.collide = this.collide.bind(this);
    var shape = new game.Circle(100);
    this.body.addShape(shape);
    game.scene.world.addBody(this.body);


    game.audio.playSound('plop');

  },

  collide: function() {
    console.log('collide');
    // this.body.velocity.x = -this.body.velocity.x;
    return true;
  },

  update: function() {
      this.position.x = this.body.position.x;
      this.position.y = this.body.position.y;
  },

  mousedown: function(ev) {
    // this.interactive= false;
    // this.alpha = 0;
    console.log(1, ev);


  },

  removegently: function() {
    var that=this;
    this.interactive = false;
    var tween = new game.Tween(this.scale);
    tween.to({x: 0.01, y:0.01}, 400);
    tween.easing(game.Tween.Easing.Quadratic.InOut);
    tween.onComplete(function() {
      that.remove();
    });

    tween.start();
  }

});

var nextNumber = 1;

SceneGame = game.Scene.extend({
    backgroundColor: 0xF7DD86,
    interactive: false,

    init: function() {
      this.bubbles = [];
      this.world = new game.World(0, /*this.gravity*/ 0);
      this.bubbleContainer = new game.Container();
      this.stage.addChild(this.bubbleContainer);
    },
    mousedown: function(ev, x, y) {
      if (!canAddMore) {
        return;
      }

      var i;
      var that = this;
      // console.log(2,ev);
      /*
      if (Math.random() < 0.1) {
        anElephantAppeared(this.stage);
        var elephant = new game.Sprite('elephant', ev.global.x, ev.global.y);
        var tween = new game.Tween(elephant);
        tween.oncomplete = function() {
          elephant.remove();
        }
        twee.start();

      } else */
      if (nextNumber < 10) {
        var bubble = new Bubble('bubble', ev.global.x, ev.global.y);
        console.log(bubble);
        this.bubbleContainer.addChild(bubble);
        this.bubbles.push(bubble);

        if (nextNumber == 3) {
          aWildHomardAppeared(this.stage);
        }

      } else {
        nextNumber = 1;


        for (i = 0; i < this.bubbles.length; i++) {
          //this.bubbles[i].interactive=false;
          game.scene.world.removeBody(this.bubbles[i].body);
          this.bubbles[i].removegently();
          //this.stage.remove(this.bubbles[i]);
        }
        this.bubbles = [];
      }
    }
});




  game.start(SceneGame, 1024 , 768);

});

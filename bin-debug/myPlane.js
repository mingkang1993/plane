var MyPalne = (function (_super) {
    __extends(MyPalne, _super);
    function MyPalne() {
        _super.call(this);
        this.bullets = [];
        var _a = egret.MainContext.instance.stage, stageHeight = _a.stageHeight, stageWidth = _a.stageWidth;
        this._sound = RES.getRes("fire_mp3");
        this.stageHeight = stageHeight;
        this.stageWidth = stageWidth;
        this.createMyPalne();
        this.fireTimer = new egret.Timer(200);
        this.fireTimer.addEventListener(egret.TimerEvent.TIMER, this.createBullet, this);
        this.addEventListener(egret.Event.ENTER_FRAME, this.diffSetBulletXY, this);
        this.fire();
    }
    var d = __define,c=MyPalne,p=c.prototype;
    p.diffSetBulletXY = function () {
        var _this = this;
        this.bullets.forEach(function (item, index) {
            if (item.y < 0) {
                _this.removeChild(item);
                _this.bullets.splice(index, 1);
                return;
            }
            item.y -= 50;
        });
    };
    p.createBullet = function () {
        var self = this;
        if (self._MyPalne) {
            this._sound.play(0, 1);
            createBitmapByName("my_bullet_png", function () {
                this.x = self._MyPalne.x + config.myPlane.width / 2;
                this.y = self._MyPalne.y - config.myPlane.height / 2;
                self.addChild(this);
                self.bullets.push(this);
            });
        }
    };
    p.createMyPalne = function () {
        var _self = this;
        this._MyPalne = createBitmapByName(config.myPlane.name, function () {
            this.y = _self.stageHeight - 200;
            this.x = _self.stageWidth / 2 - 50;
            this.width = config.myPlane.width;
            this.height = config.myPlane.height;
        });
        this.addChild(this._MyPalne);
    };
    d(p, "myPalneBullets"
        ,function () {
            return this.bullets;
        }
    );
    p.removeBullet = function (myPalneBulletItem, myPalneBulletIndex) {
        this.bullets.splice(myPalneBulletIndex, 1);
        this.removeChild(myPalneBulletItem);
    };
    /**开火*/
    p.fire = function () {
        this.fireTimer.start();
    };
    p.setMyPlaneXY = function (e) {
        try {
            var offsetWidth = this._MyPalne.width / 2, offsetHeight = this._MyPalne.height / 2;
            if (!this._MyPalne ||
                e.localX <= offsetWidth ||
                e.localX >= this.stageWidth - offsetWidth ||
                e.localY <= offsetHeight ||
                e.localY >= this.stageHeight - offsetHeight) {
                return;
            }
            this._MyPalne.x = e.localX - config.myPlane.width / 2;
            this._MyPalne.y = e.localY - config.myPlane.height / 2;
        }
        catch (e) {
        }
    };
    p.diffCollision = function (enemyPalnes) {
        var _this = this;
        enemyPalnes.forEach(function (item, index) {
            var itemPlane = item["plane"], itemBullets = item["bullet"];
            itemBullets.forEach(function (itemBullet, itemBulletIndex) {
                if (_this._MyPalne && hitTest(_this._MyPalne, itemBullet)) {
                    var death = config.myPlane.death, deathData = RES.getRes(death + "_json"), deathTexture = RES.getRes(death + "_png"), mcf = new egret.MovieClipDataFactory(deathData, deathTexture), mc_1 = new egret.MovieClip(mcf.generateMovieClipData('my_plane'));
                    mc_1.x = _this._MyPalne.x;
                    mc_1.y = _this._MyPalne.y;
                    _this.addChild(mc_1);
                    mc_1.play();
                    mc_1.addEventListener(egret.Event.COMPLETE, function () {
                        _this.removeChild(mc_1);
                    }, _this);
                    _this.removeChild(_this._MyPalne);
                    _this._MyPalne = null;
                    _this.dispatchEventWith(GAME_OVER);
                }
            });
        });
    };
    return MyPalne;
}(egret.DisplayObjectContainer));
egret.registerClass(MyPalne,'MyPalne');
//# sourceMappingURL=myPlane.js.map
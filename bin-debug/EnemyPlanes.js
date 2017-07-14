var EnemyPlanes = (function (_super) {
    __extends(EnemyPlanes, _super);
    function EnemyPlanes() {
        _super.call(this);
        this._enemyPlanes = [];
        var _a = egret.MainContext.instance.stage, stageHeight = _a.stageHeight, stageWidth = _a.stageWidth;
        this.stageHeight = stageHeight;
        this.stageWidth = stageWidth;
        this.createAddEventListener();
    }
    var d = __define,c=EnemyPlanes,p=c.prototype;
    p.createAddEventListener = function () {
        this.fireTimer = new egret.Timer(config.enemyPlane.createPlaneTime);
        this.fireTimer.addEventListener(egret.TimerEvent.TIMER, this.createEnemyPlanes, this);
        this.fireBulletsTimer = new egret.Timer(config.enemyPlane.bulletTime);
        this.fireBulletsTimer.addEventListener(egret.TimerEvent.TIMER, this.diffCreateEnemyBullets, this);
        this.addEventListener(egret.Event.ENTER_FRAME, this.diffSetEnemyPlanesXY, this);
        this.fireTimer.start();
        this.fireBulletsTimer.start();
    };
    p.diffBulletY = function (item, index) {
        var itemPlane = item["plane"], itemBullet = item["bullet"];
        if (itemBullet.y > this.stageHeight) {
            this.removeChild(itemBullet);
            !itemPlane && this._enemyPlanes.splice(index, 1);
        }
        else {
            itemBullet.forEach(function (bulletItem) {
                bulletItem.y += 20;
            });
        }
    };
    p.diffPlanesY = function (itemPlane, index) {
        if (!itemPlane) {
            return;
        }
        if (itemPlane.y > this.stageHeight * 2) {
            this.removeChild(itemPlane);
            this._enemyPlanes.splice(index, 1);
        }
        else {
            itemPlane.y += 12;
        }
    };
    p.diffSetEnemyPlanesXY = function () {
        var _this = this;
        this._enemyPlanes.forEach(function (item, index) {
            _this.diffBulletY(item, index);
            _this.diffPlanesY(item["plane"], index);
        });
    };
    p.diffCreateEnemyBullets = function () {
        var _this = this;
        this._enemyPlanes.forEach(function (item, index) {
            var itemPlane = item["plane"], itemBullet = item["bullet"];
            itemPlane && itemBullet.push(_this.createEnemyBullets(itemPlane.x, itemPlane.y + itemBullet.length * 10, itemPlane.width));
        });
    };
    p.createEnemyBullets = function (x, y, width) {
        var _self = this;
        return createBitmapByName("bullet1_png", function () {
            this.x = x + width / 2;
            this.y = y + 100 / 2;
            _self.addChild(this);
        });
    };
    p.createEnemyPlanes = function () {
        var _a = config.enemyPlane, minPlane = _a.minPlane, maxPlane = _a.maxPlane, info = _a.info, num = random(minPlane, maxPlane), _self = this;
        var _loop_1 = function(i) {
            var _planeIndex = random(0, info.length - 1), _planeInfo = info[_planeIndex];
            createBitmapByName(_planeInfo.name, function () {
                this.x = random(0, _self.stageWidth);
                this.y = -random(0, 500);
                this.imageKey = _planeInfo.name.replace(/\_(jpg|jpeg|png|bmp)$/, "");
                this.life = _planeInfo.life; //飞机的生命值
                if (this.x + _planeInfo.width > _self.stageWidth) {
                    this.x -= _planeInfo.width;
                }
                var bullet = _self.createEnemyBullets(this.x, this.y, this.width);
                _self.addChild(this);
                _self._enemyPlanes.push({
                    plane: this,
                    bullet: [bullet]
                });
            });
        };
        for (var i = 0; i < num; i++) {
            _loop_1(i);
        }
    };
    d(p, "enemyPlanes"
        ,function () {
            return this._enemyPlanes;
        }
    );
    p.diffCollision = function (myPalneBullets, hitCallback) {
        var _this = this;
        if (hitCallback === void 0) { hitCallback = function (item, myPalneBulletIndex) { }; }
        myPalneBullets.forEach(function (item, myPalneBulletIndex) {
            _this._enemyPlanes.forEach(function (enemyItem, enemyIndex) {
                var enemyPlane = enemyItem["plane"];
                if (enemyPlane && hitTest(enemyPlane, item) && enemyPlane.y > 0) {
                    hitCallback(item, myPalneBulletIndex);
                    if (enemyPlane.life > 0) {
                        enemyPlane.life--;
                        return;
                    }
                    var deathAssetsKey = enemyPlane.imageKey + "_down", deathData = RES.getRes(deathAssetsKey + "_json"), deathTexture = RES.getRes(deathAssetsKey + "_png"), mcf = new egret.MovieClipDataFactory(deathData, deathTexture), mc_1 = new egret.MovieClip(mcf.generateMovieClipData('enemy'));
                    mc_1.x = enemyPlane.x;
                    mc_1.y = enemyPlane.y;
                    _this.addChild(mc_1);
                    mc_1.play();
                    mc_1.addEventListener(egret.Event.COMPLETE, function () {
                        _this.removeChild(mc_1);
                    }, _this);
                    _this.removeChild(enemyPlane);
                    delete _this._enemyPlanes[enemyIndex]["plane"];
                }
            });
        });
    };
    return EnemyPlanes;
}(egret.DisplayObjectContainer));
egret.registerClass(EnemyPlanes,'EnemyPlanes');
//# sourceMappingURL=EnemyPlanes.js.map
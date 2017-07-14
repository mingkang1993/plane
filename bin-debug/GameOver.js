var GameOver = (function (_super) {
    __extends(GameOver, _super);
    function GameOver() {
        _super.call(this);
        var _a = egret.MainContext.instance.stage, stageHeight = _a.stageHeight, stageWidth = _a.stageWidth;
        this.stageWidth = stageWidth;
        this.stageHeight = stageHeight;
        this.createGameOver();
    }
    var d = __define,c=GameOver,p=c.prototype;
    p.createGameOver = function () {
        var _self = this;
        _self.graphics.beginFill(0xffffff, 0.4);
        _self.graphics.drawRect(0, 0, _self.stageWidth, _self.stageHeight);
        _self.graphics.endFill();
        RES.getRes("game_over_mp3").play(0, 1);
        createBitmapByName("btn_restart_png", function () {
            var _a = config.gameOver.btnRestart, width = _a.width, height = _a.height;
            this.touchEnabled = true;
            this.x = _self.stageWidth / 2 - width / 2;
            this.y = _self.stageHeight / 2 - height / 2;
            this.once(egret.TouchEvent.TOUCH_TAP, _self.restartClick, _self);
            _self.addChild(this);
        });
    };
    p.restartClick = function () {
        this.dispatchEventWith(RESTART);
    };
    return GameOver;
}(egret.Sprite));
egret.registerClass(GameOver,'GameOver');
//# sourceMappingURL=GameOver.js.map
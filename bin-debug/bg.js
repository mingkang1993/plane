var Bg = (function (_super) {
    __extends(Bg, _super);
    function Bg() {
        _super.call(this);
        this.bgRollIndex = 1;
        this.bgs = [];
        var _a = egret.MainContext.instance.stage, stageHeight = _a.stageHeight, stageWidth = _a.stageWidth;
        this.stageWidth = stageWidth;
        this.stageHeight = stageHeight;
        this.init();
    }
    var d = __define,c=Bg,p=c.prototype;
    p.createBitmap = function (bgName, isTwoBg) {
        var self = this;
        createBitmapByName(bgName, function () {
            var bgEase = config.bgEase;
            var tweenOpt = { y: self.stageHeight };
            this.width = self.stageWidth;
            this.height = self.stageHeight;
            if (isTwoBg) {
                this.y = -self.stageHeight + 20;
                tweenOpt["y"] = self.stageHeight;
                bgEase = bgEase * 2;
            }
            self.addChild(this);
            egret.Tween.get(this).to(tweenOpt, bgEase).call(self.onComplete, self, [isTwoBg]); //设置回调函数及作用域，可用于侦听动画完成
        });
    };
    p.init = function () {
        var isTwoBg = true;
        var num = this.bgRollIndex - 2; //每屏渲染2个背景出来
        for (var i = this.bgRollIndex; i > num; i--) {
            this.createBitmap(config.bgs[i], isTwoBg);
            if (isTwoBg) {
                isTwoBg = false;
            }
        }
    };
    p.onComplete = function (isOneAnimateEnd) {
        this.bgRollIndex++;
        var nextBgName = config.bgs[this.bgRollIndex - 1];
        if (!nextBgName) {
            this.bgRollIndex = 0;
            nextBgName = config.bgs[this.bgRollIndex];
        }
        isOneAnimateEnd && this.removeChildAt(0);
        this.createBitmap(nextBgName, true);
    };
    return Bg;
}(egret.DisplayObjectContainer));
egret.registerClass(Bg,'Bg');
//# sourceMappingURL=bg.js.map
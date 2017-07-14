class Bg extends egret.DisplayObjectContainer {
    private stageWidth:number;
    private stageHeight:number;
    private bgRollIndex:number = 1;
    private bgs:Array<egret.Tween> = [];

    public constructor (){
        super();
        const { stageHeight,stageWidth } = egret.MainContext.instance.stage;

        this.stageWidth = stageWidth;
        this.stageHeight = stageHeight;
        
        this.init();
    }

    private createBitmap (bgName:string,isTwoBg:boolean){
        const self = this;
        
        createBitmapByName(bgName,function(){
            var bgEase = config.bgEase;  
            const tweenOpt:Object = {y:self.stageHeight};
            
            this.width = self.stageWidth;
            this.height = self.stageHeight;

            if(isTwoBg){
                this.y = -self.stageHeight + 20;
                tweenOpt["y"] = self.stageHeight;
                bgEase = bgEase * 2;
            }

            self.addChild(this);
            egret.Tween.get(this).to(tweenOpt, bgEase ).call(self.onComplete, self,[isTwoBg]);//设置回调函数及作用域，可用于侦听动画完成
        });

    }

    private init (){
        var isTwoBg = true;
        const num:number = this.bgRollIndex - 2; //每屏渲染2个背景出来

        for(let i = this.bgRollIndex;i > num;i--){
            this.createBitmap(config.bgs[i],isTwoBg);
            if(isTwoBg){
                isTwoBg = false;
            }
        }
    }

    private onComplete (isOneAnimateEnd:boolean){
        this.bgRollIndex++;
        var nextBgName = config.bgs[this.bgRollIndex - 1];
        if(!nextBgName){
            this.bgRollIndex = 0;
            nextBgName = config.bgs[this.bgRollIndex];
        }
        isOneAnimateEnd && this.removeChildAt(0);
        this.createBitmap(nextBgName,true)
    }
}

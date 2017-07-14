class GameOver extends egret.Sprite{
    private _gameOver:egret.Bitmap;
    private stageWidth:number;
    private stageHeight:number;

    public constructor (){
        super();
        const { stageHeight,stageWidth } = egret.MainContext.instance.stage;

        this.stageWidth = stageWidth;
        this.stageHeight = stageHeight;
        this.createGameOver();
    }
    
    private createGameOver ():void{
        const _self = this;

        _self.graphics.beginFill(0xffffff,0.4);
        _self.graphics.drawRect(0, 0, _self.stageWidth, _self.stageHeight);
        _self.graphics.endFill();

        RES.getRes("game_over_mp3").play(0,1);

        createBitmapByName("btn_restart_png",function(){
            const { width,height } = config.gameOver.btnRestart;

            this.touchEnabled = true;
            this.x = _self.stageWidth / 2 - width / 2;
            this.y = _self.stageHeight / 2 - height / 2;
            this.once(egret.TouchEvent.TOUCH_TAP,_self.restartClick,_self)
            _self.addChild(this);
        });  
    }
    
    private restartClick ():void{
        this.dispatchEventWith(RESTART);
    }
}
class MyPalne extends egret.DisplayObjectContainer {
    private _MyPalne:egret.Bitmap;
    private _sound:egret.Sound;  
    private fireTimer:egret.Timer;
    private bullets:Array<egret.Bitmap> = [];
    private stageHeight:number;
    private stageWidth:number;

    public constructor (){
        super();
        const { stageHeight,stageWidth } = egret.MainContext.instance.stage;
        this._sound = RES.getRes("fire_mp3");
        this.stageHeight = stageHeight;
        this.stageWidth = stageWidth;

        this.createMyPalne();
        
        this.fireTimer = new egret.Timer(200);
        this.fireTimer.addEventListener(egret.TimerEvent.TIMER,this.createBullet,this);
        this.addEventListener(egret.Event.ENTER_FRAME,this.diffSetBulletXY,this);
        this.fire();
    }

    private diffSetBulletXY ():void{
        this.bullets.forEach((item,index) => {
            if(item.y < 0){
                this.removeChild(item);
                this.bullets.splice(index,1);
                return;
            }
            item.y -= 50;
        });
    }

    private createBullet (){
        const self = this;

        if(self._MyPalne){
            this._sound.play(0,1);

            createBitmapByName("my_bullet_png",function(){
                this.x = self._MyPalne.x + config.myPlane.width / 2;
                this.y = self._MyPalne.y - config.myPlane.height / 2;
                self.addChild(this);
                self.bullets.push(this);
            });
        }
    }

    private createMyPalne (){
        const _self = this;

        this._MyPalne = createBitmapByName(config.myPlane.name,function(){
            this.y = _self.stageHeight - 200;
            this.x = _self.stageWidth / 2 - 50;
            this.width = config.myPlane.width;
            this.height = config.myPlane.height;
        });
        this.addChild(this._MyPalne);
    }

    public get myPalneBullets (){
        return this.bullets;
    }

    public removeBullet (myPalneBulletItem,myPalneBulletIndex){
        this.bullets.splice(myPalneBulletIndex,1);
        this.removeChild(myPalneBulletItem);
    }
    /**开火*/
    public fire():void {
        this.fireTimer.start();
    }

    public setMyPlaneXY (e:egret.TouchEvent){
        try{
            const offsetWidth = this._MyPalne.width  / 2,
                offsetHeight = this._MyPalne.height  / 2;

            if(
                !this._MyPalne || 
                e.localX <= offsetWidth || 
                e.localX >= this.stageWidth - offsetWidth || 
                e.localY <= offsetHeight || 
                e.localY >= this.stageHeight - offsetHeight
            ){
                return;
            }
            
            this._MyPalne.x = e.localX - config.myPlane.width / 2;
            this._MyPalne.y = e.localY - config.myPlane.height / 2;
        }catch(e){
            
        }
    }

    public diffCollision (enemyPalnes:Array<Object>){  //碰撞监测，提供被调用
        enemyPalnes.forEach((item,index) => {
            const itemPlane:egret.Bitmap = item["plane"],
                itemBullets:Array<egret.Bitmap> = item["bullet"];

            itemBullets.forEach((itemBullet,itemBulletIndex) => {       //如果坠机了
                if(this._MyPalne && hitTest( this._MyPalne, itemBullet)){
                    let { death } = config.myPlane,
                        deathData = RES.getRes(`${death}_json`),
                        deathTexture = RES.getRes(`${death}_png`),
                        mcf:egret.MovieClipDataFactory = new egret.MovieClipDataFactory(deathData,deathTexture),
                        mc:egret.MovieClip = new egret.MovieClip( mcf.generateMovieClipData('my_plane'));

                    mc.x = this._MyPalne.x;
                    mc.y = this._MyPalne.y;
                    this.addChild(mc);
                    mc.play();
                    mc.addEventListener(egret.Event.COMPLETE, ()=>{
                        this.removeChild(mc);
                    }, this);

                    this.removeChild(this._MyPalne);
                    this._MyPalne = null;
                    this.dispatchEventWith(GAME_OVER);
                }
            });   
        });
    }
}


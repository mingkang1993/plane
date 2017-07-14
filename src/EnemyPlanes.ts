class EnemyPlanes extends egret.DisplayObjectContainer {
    private _enemyPlanes:Array<Object> = [];
    private fireTimer:egret.Timer;
    private fireBulletsTimer:egret.Timer;
    private stageWidth:number;
    private stageHeight:number;

    public constructor (){
        super();
        const { stageHeight,stageWidth } = egret.MainContext.instance.stage;
        this.stageHeight = stageHeight;
        this.stageWidth = stageWidth;

        this.createAddEventListener();
    }

    private createAddEventListener ():void{
        this.fireTimer = new egret.Timer(config.enemyPlane.createPlaneTime);
        this.fireTimer.addEventListener(egret.TimerEvent.TIMER,this.createEnemyPlanes,this);

        this.fireBulletsTimer = new egret.Timer(config.enemyPlane.bulletTime);
        this.fireBulletsTimer.addEventListener(egret.TimerEvent.TIMER,this.diffCreateEnemyBullets,this);
        
        this.addEventListener(egret.Event.ENTER_FRAME,this.diffSetEnemyPlanesXY,this);
        this.fireTimer.start();
        this.fireBulletsTimer.start();
    }

    private diffBulletY (item:Object,index){      //改变子弹位置
        const itemPlane = item["plane"],
              itemBullet = item["bullet"];

        if(itemBullet.y > this.stageHeight){
            this.removeChild(itemBullet);
            !itemPlane && this._enemyPlanes.splice(index,1);
        }else{
            itemBullet.forEach(bulletItem => {
                bulletItem.y += 20;
            });
        }
    }

    private diffPlanesY (itemPlane:egret.Bitmap,index){    //改变飞机位置
        if(!itemPlane){
            return;
        }

        if(itemPlane.y > this.stageHeight * 2){  // 不＊2 删除会抖动一下
            this.removeChild(itemPlane);
            this._enemyPlanes.splice(index,1);
        }else{
            itemPlane.y += 12;
        }
    }

    private diffSetEnemyPlanesXY ():void{       //改变飞机子弹位置
        this._enemyPlanes.forEach((item,index) => {
            this.diffBulletY(item,index);
            this.diffPlanesY(item["plane"],index);
        });
    }

    private diffCreateEnemyBullets (){  //没过几秒射出子弹
        this._enemyPlanes.forEach((item,index) => {
            const itemPlane = item["plane"],
                  itemBullet = item["bullet"];

            itemPlane && itemBullet.push(this.createEnemyBullets(itemPlane.x,itemPlane.y+ itemBullet.length * 10,itemPlane.width));
        });
    }

    private createEnemyBullets (x:number,y:number,width:number){ //创建子弹
        const _self = this;
        
        return createBitmapByName("bullet1_png",function(){
            this.x = x + width / 2;
            this.y = y + 100 / 2;
            _self.addChild(this);
        });
    }

    private createEnemyPlanes ():void{  //创建飞机
        const { minPlane,maxPlane,info } = config.enemyPlane,
              num:number = random(minPlane,maxPlane),
              _self = this;
        
        for(let i = 0;i<num;i++){
            let _planeIndex = random(0,info.length - 1),
                _planeInfo = info[_planeIndex];
            createBitmapByName(_planeInfo.name,function(){
                this.x = random(0,_self.stageWidth);
                this.y = -random(0,500);
                this.imageKey = _planeInfo.name.replace(/\_(jpg|jpeg|png|bmp)$/,"");
                this.life = _planeInfo.life;    //飞机的生命值

                if(this.x + _planeInfo.width > _self.stageWidth){
                    this.x -= _planeInfo.width;
                }
                
                const bullet = _self.createEnemyBullets(this.x,this.y,this.width);
                _self.addChild(this);

                _self._enemyPlanes.push({
                    plane: this,
                    bullet: [bullet]
                });
            });
        }
    }

    public get enemyPlanes (){
        return this._enemyPlanes;
    }

    public diffCollision (myPalneBullets:Array<egret.Bitmap>,hitCallback=(item:egret.Bitmap,myPalneBulletIndex:number)=>{}){  //碰撞监测，提供被调用
        myPalneBullets.forEach((item,myPalneBulletIndex) => {
            this._enemyPlanes.forEach((enemyItem,enemyIndex) => {
                const enemyPlane = enemyItem["plane"];
                if(enemyPlane && hitTest( enemyPlane, item) && enemyPlane.y > 0){
                    hitCallback(item,myPalneBulletIndex);
                    if(enemyPlane.life > 0){
                        enemyPlane.life--;
                        return;
                    }

                    let deathAssetsKey = `${enemyPlane.imageKey}_down`,
                        deathData = RES.getRes(`${deathAssetsKey}_json`),
                        deathTexture = RES.getRes(`${deathAssetsKey}_png`),
                        mcf:egret.MovieClipDataFactory = new egret.MovieClipDataFactory(deathData,deathTexture),
                        mc:egret.MovieClip = new egret.MovieClip( mcf.generateMovieClipData('enemy'));
                  
                    mc.x = enemyPlane.x;
                    mc.y = enemyPlane.y;
                    this.addChild(mc);
                    mc.play();
                    mc.addEventListener(egret.Event.COMPLETE, ()=>{
                        this.removeChild(mc);
                    }, this);
                    this.removeChild(enemyPlane);
                    delete this._enemyPlanes[enemyIndex]["plane"];
                } 
            });
        });
    }

}
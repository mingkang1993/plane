function createBitmapByName(name:string,callback=()=>{}):egret.Bitmap {
    let result = new egret.Bitmap();
    let texture:egret.Texture = RES.getRes(name);
    result.texture = texture;
    callback.call(result);
    return result;
}

function extend(p:Object, c:Object) {
　　var c = c || {};
　　for (var i in p) {
　　　　if (typeof p[i] === 'object') {
　　　　　　c[i] = (p[i].constructor === Array) ? [] : {};
          extend(p[i], c[i]);
　　　　} else {
　　　　　　　c[i] = p[i];
　　　　}
　　}
　　return c;
}

function random(min:number,max:number){
    const r:number = Math.random() * (max - min),
          re:number = Math.round(r + min);
             
    return  Math.max(Math.min(re, max), min)
}

/**基于矩形的碰撞检测*/
function hitTest(obj1:egret.DisplayObject,obj2:egret.DisplayObject):boolean
{
    var rect1:egret.Rectangle = obj1.getBounds();
    var rect2:egret.Rectangle = obj2.getBounds();
    rect1.x = obj1.x;
    rect1.y = obj1.y;
    rect2.x = obj2.x;
    rect2.y = obj2.y;
    return rect1.intersects(rect2);
}
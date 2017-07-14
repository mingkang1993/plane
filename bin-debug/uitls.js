function createBitmapByName(name, callback) {
    if (callback === void 0) { callback = function () { }; }
    var result = new egret.Bitmap();
    var texture = RES.getRes(name);
    result.texture = texture;
    callback.call(result);
    return result;
}
function extend(p, c) {
    var c = c || {};
    for (var i in p) {
        if (typeof p[i] === 'object') {
            c[i] = (p[i].constructor === Array) ? [] : {};
            extend(p[i], c[i]);
        }
        else {
            c[i] = p[i];
        }
    }
    return c;
}
function random(min, max) {
    var r = Math.random() * (max - min), re = Math.round(r + min);
    return Math.max(Math.min(re, max), min);
}
/**基于矩形的碰撞检测*/
function hitTest(obj1, obj2) {
    var rect1 = obj1.getBounds();
    var rect2 = obj2.getBounds();
    rect1.x = obj1.x;
    rect1.y = obj1.y;
    rect2.x = obj2.x;
    rect2.y = obj2.y;
    return rect1.intersects(rect2);
}
//# sourceMappingURL=uitls.js.map
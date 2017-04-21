/**
 * Created by dhl on 2017/4/18.
 */
// 3.通用函数
function g(selector){
    var method = selector.substr(0,1) == '.'?'getElementsByClassName':'getElementById';
    return document[method](selector.substr(1));
}
// 4.输出所有的电影海报
var data = data;
function addPhotos(){
    var template = g("#wrap").innerHTML;
    var html = [];
    var nav = [];
    for (var s=0; s < data.length-1; s++) {
        var _html = template.replace('{{index}}',s)
            .replace('{{img}}',data[s].img)
            .replace('{{caption}}',data[s].caption)
            .replace('{{desc}}',data[s].desc);
        html.push( _html );
        nav.push('<span id="nav_'+s+'" onclick="turn(g(\'#photo_'+s+'\'))" class="i"></span>');
    }
    html.push('<div class="nav">'+nav.join('')+'</div>');
    g("#wrap").innerHTML = html.join('');
    resort(random([0,data.length]));
}
addPhotos();
// 7.计算左右分区取值范围
function range(){
    var range = {
        left:{x:[],y:[]},
        right:{x:[],y:[]}
    };
    var wrap = {
        w:g('#wrap').clientWidth,
        h:g('#wrap').clientHeight
    }
    var photo = {
        w:g('.photo')[0].clientWidth,
        h:g('.photo')[0].clientHeight
    }
    range.wrap = wrap;
    range.photo = photo;
    // range.left.x = [0-photo.w, wrap.w/2-photo.w/2];
    range.left.x = [0-photo.w, wrap.w/2-photo.w];
    range.left.y = [0-photo.h, wrap.h];
    range.right.x = [wrap.w/2+photo.w/2, wrap.w+photo.w];
    range.right.y = range.left.y;
    return range;
}
// 5.排序海报
function resort(n){
                var _photo = g('.photo');
    var photos = [];
    for(var i=0;i<_photo.length;i++){
        _photo[i].className = _photo[i].className.replace(/\s*photo_center\s*/,' ');
        _photo[i].style.transform = 'scale(1.3)';
        photos.push(_photo[i]);
    }
    var photo_center = g('#photo_'+n);
    photo_center.className +=' photo_center';
    photo_center = photos.splice(n,1)[0];
    // 把海报分为左右两个部分
    var photos_left = photos.splice(0,Math.ceil(photos.length/2));
    var photos_right = photos;
    var ranges = range();
    for (var i = 0; i < photos_left.length; i++) {
        var photo = photos_left[i];
        photo.style.left = random(ranges.left.x) + "px";
        photo.style.top = random(ranges.left.y) + "px";
        photo.style['transform']='rotate('+ random([-45,45])+'deg) scale(1)';
    }
    for (var i = 0; i < photos_right.length; i++) {
        var photo = photos_right[i];
        photo.style.left = random(ranges.right.x) + "px";
        photo.style.top = random(ranges.right.y) + "px";
        photo.style['transform']='rotate('+ random([-45,45])+'deg) scale(1)';
    }
    // 控制按钮处理
    var navs = g('.i');
    for (var i = 0; i < navs.length; i++) {
        navs[i].className = navs[i].className.replace(/\s*i_current\s*/,' ');
        navs[i].className = navs[i].className.replace(/\s*i_back\s*/,' ');
    }
    g('#nav_'+n).className += ' i_current ';
}
// 6.随机生成一个具有取值范围的数字1-20
function random(range){
    var max = Math.max(range[0],range[1]);
    var min = Math.min(range[0],range[1]);
    var diff = max - min;
    var number = Math.floor(Math.random()*diff + min);
    return number;
}
// 1.翻转控制
function turn(elem){
    var cls = elem.className;
    var n = elem.id.split('_')[1];
    if(!/photo_center/.test(cls)){
        g("#photo_"+n).style.left='';
        g("#photo_"+n).style.top='';
        g("#photo_"+n).style.transform='rotate(0deg)';
        return resort(n);
    }
    if(/photo_front/.test(cls)){
        cls = cls.replace(/photo_front/,'photo_back');
        g('#nav_'+n).className += ' i_back';
    }else{
        cls = cls.replace(/photo_back/,'photo_front');
        g('#nav_'+n).className = g('#nav_'+n).className.replace(/\s*i_back\s*/,' ');
    }
    return elem.className = cls;
}
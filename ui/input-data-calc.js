/**
MIT License

Copyright (c) 2018  遊手好閒的石頭成 <shirock.tw@gmail.com> rocksaying.tw

DataCalc

Compatibility: Morden HTML5 browser. MS IE8 ~ IE11.
 */

/**
HTML5 的 querySelectorAll 回傳的是可迭代結果，可配合 for-of 語法也提供 forEach 方法。
但 IE (8~11) 雖然也提供 querySelectorAll 方法，其結果卻不包含 forEach 方法。 IE 也不支持 for-of 語法。
所以我在需要相容 IE 的場合，習慣用這個函數走訪 querySelectorAll 的結果。
 */
if (!window.forEach) {
function forEach(nodes, callback) {
    var i;
    for (i = 0; i < nodes.length; ++i) {
        callback(nodes[i], i, nodes);
    }
}
}

var DataCalc = new (function(){

var self = this;
var dgs = {};

/**
 * calc_func(nodes, values)
 * @callback calc_func
 * @param {Array.<HTMLElement>} nodes
 * @param {Array.<(number|string)>} values
 */

/**
 * DataCalc.set(class_name, calc_func)
 * @param {string} class_name 
 * @param {calc_func} func 
 */
this.set = function(class_name, func) {
    // let _func = eval(func);
    // if (_func == undefined) {
    //     console.log("undefined func ", func);
    //     return;
    // }
    dgs[class_name] = {
        'class': class_name,
        'func': func
    }
}

function sum(nodes, values) {
    // console.log(arguments);
    var sum = 0;
    var count = 0;
    var last = values.length - 1;
    var v;
    var i;
    for (i = 0; i < last; ++i) {
        v = values[i];
        if (typeof(v) != 'number')
            continue;
        sum += v;
        ++count;
    }
    if (count == 0)
        sum = '';
    else
        sum = Number(sum.toFixed(2)).toString();
    nodes[last].value = sum;
}

/**
 * DataCalc.sum(class_name)
 * 常用算式: 欄位加總。結果存入最後一欄。
 * @param {string} class_name 
 */
this.sum = function(class_name) {
    self.set(class_name, sum);
} // sum

/**
 * DataCalc.avg(class_name)
 * 常用算式: 欄位平均值。結果存入最後一欄。分母是欄位數目-1。
 * @param {string} class_name 
 */
this.avg = function(class_name) {
self.set(class_name, function(nodes, values){
    var sum = 0;
    var len = values.length - 1;
    var v;
    var i;
    for (i = 0; i < len; ++i) {
        v = values[i];
        if (typeof(v) != 'number')
            continue;
        sum += v;
    }
    // console.log(sum, (sum / len).toFixed(2));
    nodes[len].value = Number((sum / len).toFixed(2)).toString();
});
} // avg

function gather_nodes(cname) {
    var nodes = document.querySelectorAll('.' + cname);
    // var nodes = document.getElementsByClassName(cname);
    var ordered = []; // HTMLElement[]
    var values = []; // value of elements. 若欄位值可以轉數值，則型態為 number ，否則維持原狀(string)。
    var idx;

    forEach(nodes, function(node){
        idx = node.getAttribute('data-order');
        if (!idx)
            return;
        ordered[idx] = node;
        values[idx] = Number(node.value) || node.value;
    });

    forEach(nodes, function(node){
        if (node.hasAttribute('data-order'))
            return;
        idx = ordered.length;
        ordered[idx] = node;
        values[idx] = Number(node.value) || node.value;
    });
    return [ordered, values];
}

function data_group_changed(ev) {
    // console.log('data group changed');
    var target = ev.target || ev.srcElement;
    var cname;
    var i;
    var cls = target.className.split(/\s+/);
    for (i = 0; i < cls.length; ++i) {
        cname = cls[i];
        if (!dgs[cname])
            continue;
        // console.log('calc ', cname, dgs[cname].func);
        dgs[cname].func.apply(target, gather_nodes(cname));
    }
}

function initial() {
    // loading -> interactive -> complete
    if (document.readyState == 'loading')
        return;
    // console.log('DataCalc initial');

    var cname, nodes;
    for (cname in dgs) {
        nodes = document.querySelectorAll('.' + cname);
        // nodes = document.getElementsByClassName(cname);
        forEach(nodes, function(node){
            // IE8 不支持 input 事件，使用 onprepertychange 事件模擬的效能又太差 (會多次觸發)。
            // 所以 IE8 限定在 change 時才計算
            if (node.attachEvent)
                node.attachEvent('onchange', data_group_changed);
            else
                node.addEventListener('input', data_group_changed);
        });
        dgs[cname].func.apply(window, gather_nodes(cname)); // 針對欄位帶初值的情形，在頁面載入後全部計算一次。
    }
}

if (window.attachEvent)
    window.attachEvent('onload', initial);
else
    window.addEventListener('DOMContentLoaded', initial);
return this;
})();
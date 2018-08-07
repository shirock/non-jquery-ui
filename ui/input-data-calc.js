/**
MIT License

Copyright (c) 2018  遊手好閒的石頭成 <shirock.tw@gmail.com> rocksaying.tw

DataCalc

Compatibility: Morden HTML5 browser. MS IE8 ~ IE11 (*).
Depend: polyfill/array-polyfill.js (*)

- 如果要在 IE8~11 使用，才需要加入 array-polyfill.js 。
 */
var DataCalc = new (function(){

var self = this;
var dgs = {};

/**
 * @callback calc_func
 * @param {NodeList} nodes
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

function sum(nodes) {
    var sum = 0;
    var count = 0;
    var v;
    var i;
    for (i = 0; i < nodes.length - 1; ++i) {
        v = nodes[i].value;
        if (v == '')
            continue;
        v = Number(v);
        if (isNaN(v))
            continue;
        sum += v;
        ++count;
    }
    if (count == 0)
        sum = '';
    nodes[nodes.length-1].value = sum;
}

/**
 * DataCalc.sum(class_name)
 * 常用算式: 欄位加總
 * @param {string} class_name 
 */
this.sum = function(class_name) {
    self.set(class_name, sum);
}

function gather_nodes(cname) {
    var nodes = document.querySelectorAll('.' + cname);
    // var nodes = document.getElementsByClassName(cname);
    var ordered = [];
    var idx;

    forEach(nodes, function(node){
        idx = node.getAttribute('data-order');
        if (!idx)
            return;
        ordered[idx] = node;
    });

    forEach(nodes, function(node){
        if (node.hasAttribute('data-order'))
            return;
        idx = ordered.length;
        ordered[idx] = node;
    });
    return ordered;
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
        dgs[cname].func(gather_nodes(cname));
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
        dgs[cname].func(gather_nodes(cname)); // 針對欄位帶初值的情形，在頁面載入後全部計算一次。
    }
}

if (window.attachEvent)
    window.attachEvent('onload', initial);
else
    window.addEventListener('DOMContentLoaded', initial);
return this;
})();
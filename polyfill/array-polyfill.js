/**
MIT License

Copyright (c) 2018  遊手好閒的石頭成 <shirock.tw@gmail.com> rocksaying.tw

ECMAScript Array Polyfill

Current has these methods:

* Array::forEach. And a global function forEach.
* Array::indexOf

All version of IE do not support EMCAScript 6.
 */

// IE 全系列不提供 Array.forEach 方法
// 相容性問題: 這會讓 for in 敘述多出一個 forEach
// 但用 for in 走訪 array 是錯誤用法。
if (!Array.prototype.forEach) {
Array.prototype.forEach = function(callback){
    // console.log(this);
    var ns = this;
    var i;
    for (i = 0; i < ns.length; ++i) {
        callback(ns[i], i, ns);
    }
}}

// IE 全系列不提供 Array.indexOf 方法
// 相容性問題: 這會讓 for in 敘述多出一個 indexOf 
if (!Array.prototype.indexOf) {
Array.prototype.indexOf = function(target){
    // console.log(this);
    var ns = this;
    var i;
    for (i = 0; i < ns.length; ++i) {
        if (ns[i] === target)
            return i;
    }
    return -1;
}}

if (!NodeList.prototype.forEach) {
NodeList.prototype.forEach = Array.prototype.forEach;
}

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
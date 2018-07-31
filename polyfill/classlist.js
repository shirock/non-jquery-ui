/**
MIT License

Copyright (c) 2018  遊手好閒的石頭成 <shirock.tw@gmail.com> rocksaying.tw

classList polyfill. This is for IE8, IE9.

I only implement a classList class.

Ref: https://developer.mozilla.org/zh-TW/docs/Web/API/DOMTokenList
 */
if (!window.DOMTokenList) { // IE8 does not support DOMTokenList
function DOMClassList(elm) {
    // console.log('IE8 classList');
    var ns = elm.className.split(/\s+/);

    function _indexOf(class_name) {
        var i;
        for (i = 0; i < ns.length; ++i) {
            if (ns[i] === class_name)
                return i;
        }
        return -1;
    }

    this.item = function(i) {
        return ns[i]; // undefined or string
    }

    this.contains = function(class_name) {
        return _indexOf(class_name) >= 0;
    }

    this.add = function(class_name) {
        if (elm.className == '') {
            elm.className = class_name;
            return;
        }
        if (this.contains(class_name))
            return;
        elm.className = elm.className + ' ' + class_name;
    }

    this.remove = function(class_name) {
        var i = _indexOf(class_name);
        if (i < 0)
            return;
        ns.splice(i, 1);
        elm.className = ns.join(' ');
    }

    this.replace = function(old_name, new_name) {
        var i = _indexOf(old_name);
        if (i < 0)
            return false;

        if (_indexOf(new_name) >= 0) 
            ns.splice(i, 1); // new_name is existed, remove old_name.
        else
            ns[i] = new_name;
        elm.className = ns.join(' ');
        return true;
    }

    this.supports = function(class_name) {
        return true;
    }

    /**
    Removes token from string and returns false. 
    If token doesn't exist it's added and the function returns true
     */
    this.toggle = function(class_name) {
        if (elm.className == '') {
            elm.className = class_name;
            return true;
        }
        var i = _indexOf(class_name);
        if (i < 0) { // toggle on
            elm.className = elm.className + ' ' + class_name;
            return true;
        }
        else { // toggle off
            ns.splice(i, 1);
            elm.className = ns.join(' ');
            return false;
        }
    }

    this.toString = function() {
        return elm.className;
    }
}

Object.defineProperty(window.Element.prototype, 'classList', {
    // configurable: false,
    get: function(){
        return new DOMClassList(this); 
    }
});
} // end IE8 classList
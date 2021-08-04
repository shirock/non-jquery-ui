/**
MIT License

Copyright (c) 2013  遊手好閒的石頭成 <shirock.tw@gmail.com> rocksaying.tw

JavaScript String interpolation 字串插補點函數
石頭成: http://rocksaying.tw/archives/25899028.html

這是一個相容 IE 的字串擴充函數。
如果你不需要考慮 IE 使用者，你應該使用 ES6 的 template string 語法。

Notice: prototype.js 也為 String 擴充了一個 interpolate 方法，但它的用法和我不一樣。

Depend: none
 */
if (String.prototype.interpolate) {
    console.info("Override String::interpolate method.");
}

/**
用 {n} 包覆要代入的內容，基數從 0 開始。 這是 C# 式的用法。 

example: "hello {0}. {1} + {2} = {3}".interpolate("abc{2}", 'two', 3, 5)
 */
String.prototype.interpolate = function()
{
    if (arguments.length < 1) // do nothing
        return this;

    var s = this;
    var args = arguments;
    // see ECMA-262 3rd edition, 15.5.4.11 String.prototype.replace.

    return s.replace(/\{\d+\}/g, function(matched, offset, src) {
        var k = matched.substring(1,matched.length-1); // index base from 0.
        return (args[k] ? args[k] : matched);
    });
}

/**
用 $n 標示要代入的內容，基數從 1 開始。 這比較像 shell script 的用法。 

A method of String: "format".interpolate2(...);
by $1, $2, ... base from 1.

example: "hello $1. $2 + $3 = $4".interpolate2("abc$2", 'two', 3, 5)
 */
String.prototype.interpolate2 = function()
{
    var s = this;
    var index_offset = 1; // index base from 1.

    if (this instanceof String) {
        if (arguments.length < 1) // nothing
            return this;
    }
    else {
        s = arguments[0]; // notice: arguments is not an array.
        index_offset = 0;
        if (arguments.length < 2) /// nothing
            return s;
    }

    var args = arguments;
    return s.replace(/\$[\$\d]+/g, function(matched, offset, src) {
        var k = parseInt(matched.substring(1)) - index_offset;
        return (args[k] ? args[k] : matched);
    });
}

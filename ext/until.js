/**
MIT License

Copyright (c) 2019  遊手好閒的石頭成 <shirock.tw@gmail.com> rocksaying.tw

使用 Promise 實作，Promise 是 ECMAScript 6 規範項目。
因此需要支持 ECMAScript 6 標準的瀏覽器， IE 所有版本都不可用。

參考: https://www.rocksaying.tw/archives/2021/ES6_Promise.html

Depend: none
 */
function Until(expr, timeout)
{
    let _timeout = timeout ? timeout * 10 : undefined;

    let promise = new Promise((resolve, reject) => {
        let count = 0;
        let it = setInterval(() => {
            // console.log('waiting....', count);
            if (expr()) {
                clearInterval(it);
                resolve(count/10); // elapsed seconds
                return;
            }

            ++count;
            if (_timeout && count > _timeout) { // wait n seconds
                clearInterval(it);
                reject();
                return;
            }
        }, 100) // 0.1 second interval.
    });

    return promise;
}

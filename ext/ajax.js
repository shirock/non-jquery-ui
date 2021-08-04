/**
MIT License

Copyright (c) 2019  遊手好閒的石頭成 <shirock.tw@gmail.com> rocksaying.tw

使用 Promise 實作，Promise 是 ECMAScript 6 規範項目。
因此需要支持 ECMAScript 6 標準的瀏覽器， IE 所有版本都不可用。

參考: https://www.rocksaying.tw/archives/2021/ES6_Promise.html

Depend: none
 */
function JSONRequest(http_method, url, body) 
{
    let promise = new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();

        xhr.addEventListener('load', () => {
            // console.log('response loaded', xhr);
            if (Number(xhr.status) >= 400) {
                reject(xhr);
            }
            else if (xhr.responseText.length < 1) {
                // console.log('only status code');
                resolve();
            }
            else {
                let result = null;
                try {
                    result = JSON.parse(xhr.responseText);
                }
                catch (e) {
                    reject(xhr);
                }
                resolve(result);
            }
        });

        xhr.addEventListener('error', () => {
            console.log("request failed");
            reject(xhr);
            // reject({
            //     status: xhr.status,
            //     text: xhr.statusText
            // });
        });

        xhr.open(http_method, url);
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.setRequestHeader('Content-Type', 'application/json');
        if (body && typeof(body) == 'object') {
            body = JSON.stringify(body);
        }
        xhr.send(body);
    });

    return promise;
}

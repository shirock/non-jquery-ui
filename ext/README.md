# Examples

## ajax.js

JSONRequest() example:

```javascript

let data = {
    "name": "rock",
    "level": 123
};

JSONRequest('POST', url, data)
.then(result => {
    console.log('response ', result);
})

```

## until.js

Until() example:

```javascript

function check_data()
{
    return (document.getElementById('DataInput').value != '');
}

Until(check_data, 5)
.then(_=>{
    console.log('data completed.');
})
.catch(_=>{
    console.log('timeout.');
})

```

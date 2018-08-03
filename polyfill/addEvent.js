// Copyleft 遊手好閒的石頭成 <shirock.tw@gmail.com>
// IE8: Window, HTMLDocument, Element
// Window.prototype.attachEvent
function addEventTo(target, event, callback, bubble) {
    if (target.attachEvent) {
        // console.log('old ie8 event');
        var type;
        // IE8 不支援的事件，用替代品
        if (event == 'DOMContentLoaded')
            type = 'load';
        else if (event == 'input')
            type = 'propertychange';
        else
            type = event;

        (function(target, type, callback) {
            function event_callback(ev){
                // console.log('xxx', ev.type, ev.propertyName, ev);
                // ev.type: load, input, ...
                // ev.cancelBubble: false
                // ev.propertyName
                // IE8 用 propertychange 加 propertyName == 'value' 替代 input 
                if (ev.type == 'propertychange' && ev.propertyName != 'value' && ev.propertyName != 'checked')
                    return;
                if (!ev.target)
                    ev.target = ev.srcElement;
                callback.call(target, ev);
            }
            target.attachEvent("on" + type, event_callback);
        })(target, type, callback);
    }
    else {
        target.addEventListener(event, callback, bubble);
    }
}

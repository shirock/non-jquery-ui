/**
MIT License

Copyright (c) 2018  遊手好閒的石頭成 <shirock.tw@gmail.com> rocksaying.tw

overlayMessage 可在執行非同步工作時，顯示覆蓋全頁的訊息，阻擋使用者操作頁面的內容。

- overlayMessage.show(message, options)
- overlayMessage.off()

Compatibility: Morden HTML5 browser. MS IE8 ~ IE11.
Depend: none
 */
var overlayMessage = new (function(){
    var overlay = false;
    var msg = false;
    var btn = false;
    var doc = false;
    
    this.overlay = false;

    // function highlight_close_button(){
    //     btn.style.border = '1px solid gray';
    //     btn.style.borderRadius = '50%';
    // }
    // function unhighlight_close_button(){
    //     btn.style.border = '0';
    // }

    function set_close_button_position() {
        btn.style.top = msg.offsetTop + 'px';
        btn.style.left = (msg.offsetLeft + msg.offsetWidth - btn.offsetWidth - 15) + 'px';
    }

    function add_close_button() {
        btn = document.createElement('button');
        // btn.type = 'button';
        if (window.attachEvent) {
            btn.attachEvent('onclick', overlayMessage.off);
            // btn.attachEvent('onmouseover', highlight_close_button);
            // btn.attachEvent('onmouseout', unhighlight_close_button);
            window.attachEvent('onresize', set_close_button_position);
        }
        else {
            btn.addEventListener('click', overlayMessage.off)
            // btn.addEventListener('mouseover', highlight_close_button);
            // btn.addEventListener('mouseout', unhighlight_close_button);
            window.addEventListener('resize', set_close_button_position);
        }
        overlay.appendChild(btn);
        btn.style.backgroundColor = 'transparent';
        btn.style.fontSize = '120%';
        btn.style.color = 'gray';
        btn.style.border = '0';
        btn.style.position = 'fixed';
    }

    function toggle_close_button(code) {
        if (code) {
            if (!btn)
                add_close_button();
            btn.innerHTML = (code === true ? '❌' : code); // allow user to use HTML.
            // btn.innerText = '❌';
            // CROSS or MULTIPLICATION  '❌' '✖' 'ⓧ' '╳' '⛒' '✘' '❎'
            set_close_button_position();
            btn.style.visibility = 'visible';
            return;
        }
        
        if (btn)
            btn.style.visibility = 'hidden';
    }

    /**
    overlayMessage.show(message, options)
    Show an overlay message.
    @param {string} message
    @param {Object} options
    @param {string} [options['overlay-message']='overlay-message'] - The style class of overlayMessage.
    @param {string|boolean} [options['close-button']=false] - The content of close button. Default is false.
            you could use '❌', '✖', 'ⓧ', '╳', '⛒', '✘' or '❎', etc.
     */
    this.show = function(message, options) {
        // console.log('call show ', doc, message, options);
        if (!doc)
            return;
        opts = options || {};
        msg.className = opts['class'] || 'overlay-message';
        msg.innerHTML = message;
        overlay.style.display = 'block';
        // doc.appendChild(cover);

        toggle_close_button(opts['close-button']);
    }

    /**
    overlayMessage.off()
    Close overlay message.
     */
    this.off = function() {
        if (!doc || overlay.style.display == 'none')
            return;
        overlay.style.display = 'none';
        // doc.removeChild(cover);
    }

    this.initial = function() {
        if (document.readyState == 'loading')
            return;
        if (doc)
            return;
        // console.log('overlay init');
        overlay = document.createElement('div');
        overlayMessage.overlay = overlay;
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.height = '100%';
        overlay.style.width = '100%';
        overlay.style.zIndex = 9999;
        // overlay.style.display = 'none';
        try {
            overlay.style.backgroundColor = 'rgba(220, 220, 220, 0.7)';
        }
        catch (e) {
            // Older browser (IE8) does not support alpha channel.
            overlay.style.backgroundColor = 'rgb(220, 220, 220)';
        }
        
        msg = document.createElement('div');
        // msg.style.padding = '2em 1em';
        // msg.style.margin = '20% 30%';
        // msg.style.borderRadius = '1em';
        // msg.style.fontSize = '300%';
        // msg.style.color = 'white';
        // msg.style.backgroundColor = 'rgb(60, 179, 113)';
        // msg.style.boxShadow="10px 10px 5px 5px blue";
        overlay.appendChild(msg);
    
        doc = document.getElementsByTagName('body')[0];
        doc.appendChild(overlay);
    }

    if (window.attachEvent)
        window.attachEvent('onload', this.initial);
    else
        window.addEventListener('DOMContentLoaded', this.initial);

    return this;
})();
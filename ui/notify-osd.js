/**
MIT License

Copyright (c) 2018  遊手好閒的石頭成 <shirock.tw@gmail.com> rocksaying.tw

Compatibility: Morden HTML5 browser. MS IE8(*) ~ IE11.
Depend: polyfill/classlist.js (*)

如果你要在 IE8 中使用，才需要加入 classlist.js 。
 */
var notifyOSD = new (function(){
    // console.info('NotifyOSD initial');
    var base = this;
    base.wins = [];

    var Z_INITIAL = 1999;
    var closable = true;
    var corner = 'right-top';
    var count_template;
    set_config();

    var top_z = Z_INITIAL;
    var bot_z = Z_INITIAL;

    function add_style_class(node, className) {
        node.classList.add(className);
    }

    function find_win(title) {
        var i, w;
        for (i = 0; i < base.wins.length; ++i) {
            w = base.wins[i];
            if (w.title == title) {
                return {'idx': i, 'win': w};
            }
        }
        return false;
    }

    function append_win_to_document(win) {
        document.getElementsByTagName('body')[0].appendChild(win);
    }

    function remove_win_from_document(win) {
        document.getElementsByTagName('body')[0].removeChild(win);
        if (base.wins.length < 1)
            return;
        set_count_message();
        set_position(base.wins[0].win);
    }

    function set_position(win) {
        // console.log('set_position');
        var top = 0, left = 0;
        var c = corner.split('-');

        if (c[0] == 'right') {
            left = document.body.offsetWidth - win.offsetWidth;
        }
        if (c[1] == 'bottom') {
            top = document.body.offsetHeight - win.offsetHeight;
        }
        // console.log(document.body.offsetWidth, win.offsetWidth, top, left);
        win.style.top = top + 'px';
        win.style.left = left + 'px';

        if (win.childNodes.length >= 2) {
            var msg_node = win.childNodes[0];
            var count_node = win.childNodes[1];
            // var border1_width = win.offsetHeight - win.clientHeight;
            var height = win.offsetHeight - count_node.offsetHeight - 10;
            if (height < 0)
                height = 0;
            // console.log(win.offsetHeight, count_node.offsetHeight);
            msg_node.style.height = height + 'px';
        }
    } // inner func set_position

    function change_all_windows_position() {
        if (base.wins.length < 1)
            return;
        var i = 0;
        for (i = 0; i < base.wins.length; ++i) {
            set_position(base.wins[i].win);
        }
    } // inner func change_all_windows_position

    function inner_node_style_init(node) {
        // margin 和 padding 會影響物體尺寸，不好計算位置。所以固定值。
        node.style.margin = '0';
        node.style.padding = '3px';
        node.style.overflow = 'auto';
        // node.style.border = '1px solid black';
    }

    function create_close_button() {
        var btn = document.createElement('button');
        btn.innerText = '✘';
        btn.style.backgroundColor = 'transparent';
        btn.style.border = '0';
        btn.style.float = 'right';
        if (btn.attachEvent)
            btn.attachEvent('onclick', notifyOSD.pop);
        else
            btn.addEventListener('click', notifyOSD.pop);
        return btn;
    }

    function set_count_message() {
        if (base.wins.length < 1)
            return;
        var top_win = base.wins[0].win;
        var count_node;
        var nodes = top_win.getElementsByTagName('div');
        if (nodes.length >= 2) {
            count_node = nodes[1];
            if (base.wins.length == 1 && !closable) {
                top_win.removeChild(count_node);
                return;
            }
        }
        else {
            if (base.wins.length == 1 && !closable) 
                return;
            count_node = document.createElement('div');
            add_style_class(count_node, 'notify-osd-count');
            inner_node_style_init(count_node);
            top_win.appendChild(count_node);
        }

        if (base.wins.length > 1)
            count_node.innerText = count_template.replace('$c', base.wins.length);
        else
            count_node.innerText = '';

        if (closable)
            count_node.appendChild(create_close_button());
    } // end set_count_message

    function set_config(settings) {
        if (!settings)
            settings = {};
        closable = settings.closable || false;
        corner = settings.corner || 'right-top';
        count_template = settings.count_template || '還有$c筆訊息';
        Z_INITIAL = settings.zIndexBase || 1999;
    }

    /**
     * Set configuration.
     * @param {Object} settings 
     * @param {boolean} [settings.closable=false]
     * @param {string} [settings.corner='right-top'] - left-top, left-bottom, right-top, right-bottom.
     * @param {string} [settings.count_template='還有$c筆訊息']
     * @param {number} [settings.zIndexBase=1999]
     */
    this.setConfig = set_config;

    /**
     * 一個 title 一個視窗，不會重覆建立。
     * @param {string} title
     * @param {string} msg
     * @param {Object} options
     * @param {boolean} options.to_bottom
     */
    this.push = function(title, msg, options) {
        if (find_win(title))
            return;

        if (base.wins.length == 0) {
            top_z = bot_z = Z_INITIAL;
        }

        if (!options) {
            options = {
                'to_bottom': false
            };
        }

        var to_bottom = options['to_bottom'] || false;

        var win = document.createElement('div');
        win.title = title;
        var win_z;

        if (to_bottom) {
            --bot_z;
            win_z = bot_z;

            base.wins.push({
                'title': title,
                'win': win
            });
        }
        else {
            ++top_z;
            win_z = top_z;

            base.wins.unshift({
                'title': title,
                'win': win
            });
        }

        add_style_class(win, 'notify-osd');
        // win.style.position = 'absolute';
        win.style.position = 'fixed';
        win.style.visibility = 'hidden';
        win.style.zIndex = win_z;
        // console.log(top_z, bot_z, win_z);
        var msg_node = document.createElement('div');
        add_style_class(msg_node, 'notify-osd-message');
        inner_node_style_init(msg_node);
        msg_node.innerText = msg;
        win.appendChild(msg_node);

        set_count_message();

        append_win_to_document(win);
        setTimeout((function(win){
            return function(){
                set_position(win);
                win.style.visibility = 'visible';
            }
        })(win), 100);
    } // push

    /**
     * Append notify message to bottom of stack.
     * @param {string} title 
     * @param {string} msg 
     */
    this.append = function(title, msg) {
        this.push(title, msg, {'to_bottom': true});
    } // append

    /**
     * Remove notify message by title.
     * @param {string} title 
     */
    this.remove = function(title) {
        var r = find_win(title);
        if (!r)
            return;
        // console.log('remove ', r.idx, r.win.title);
        base.wins.splice(r.idx, 1);
        remove_win_from_document(r.win.win);
    } // remove

    /**
     * Remove the notify messsage at the top of the stack.
     */
    this.pop = function() {
        if (base.wins.length < 1)
            return;
        var w = base.wins.shift();
        remove_win_from_document(w.win);
    } // pop

    if (window.attachEvent)
        window.attachEvent('onresize', change_all_windows_position); // resize event
    else
        window.addEventListener('resize', change_all_windows_position); // resize event

    return this;
})();
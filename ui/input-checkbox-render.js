(function(){
function initial(){

    function toggle_input_required_style(elm, v) {
        // toggle_node_style(elm, 'input-required', v);
    }

    function text_input_changed(ev) {
        // 若 text box 填值，則自動打勾綁定的 checkbox
        var text_input = ev.target || ev.srcElement;
        var checkbox = text_input.previousSibling.previousSibling;
        checkbox.checked = text_input.required = (text_input.value.length > 0);
        if (checkbox.type == 'radio')
            checkbox.value = text_input.value;
        // toggle_input_required_style(text_input, checkbox.checked && text_input.value.length == 0);
    }

    function add_node_after(target_node, new_node) {
        var pr = target_node.parentNode;
        //if (target_node.nextSibling != null)
        if (pr.childNodes.length > 1)
            pr.insertBefore(new_node, target_node.nextSibling);
        else
            pr.appendChild(new_node);
    }

    function rerender_checkbox(input) {
        var checkbox_label;
        var label_text = input.getAttribute('label') || input.value;
        var copy_attributes = ['optional-required', 'title', 'class'];

        // if (label_text.charAt(label_text.length -1) == '#') {
        //     label_text = label_text.substring(0, label_text.length - 1);
        // }
        checkbox_label = document.createElement("label");
        // checkbox_label.title = input.hasAttribute('_title') ? input.getAttribute('_title') : input.title;
        checkbox_label.title = input.title;
        checkbox_label.setAttribute('for', input.id);
        checkbox_label.appendChild(document.createTextNode(label_text));
        add_node_after(input, checkbox_label);

        // if (element_class_contains(input, "inputbox")) {
        if (input.classList.contains('inputbox')) {
            var text_input  = document.createElement("input");
            text_input.type = "text";
            // text_input.placeholder = input.value;
            text_input.placeholder = input.title;
            text_input.setAttribute('checkbox_input', true);

            copy_attributes.forEach(function(k){
                if (input.hasAttribute(k)) {
                    text_input.setAttribute(k, input.getAttribute(k));
                }
            }); 
            if (text_input.value.length < 1)
                input.checked = false;

            // 我希望回傳的是文字框的值，而不是 checkbox 的值
            // 所以這種 checkbox 不需要賦予 name 
            if (input.type == 'checkbox') {
                text_input.name = input.name;
                input.name = '';
            }
            add_node_after(checkbox_label, text_input);

            // addEventTo(text_input, 'input', text_input_changed);
            text_input.addEventListener('input', text_input_changed);

            // addEventTo(input, 'click', function(ev){
            input.addEventListener('click', function(ev){
                // console.log('若打勾，則綁定的 text box 必填');
                var text_input;
                text_input = ev.target.nextSibling.nextSibling;
                // TODO 取選勾選時，是否清除文字內容？ 或是不許改變勾選狀態？
                // checkbox: textbox 已填值時，不許改變勾選狀態
                // if (text_input.value.length > 0) { 
                //     ev.preventDefault();
                //     return;
                // }
                // 取消勾選時，清除文字內容
                if (!ev.target.checked) {
                    text_input.value = '';
                }

                text_input.required = ev.target.checked;
                // toggle_input_required_style(text_input, text_input.required);
            });
        }
        else { // not inputbox
            // addEventTo(input, 'click', function(ev){
            input.addEventListener('click', function(ev){
                // console.log('radio 若打勾，清除其他選項綁定的 text box');
                var text_input;
                if (ev.target.type != 'radio')
                    return;

                var inputs = document.getElementsByName(ev.target.name);
                // console.log('radio click, len: ', inputs.length, ev.target.name);
                var i, input;
                for (i = 0; i < inputs.length; ++i) {
                    input = inputs[i];
                    if (input == ev.target || !input.classList.contains('inputbox'))
                        continue;
                    text_input = input.nextSibling.nextSibling;
                    input.value = '';
                    text_input.value = '';
                    text_input.required = false;
                    // toggle_input_required_style(text_input, false);
                }
            });
        } // end render .inputbox
    }

    function set_text_input_name(input, fieldset, hint, name_list) {
        var base_name = '{0}_{1}'.interpolate(fieldset.name, hint);
        // 第一次出現時，使用單體名稱。名稱重複時，改用名稱加序列號: name[1] or name1
        if (name_list[hint] == undefined) {
            input.name = base_name;
            name_list[hint] = 1;
        }
        else {
            input.name = (MULTIPLE_NAME_AS_ARRAY ?
                '{0}[{1}]'.interpolate(base_name, name_list[hint]) :
                base_name + name_list[hint]);
            if (name_list[hint] == 1) {
                // 把第一次的單體名稱改為名稱序列號 0
                document.getElementsByName(base_name)[0].name = (MULTIPLE_NAME_AS_ARRAY ?
                    base_name + '[0]' :
                    base_name + '0');
            }
            ++name_list[hint];
        }
    }

    var i, ii, fn, name_list;
    var inputs, input;

    // 改變 checkbox 外觀
    inputs = document.getElementsByTagName('input');
    var input_idx = 0;

    console.log(inputs.length);
    for (i = 0; i < inputs.length; ++i) {
        input = inputs[i];

        if (input.type != "checkbox" && input.type != "radio") {
            continue;
        }
        if (input.name == '') {
            continue;
        }

        if (input.id == '') {
            input.id = input.name + '_' + input_idx.toString();
            ++input_idx;
        }

        rerender_checkbox(input);
    }
    // end 改變 checkbox 外觀
}

if (window.attachEvent)
    window.attachEvent('onload', initial);
else
    window.addEventListener('DOMContentLoaded', initial);
})();
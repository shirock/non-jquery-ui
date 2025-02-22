/**
 * MIT License
 * Copyright (C) 2025  遊手好閒的石頭成 <shirock.tw@gmail.com> https://rocksaying.tw
 *
 * NumberInputElement - 數值型態 Input 的擴充元件
 * 
 * 1.只綁定型態為 number 的 input 控制項 (input type="number")。
 * 2.加入使用滑鼠滾輪改變數值的行為。上滾增值，下滾減值。
 * 3.擴充 label 控制項的行為，使其具備對關聯控制項的增值行為或減值行為。
 *   使用 type 屬性定義點擊 label 時的行為， inc 表示增值，dec 表示減值。
 * 4.若不想用 label 改變 input 控制項的值 ，則可用 labelSelector 自行定義控制項的選擇器。
 *   例如用 button 控制項處理增值或減值。
 * 5.增值與減值行為都會參考 input 控制項的 max, min, step 三項標準屬性。
 * 
 * 這個元件不會主動在 input 控制項旁邊增加控制按鈕，而是交給設計師決定。
 * 如果設計師沒有放上代表增值或減值的按鈕／控制項，將只有滑鼠滾輪的擴展行為生效。
 */
class NumberInputElement
{
    static relatedAttribute = 'for';

    static initial(labelSelector)
    {
        document.querySelectorAll('input[type="number"]').forEach(elm => {
            elm.addEventListener('wheel', NumberInputElement.wheelHandler);

            let labels;
            if (labelSelector) {
                labels = labelSelector(elm.id);
            }
            else {
                labels = document.querySelectorAll(`label[for="${elm.id}"]`);
            }

            // 擴展 label 控制項的行為(若其具有 type 屬性)
            labels.forEach(elm => {
                if (!elm.getAttribute('type')) {
                    return;
                }
                // label 的 click 事件觸發兩次 (在 mousedown 與 mouseup 後各一次)
                // 所以看 mouseup ，不看 click
                elm.addEventListener('mouseup', NumberInputElement.labelHandler);
            });
        });
    }

    static wheelHandler(ev)
    {
        ev.preventDefault();
        const input = ev.target;
        const delta = ev.deltaY;
        if (delta > 0) {
            // console.log('wheel down');
            NumberInputElement.change(input, 'dec');
        } else {
            // console.log('wheel up');
            NumberInputElement.change(input, 'inc');
        }
        input.focus(); // 對應 label 動作
    }

    static labelHandler(ev)
    {
        const label = ev.target;
        const labelType = label.getAttribute('type');
        // const input = label.control; // 只有 label 控制項有此屬性
        // const input = document.getElementById(label.getAttribute('for')); // 放寛到其他控制項
        const input = document.getElementById(label.getAttribute(NumberInputElement.relatedAttribute));
        if (!input || !labelType) {
            return;
        }

        NumberInputElement.change(input, labelType);
        input.focus();
    }

    static change(input, act)
    {
        act = act.toLowerCase();
        let computedValue = parseFloat(input.value) || 0;

        const step = input.getAttribute('step') || 1;
        const max = input.getAttribute('max');
        const min = input.getAttribute('min');

        if (act == 'inc') {
            computedValue += step;
            if (!max || max >= computedValue) {
                input.value = computedValue;
            }
        }
        else if (act == 'dec') {
            computedValue -= step;
            if (!min || min <= computedValue) {
                input.value = computedValue;
            }
        }
    }
}

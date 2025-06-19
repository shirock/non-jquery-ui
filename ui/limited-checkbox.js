/**
 * MIT License
 * Copyright (C) 2025  遊手好閒的石頭成 <shirock.tw@gmail.com> https://rocksaying.tw
 *
 * LimitedCheckbox UI元件，複選但有限項目的表單元件
 *
 * Compatibility: Morden HTML5/ES6 browser. No support for older browsers.
 * Depend: none
 * See: https://www.rocksaying.tw/archives/2025/JS-UI-LimitedCheckbox.html
 */
class LimitedCheckbox
{
    static validCallback = undefined;
    static invalidCallback = undefined;

    static initial(valid_callback, invalid_callback) {
        this.validCallback = valid_callback;
        this.invalidCallback = invalid_callback;

        document.addEventListener('submit', ev => {
            if (!this.checkValidity()) {
                // console.log('do not submit');
                ev.preventDefault();
                return;
            }
            // console.log('submit');
        });

        document.addEventListener('change', ev =>
            ev.target.type == 'checkbox' &&
            this.updateStatus(ev.target)
        );

        // 因為某些選項可能在網頁開啟時已是 checked 狀態，
        // 所以網頁開啟後，要先掃描一遍所有選項狀態確認是否要調整為 disabled 
        let current_cb_name = null;
        document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
            if (cb.name != current_cb_name) {
                current_cb_name = cb.name;
                this.updateStatus(cb);
            }
        });
    }
    
    // 檢查已選擇項目是否達上限，若是，則令其他未選擇項目失效(使用者不能勾選)
    static updateStatus(checkbox) {
        const name = checkbox.name;
        const fieldset = checkbox.closest('fieldset');
        if (!fieldset)
            return;
        const maxlength = fieldset.getAttribute('maxlength');
        if (!maxlength)
            return;

        // console.log('update', fieldset);
        const checkboxes = document.querySelectorAll(`input[name="${name}"]`);
        const checked_count = Array.from(checkboxes).filter(chk => chk.checked).length;
        if (checked_count >= maxlength) {
            checkboxes.forEach(chk => {
                // 已達上限，令其他未選擇項目失效(使用者不能勾選)
                if (!chk.checked)
                    chk.disabled = true;
            });
        } 
        else {
            checkboxes.forEach(chk => chk.disabled = false);
        }
    }

    static checkValidity() {
        const fieldsets = document.querySelectorAll(`fieldset[minlength]`);
        for (const fieldset of fieldsets) {
            // 如果用了前端框架的 tab/頁籤功能切換可見的表單內容，
            // 那麼隱藏起來的部份，我將其視為不使用的內容，不檢核條件。
            // ps. checkVisibility() 是2024年才普及的新方法.
            if (fieldset.checkVisibility && !fieldset.checkVisibility()) {
                // console.log('skip', fieldset.id);
                continue;
            }

            const minlength = fieldset.getAttribute('minlength');
            const checkboxes = document.querySelectorAll(`input[name="${fieldset.id}"]`);
            const checked_count = Array.from(checkboxes).filter(chk => chk.checked).length;

            if (checked_count < minlength) {
                this.invalidCallback && this.invalidCallback(fieldset);
                // fieldset.setCustomValidity('too few');
                fieldset.dispatchEvent(new ErrorEvent('invalid', {bubbles: true, message: 'too few'}));
                return false;
            }
            
            this.validCallback && this.validCallback(fieldset);
            // fieldset.setCustomValidity('');
        }
        return true;
    }
}

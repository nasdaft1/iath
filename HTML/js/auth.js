function form_visible(link_reg, link_login, link_rest) {
    document.getElementById('form-reg').style.display = link_reg;
    document.getElementById('form-login').style.display = link_login;
    document.getElementById('form-restore').style.display = link_rest;
}


window.onload = function () {
    // console.log('The page has fully loaded');
    // при запуске или обновлении
    startProgress();
    const icons = document.querySelectorAll('.icon');
    block_visible('none', 'none', 'none')
    /* делаем все icon не видемыми в sidebar*/
    icons.forEach(icon => {
        const icon_id = icon.getAttribute('id');
        document.getElementById(icon_id).style.display = 'none';
    })
    //открытие формы с помощью меню registration
    document.getElementById("link-reg").addEventListener("click", function () {
        form_visible('block', 'none', 'none');
    });
    //открытие формы с помощью меню login
    document.getElementById("link-login").addEventListener("click", function () {
        form_visible('none', 'block', 'none');
    });
    //переход с формы login на форму registration
    document.getElementById("link-reg-2").addEventListener("click", function () {
        form_visible('block', 'none', 'none');
    });
    //переход с формы registration на форму  login
    document.getElementById("link-login-2").addEventListener("click", function () {
        form_visible('none', 'block', 'none');
    });
    //открыть форму востановление пароля 
    document.getElementById("link-forgot-password").addEventListener("click", function () {
        form_visible('none', 'none', 'block');
    });
    //закрытие по крестику на форме login
    document.getElementById("close-login").addEventListener("click", function () {
        form_visible('none', 'none', 'none');
    });
    //закрытие по крестику на форме registration
    document.getElementById("close-reg").addEventListener("click", function () {
        form_visible('none', 'none', 'none');
    });
    document.getElementById("close-restore").addEventListener("click", function () {
        form_visible('none', 'none', 'none');
    });
};



document.addEventListener('DOMContentLoaded', () => {
    // защита отправки если пароли и подтверждающего пароля
    const form = document.getElementById('form-reg');
    const input1 = document.getElementById('reg-password');
    const input2 = document.getElementById('reg-confirm_password');
    const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;
    form.addEventListener('submit', function (event) {
        if (input1.value !== input2.value) {
            // защита отправки если пароли не совпадают
            alert('The password does not match the confirmation password.');
            event.preventDefault(); // Prevent form from submitting
        }
        else if (!passwordPattern.test(input1.value)) {
            // проверка пароля на соотвествие регулярному выражению
            alert('Password must be at least 8 characters long and contain at least one digit, one special character, one uppercase letter, and one lowercase letter.');
            event.preventDefault(); // Prevent form from submitting
        }
    });

});
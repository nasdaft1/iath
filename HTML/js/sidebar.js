/**
 * Функция для визуализации блоков в sidebar
 * @param {string} block_2 - block||none включение выключения визуализации блока
 * @param {string} block_3 - block||none включение выключения визуализации блока
 * @param {string} block_4 - block||none включение выключения визуализации блока
 */
function block_visible(block_2, block_3, block_4) {
    document.getElementById('block-2').style.display = block_2; // block_2 - teach
    document.getElementById('form-question').style.display = block_2;
    document.getElementById('block-3').style.display = block_3; // block_3 - 
    document.getElementById('block-4').style.display = block_4; // block_4 - material
}


document.addEventListener('DOMContentLoaded', () => {
    const blocks = document.querySelectorAll('.block');
    const sidebar = document.querySelector('.sidebar');
    const icons = document.querySelectorAll('.icon');

    sidebar.addEventListener('mouseenter', () => {
        // событие при наведение курсора на элемент sidebar
        // переводи иконки в видимые
        icons.forEach(icon => {
            const icon_id = icon.getAttribute('id');
            document.getElementById(icon_id).style.display = 'block';
            });
        });

    sidebar.addEventListener('mouseleave', () => {
        // событие при покидание курсора с элемента sidebar
        // перебераем icons
        // все icon перебирать не надо нужно только 
        icons.forEach(icon => {
            const select = icon.classList;
            // получаем значение id icons
            const select_id = icon.getAttribute('id');
            // получаем значение id родительского элемента icon
            const parentBlock = icon.closest('.block').getAttribute('id');
            // находим элемент который выделен selected
            if (select[1] != 'selected') {
                document.getElementById(select_id).style.display = 'none';
            }
        });
    });


    /*блок обработки нажатия на icon в block*/
    blocks.forEach(block => {
        const icons = block.querySelectorAll('.icon');
        let count_select = 0;
        icons.forEach(icon => {
            // поиск иконки на которую кликнули
            icon.addEventListener('click', () => {
                
                if (block.getAttribute('id') == 'block-1' ) {
                    // удалять выделение для одиночного выбора в блоке
                    icons.forEach(i => i.classList.remove('selected'));
                    icon.classList.add('selected');
                } else if (icon.classList[1] == 'selected') {
                    // удалять выделение для при нажатие на выделение
                    icon.classList.remove('selected')
                } else {
                    // выделение при нажатие на не выделенный блок
                    icon.classList.add('selected');
                }
                /* отображение нужного интерфейса на форме от выбора*/
                const menu = icon.getAttribute('id');
                // отображение блоков и скрытия в зависимости от выбора
                if (menu === "material") {
                    block_visible('none', 'none', 'block')
                } else if (menu === "teach") {
                    block_visible('block', 'block', 'none')
                } else if (menu === "analysis") {
                    block_visible('none', 'none', 'none')
                } else { // Действие для любого другого значения (none)
                }
            });
        });
    });
});
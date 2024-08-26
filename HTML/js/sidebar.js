/**
 * Функция для визуализации блоков в sidebar
 * @param {string} block_2 - block||form-question, block-method
 * @param {string} block_3 - block||none block-languages
 * @param {string} block_4 - block||none block-4
 * @param {string} block_5 - block||none material 
 */
function block_visible(block_2, block_3, block_4, block_5 ) {
    document.getElementById('block-method').style.display = block_2; // block_2 - teach
    document.getElementById('form-question').style.display = block_2;
    document.getElementById('table-container-material').style.display = block_5; 
    document.getElementById('block-languages').style.display = block_3; // block_3 - 
    document.getElementById('block-4').style.display = block_4; // block_4 - material
}

/**
 * Создание Sidebar и навешиваие на него эементов управления
 */
class Sidebar{

    constructor() {

        // Код, который нужно выполнить при инициализации класса
    }
    
    //select_element={} //элементы выделенные в Sidebar

    selectedBlock(block, icon , icons){
        const isBlockOne = block.getAttribute('id') === 'block-1';
        const isSelected = icon.classList.contains('selected');
        if (isBlockOne) {
            // удалять выделение для одиночного выбора в блоке
            icons.forEach(i => i.classList.remove('selected'));
            icon.classList.add('selected');
        } else if (isSelected) {
            // удалять выделение для при нажатие на выделение
            icon.classList.remove('selected')
        } else {
            // выделение при нажатие на не выделенный блок
            icon.classList.add('selected');
            
        }

        /* Отображение нужного интерфейса на форме в зависимости от выбора */
        const menu = icon.getAttribute('id');
        switch(menu) {
            case "material":
                block_visible('none', 'none', 'block', 'block');
                break;
            case "teach":
                block_visible('block', 'block', 'none', 'none');
                break;
            case "analysis":
                block_visible('none', 'none', 'none', 'none');
                break;
            default:
                // Действие для любого другого значения (если необходимо)
                break;
        }
    }

    /**
     * Функция по навешиванию обработчика событий на нужный нам объект и связывает его с плеером
     */
    sidebarAddEvent(){
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
            let select_element ={}
            let element =[]
            icons.forEach(icon => {
                const select = icon.classList;
                // получаем значение id icons
                const select_id = icon.getAttribute('id');
                // получаем значение id родительского элемента icon
                const parentBlock = icon.closest('.block').getAttribute('id');
                // находим элемент который выделен selected
                if (select[1] != 'selected') {
                    document.getElementById(select_id).style.display = 'none';
                } else{
                    // создание списка выделенных элементов
                    element = select_element[parentBlock] || [];
                    element.push(select_id);
                    select_element[parentBlock]=element
                }
            });
            this.select_element = select_element
            console.log('select_element', this.select_element);    
            console.log('закрытие sidebar');
        });


        /*блок обработки нажатия на icon в block*/
        blocks.forEach(block => {
            const icons = block.querySelectorAll('.icon');
            let count_select = 0;
            icons.forEach(icon => {
                // поиск иконки на которую кликнули
                icon.addEventListener('click', () => {
                    this.selectedBlock(block, icon , icons);
                });
            });
        });
    }
}

const sidebar_material = new Sidebar();

document.addEventListener('DOMContentLoaded', () => {
    sidebar_material.sidebarAddEvent();
    block_visible('none', 'none', 'none', 'none')
});
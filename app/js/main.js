const body = document.body;
const app = function () {
    return {
        init: () => {
            // Тут подключаются функции
                app.Submenu(),
                app.MobMenu(),
                app.NavbarDropDown(),
                app.TabFilter(),
                app.arrowTop(),
                app.ClickOutside(),
                app.FeedbackForm(),
                app.ReadMore(),
                app.Accordion(),
                app.ScrollHeaderFix(),
                app.ScrolltoObject(),
                app.PopupInit('popupFeedback')
        },

        // Показать BackGround
        BackgroundShow: () => {
            body.classList.add('popup__show');
        },

        // Скрыть Background
        BackgroundHide: () => {
            body.classList.remove('popup__show');
        },

        arrowTop: () => {
            window.addEventListener('scroll', app.Throttle(() => {
                window.scrollY > 500
                    ? body.classList.add('show__arrow')
                    : body.classList.remove('show__arrow')
            }, 300))
        },

        // Работа с Background при вызове SubMenu
        Submenu: () => {
            let items = Array.from(document.querySelectorAll(".header__submenu")).map(i => i.parentNode);
            if(items){
                for (i = 0; i < items.length; i++) {
                    items[i].addEventListener('mouseenter', () => {
                        app.BackgroundShow();
                    })
                    items[i].addEventListener('mouseleave', () => {
                        app.BackgroundHide();
                    })
                }
            }
        },
        
        // Работа с мобильным меню
        MobMenu: () => {
            let item__open = document.querySelector('.header__menu-button');
            let item__close = document.querySelector('.mobile-menu__close');

            const lvl_open_list = document.querySelectorAll('.mobile-menu__next-lvl');
            const lvl_close_list = document.querySelectorAll('.mobile-menu__close-lvl');
           
            if(item__open){
                item__open.addEventListener('click', app.MobMenuOpen);
            }
            if(item__close){
                item__close.addEventListener('click', app.MobMenuClose);
            }
            if(lvl_open_list){
                lvl_open_list.forEach(function(lvl_open){
                    lvl_open.addEventListener('click', (e) => {
                        let innerList = e.target.closest('.mobile-menu__item');
                        innerList = innerList.querySelector('.mobile-menu__inner-items');
                        innerList.classList.add('show')
                        let mobileMenuWrapper = document.querySelector('.mobile-menu__wrapper');
                        mobileMenuWrapper.style.transform = 'translate(-100%)';
                    });
                });
            }
            if(lvl_close_list){
                lvl_close_list.forEach(function(lvl_close){
                    
                    lvl_close.addEventListener('click', (e) => {
                        let innerList = e.target.closest('.mobile-menu__inner-items');
                        innerList.classList.remove('show')
                        let mobileMenuWrapper = document.querySelector('.mobile-menu__wrapper');
                        mobileMenuWrapper.style.transform = 'translate(0%)';
                    });
                });
            }
        },

        // Открываем мобильное меню
        MobMenuOpen: () => {
            body.classList.add('show__navbar');
            app.LockScreen();
        },

        // Закрываем мобильное меню
        MobMenuClose: () => {
            body.classList.remove('show__navbar');
            app.UnlockScreen();
        },

        /**
         * Инициализрует popup окно которое следует стандартной HTML структуре
         * @param {string} popupId - ID попап элемента
        */
        PopupInit: (popupId) => {
            let popup = document.querySelector(`#${popupId}`);
            if (popupId) {
                let openBtns = document.querySelectorAll(`button[data-button-for-id="${popupId}"]`);
                closeBtn = popup.querySelector('.popup__close');

                openBtns.forEach((openButton) => {
                    openButton.addEventListener('click', (e) => {
                        popup.style.display = 'block';
                        app.BackgroundShow();
                        app.LockScreen();
                    });
                });

                closeBtn.addEventListener('click', (e) => {
                    popup.removeAttribute('style');
                    app.BackgroundHide();
                    app.UnlockScreen();
                });
            }
        },
        
        //Работа с dropdown меню хедера
        NavbarDropDown: () => { 
            //Блюр при открытии/закрытии выпадающего списка
            const navbar = Array.from(document.querySelectorAll('.header__navbar-list .header__navbar-item'));
            navbar.forEach((navbarItem) => {
                if (navbarItem.querySelector('.header__dropdown-wrapper')) {
                    navbarItem.addEventListener('mouseover', (e) => {
                        body.classList.add('show__dropdown');
                    })

                    navbarItem.addEventListener('mouseout', (e) => {
                        body.classList.remove('show__dropdown');
                    })
                }
            })

            //Вешаем события на элементы выпадающего списка
            const wrappersList = document.querySelectorAll('.header__dropdown-wrapper');
            wrappersList.forEach((wrap) => {
                let twoLvlWrap = document.createElement('ul');
                let dropdownList = wrap.querySelector('.header__dropdown-list');
                let items = dropdownList.querySelectorAll('.dropdown');

                twoLvlWrap.classList.add('header__dropdown-child');
                wrap.appendChild(twoLvlWrap);
                twoLvlWrap = wrap.querySelector('.header__dropdown-child');

                items.forEach((element) => {
                    let dropdown = element.querySelector('.header__dropdown-list--lvl2');
                    if (dropdown != null) {
                        element.addEventListener('mouseover', (e) => {
                            app.ResetClassOnListItems(items, 'selected--dropdown')
                            element.classList.add('selected--dropdown')
                            twoLvlWrap.innerHTML = '';
                            twoLvlWrap.appendChild(dropdown); 
                        })
                        element.addEventListener('mouseuout', (e) => {
                            app.ResetClassOnListItems(items, 'selected--dropdown')
                            element.classList.add('selected--dropdown')
                            twoLvlWrap.innerHTML = '';
                            twoLvlWrap.appendChild(dropdown);  
                        })
                    };
                });
            });
        },

        //Работа с таб фильтром на главной странице
        TabFilter: () => {
            let filterGrid = document.querySelector('.projects-tabs__tabpanel-wrapper');
            let iso = new Isotope( filterGrid, {
                itemSelector: '.projects-tabs__item',
                layoutMode: 'masonry',
                masonry: {
                    columnWidth: 100,
                    horizontalOrder: true,
                    isFitWidth: true,
                    resize: true
                  }
            });

            // let tabFilter = document.querySelector('#tabFilter');

            // if (tabFilter) {
            //     let tabList = tabFilter.querySelectorAll('[role=tablist] > [role=tab]');
            //     let tabPanels = tabFilter.querySelectorAll('[role=tabpanel]')
            //     let tabAccessoryList = {};
                
            //     tabList.forEach((tabListItem) => {
            //         tabAccessoryList[tabListItem.id] = [];

            //         tabListItem.addEventListener('click', (e) => {
            //             app.SetAriaAtrOnListItems(tabList, 'aria-selected', 'false');
            //             app.ResetClassOnListItems(tabList, 'projects-tabs__btn--active');
            //             app.ResetClassOnListItems(tabPanels, 'projects-tabs__item--active');
            //             tabListItem.classList.add('projects-tabs__btn--active');
            //             tabListItem.ariaSelected = 'true';

            //             for (let tab of tabAccessoryList[tabListItem.id]){
            //                 tab.classList.add('projects-tabs__item--active');
            //             }
            //         })
            //     })

            //     tabPanels.forEach((tabPanelItem) => {
            //         let arrayProps = tabPanelItem.dataset.accessory.split(' ');

            //         for(let i = 0; i < arrayProps.length; i++){
            //             tabAccessoryList[arrayProps[i]].push(tabPanelItem);
            //         }
            //     })

            //     //Выбирам элемент по дефолту
            //     tabList[0].click()
            // }
        },
        
        /**
         * Удаляет определенный класс у всех элементов ноды
         * @param {object} listNode - Массив или объект элементов
         * @param {string} className - Имя класса
        */
        ResetClassOnListItems: (listNode, className) => {
            try {
                arrayList = Array.from(listNode);
                for (select of arrayList) {
                    select.classList.remove(className);
                }
            }
            catch(e) {
                console.error(e);
            }
        },

        /**
         * Устанавливает определенный aria атрибут всем элементам ноды 
         * @param {object} listNode - Массив или объект элементов
         * @param {string} ariaAtr - Aria атрибут
         * @param {string} ariaValue - Значение aria атрибута
        */
        SetAriaAtrOnListItems: (listNode, ariaAtr, ariaValue) => {
            try {
                arrayList = Array.from(listNode);
                for (select of arrayList) {
                    select.setAttribute(ariaAtr, ariaValue);
                }
            }
            catch(e) {
                console.error(e);
            }
        },

        // Блочим скролл 
        LockScreen: () => {
            let paddingWidth = window.innerWidth - document.getElementsByTagName('html')[0].clientWidth + 'px';
            if (document.querySelector('.header--fixed')){
                document.querySelector('.header--fixed').style.paddingRight = paddingWidth;
            };
            body.style.paddingRight = paddingWidth;
            body.classList.add('lock__screen');
        },

        // Разлочим скролл
        UnlockScreen: () => {
            if (document.querySelector('.header--fixed')){
                document.querySelector('.header--fixed').style.paddingRight = null;
            };
            body.style.paddingRight = null;
            body.classList.remove('lock__screen');
        },

        // Клик вне блока.
        ClickOutside: () => {
            let overlay = document.querySelector('.overlay-blur');
            if(overlay){
                overlay.addEventListener('click', () => {
                    app.MobMenuClose();
                })
            }
        },

        //Фиксация хедера при скролле
        ScrollHeaderFix: () => {
            let header = document.querySelector('.header');
            let offset = header.offsetHeight;
            window.onscroll = function() {
                if (window.scrollY > offset-10 && window.innerWidth <= 1200) {
                    body.style.marginTop = header.offsetHeight + 'px';
                    header.classList.add("header--fixed");
                } else if(window.scrollY < offset-20) {
                    body.style.marginTop = null;
                    header.classList.remove("header--fixed");
                }
            }
        },

        // Форма аутентификации
        Accordion: () => {
            let accordionWrap = document.querySelector('.accordion__wrapper');
            if(accordionWrap){
                accordionItems = document.querySelectorAll('.accordion__item');
                accordionItems.forEach((accordionItem) => {
                    accordionItem.querySelector('.accordion__header').addEventListener('click', (e) => {
                        accordionItem.classList.toggle('accordion__item--active');
                    })
                })

            }
        },

        // Форма аутентификации
        FeedbackForm: () => {
            let button = document.querySelector('button[type="submit"].header__personal--auth__submit');
            if(button){
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (app.FormControl(e.target)) {
                        console.log('Отправляем форму Auth')
                    }
                })
            }
        },
        
        /**
         * Для проверки форм (Если обратить внимание, то он находит родителей кнопки). Семантика обязательно должна быть соблюдена!!!
         * @param {object} itemSubmit - Элемент отправки формы
        */
        FormControl: (itemSubmit) => {
            let result = [],
                find__error = false
            let children = Array.from(itemSubmit.parentElement);
            for (i = 0; i < children.length; i++) {
                if (children[i].hasAttribute('aria-required')) {
                    if (children[i].value === '') {
                        children[i].classList.add('error');
                        result += false;
                    }
                    else if (children[i].type === 'checkbox' && !children[i].checked) {
                        children[i].classList.add('error');
                        result += false;
                    }
                    else {
                        children[i].classList.remove('error');
                        result += true;
                    }
                }
            }
            for (i = 0; i < children.length; i++) {
                if(children[i].classList.contains('error')){
                    children[i].parentElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    return false;
                }
            }
            find__error = result.match(/false/);
            if (find__error === null) {
                find__error = true
            }
            else {
                find__error = false
            }
            return find__error;
        },
        // Читать полностью
        ReadMore: () => {
            let item = document.querySelectorAll('[data-readmore]');
            for (i = 0; i < item.length; i++) {
                item[i].addEventListener('click', (e) => {
                    if (e.target.textContent === e.target.dataset.readmore) {
                        e.target.textContent = 'Скрыть';
                    }
                    else if (e.target.classList.contains('collapsed')) {
                        e.target.textContent = e.target.dataset.readmore;
                    }
                })
            }
        },
        
        // Проверим, мобилка ли
        IsMobile: () => {
            let check = false;
            (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
            return check;
        },
        
        // стандартный smooth скролл до объекта.
        ScrolltoObject: () => {
            let items = document.querySelectorAll('[data-scroll]');
            for (i = 0; i < items.length; i++) {
                let item = items[i];
                item.addEventListener('click', (e) => {
                    let link = item.dataset.scroll;
                    if (link === 'this') {
                        e.target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                    else {
                        document.querySelector(link).scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }

                })
            }
        },

        // Игнорирует вызовы передаваемой функции пока не пройдет определенное ожидание
        Throttle: (func, ms) => {
            let locked = false
            return function () {
                if (locked) return
                const context = this
                const args = arguments
                locked = true
                setTimeout(() => {
                    func.apply(context, args)
                    locked = false
                }, ms)

            }
        },
        
        // Игнорирование вызовов передаваемой функции (resize, scroll, keydown)
        Debounce: function (func, ms, now) {
            let onLast
            return function () {
                const context = this
                const args = arguments
                const onFirst = now && !onLast
                clearTimeout(onLast)
                onLast = setTimeout(() => {
                    onLast = null
                    if (!now) func.apply(context, args)
                }, ms)
                if (onFirst) func.apply(context, args)
            }
        },
    }
}();

document.addEventListener('DOMContentLoaded', () => {
    'use strict';
    app.init();
});


//sliders init
const mainSlider = new Swiper('.main-slider .swiper', {
    speed: 600, autoHeight: true, slidesPerView: 1, spaceBetween: 100, slideActiveClass: 'active',
    autoplay: { delay: 6000 },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
});

const customersLogoSection = new Swiper('.customers-slider .swiper', {
    slidesPerView: 'auto', spaceBetween: 40,freeMode: true, center: true, 
    breakpoints: {
        1600: {
            spaceBetween: 65,
        },
    }
});

const advantagesSlider = new Swiper('.advantages-section .swiper', {
    slidesPerView: 1,
    spaceBetween: 20,
    breakpoints: {
        1400: {
            slidesPerView: 4,
        },

        992: {
            slidesPerView: 3,
        },

        768: {
            slidesPerView: 2,
        },
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
});

const anotherPagesSlider = new Swiper('.another-pages .swiper', {
    slidesPerView: 1,
    spaceBetween: 25,
    breakpoints: {
        1400: {
            slidesPerView: 3,
        },

        992: {
            slidesPerView: 2,
        },

        768: {
            slidesPerView: 1,
        },
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
});

const casesSlider = new Swiper('.cases-slider .swiper', {
    slidesPerView: 1.2,
    spaceBetween: 20,
    navigation: { prevEl: '.cases-slider__prev', nextEl: '.cases-slider__next', disabledClass: 'disabled' },
});

const aboutSlider = new Swiper('.about-slider .swiper', {
    slidesPerView: 1,
    spaceBetween: 20,
    navigation: { prevEl: '.about-slider__prev', nextEl: '.about-slider__next', disabledClass: 'disabled' },
});

const sertificateSlider = new Swiper('.sertificate-slider .swiper', {
    slidesPerView: 1,
    spaceBetween: 25,
    breakpoints: {
        1400: {
            slidesPerView: 3,
        },

        992: {
            slidesPerView: 2,
        },

        768: {
            slidesPerView: 1,
        },
    },
});

 
//fancybox init
Fancybox.bind('[data-fancybox]', {
   
});    
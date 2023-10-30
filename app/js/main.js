document.addEventListener('alpine:init', () => {
    Alpine.data('sidebar', () => ({
        sidebarWidth: 100,
        position: "translate-x-0",

        moveLeft(clickedButton) {
            currentIndex = parseInt(getIndex(clickedButton) + 1);
            widthToMove = String(currentIndex * this.sidebarWidth);
            if (widthToMove === '0') {
                this.position = "translate-x-0";
            } else {
                this.position = "-translate-x-" + widthToMove;
            }

            console.log(this.position);
        },
        moveRight(clickedButton) {
            
            currentIndex = parseInt(getIndex(clickedButton) - 1);
            widthToMove = String(currentIndex * this.sidebarWidth);
            if (widthToMove === '0') {
                this.position = "translate-x-0";
            } else {
                this.position = "-translate-x-" + widthToMove;
            }

            console.log(this.position);
        },
    }))
})


function getIndex(clickedButton) {
    const cont = document.querySelector('.header__sidebar-item'),
        children = Array.from(cont.children);


    if (clickedButton.matches('.header__sidebar-item button')) {
        const idx = children.indexOf(clickedButton.closest('.sidebar-menu'))
        return idx;
    }

}
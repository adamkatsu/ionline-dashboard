const tabToggle = document.querySelectorAll('.tab-toggle');
     const tabContent = document.querySelectorAll('.tab-content')

    tabToggle.forEach((tab) => {
        tab.addEventListener('click', () => {

            tabToggle.forEach((x) => {
                x.classList.remove('midBigOnfocus');
            })
            tab.classList.add('midBigOnfocus');

            tabContent.forEach((y) => {
                y.classList.add('hide');
                if(tab.getAttribute('data-table') === y.getAttribute('id')) {
                    y.classList.remove('hide');
                }

            })
        })
    })
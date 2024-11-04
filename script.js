function animate({ timing, draw, duration }) {
    return new Promise(resolve => {
        let start = performance.now();

        requestAnimationFrame(function animate(time) {
            let timeFraction = (time - start) / duration;
            if (timeFraction > 1) timeFraction = 1;

            let progress = timing(timeFraction);

            draw(progress);

            if (timeFraction < 1) {
                requestAnimationFrame(animate);
            } else {
                resolve();
            }
        })
    });
}

function makeEaseOut(timing) {
    return function (timeFraction) {
        return 1 - timing(1 - timeFraction);
    };
}

function quad(timeFraction) {
    return Math.pow(timeFraction, 2)
}

let quadEaseOut = makeEaseOut(quad);

function animateText(field, text) {
    let to = text.length;
    let from = 0;

    animate({
        duration: 1000,
        timing: quadEaseOut,
        draw: function (progress) {
            let result = (to - from) * progress + from;
            field.textContent = text.slice(0, Math.ceil(result))
        }
    });
}
const cards = Array.from(document.querySelectorAll('.card'));
const menuLinks = Array.from(document.querySelectorAll('.menu-link'));

const getClassName = (title) => {
    return title.trim().toLowerCase().replace(/\s/, '-');
}

const configCard = (card, daily, weekly, monthly) => {
    const cardElement = document.querySelector(`.${card}`);

    cardElement.dataset.dailyCurrent = daily.current;
    cardElement.dataset.dailyPrevious = daily.previous;
    cardElement.dataset.weeklyCurrent = weekly.current;
    cardElement.dataset.weeklyPrevious = weekly.previous;
    cardElement.dataset.monthlyCurrent = monthly.current;
    cardElement.dataset.monthlyPrevious = monthly.previous;

    fillInCard(cardElement, 'weekly')
}

const fillInCard = (card, timeframe) => {
    const elementCurrent = card.querySelector('.current');
    const elementPrevious = card.querySelector('.previous');
    let current = '';
    let previous = '';
    let lastWhat = '';
    switch (timeframe) {
        case 'daily':
            current = card.dataset.dailyCurrent;
            previous = card.dataset.dailyPrevious;
            lastWhat = 'Yesturday'
            break;
        case 'weekly':
            current = card.dataset.weeklyCurrent;
            previous = card.dataset.weeklyPrevious;
            console.log(card.dataset.weeklyPrevious)
            lastWhat = 'Last week'
            break;
        case 'monthly':
            current = card.dataset.monthlyCurrent;
            previous = card.dataset.monthlyPrevious;
            lastWhat = 'Last month'
            break;

    }

    animateText(elementCurrent, `${current}hrs`);
    // elementCurrent.textContent = `${current}hrs`
    elementPrevious.textContent = `${lastWhat} - ${previous}`
}

const onMenuLinkClick = (evt) => {
    evt.preventDefault();
    const currentLink = evt.target;
    let timeframe = '';
    if (!currentLink.classList.contains('active')) {
        menuLinks.forEach((link) => {
            link.classList.remove('active');
        })
        currentLink.classList.add('active');
        timeframe = currentLink.textContent.toLowerCase();
        cards.forEach((card) => {
            fillInCard(card, timeframe);
        })
    }
    return;
}

menuLinks.forEach((link) => {
    link.addEventListener('click', onMenuLinkClick)
})

const onFail = (error) => {
    console.log(error)
}

const onSuccess = (data) => {
    const getCardData = ({ title, timeframes }) => {
        const cardClass = getClassName(title)
        const { daily, weekly, monthly } = timeframes;
        configCard(cardClass, daily, weekly, monthly)
    }

    data.forEach((unit) => {
        getCardData(unit);
    })

}

const getData = async (onSuccess, onFail) => {
    try {
        const response = await fetch(
            './data.json'
        );

        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const resp = await response.json();
        onSuccess(resp);
    } catch (error) {
        onFail(error.message);
    }
};

getData(onSuccess, onFail);
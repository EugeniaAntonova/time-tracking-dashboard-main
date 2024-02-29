const cards = Array.from(document.querySelectorAll('.card'));
const menuLinks = Array.from(document.querySelectorAll('.menu-link'));
console.log(menuLinks)

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
    console.log(card);
    const elementCurrent = card.querySelector('.current');
    console.log(elementCurrent);
    const elementPrevious = card.querySelector('.previous');
    console.log(elementPrevious);
    let current = '';
    let previous = '';
    let lastWhat = '';
    switch (timeframe) {
        case 'daily':
            current = card.dataset.dailyCurrent;
            console.log(card.dataset.weeklyCurrent)
            previous = card.dataset.dailyPrevious;
            console.log(card.dataset.weeklyCurrent)
            lastWhat = 'Yesturday'
            break;
        case 'weekly':
            current = card.dataset.weeklyCurrent;
            console.log(card.dataset.weeklyCurrent)
            previous = card.dataset.weeklyPrevious;
            console.log(card.dataset.weeklyPrevious)
            lastWhat = 'Last week'
            break;
        case 'monthly':
            current = card.dataset.monthlyCurrent;
            console.log(card.dataset.weeklyCurrent)
            previous = card.dataset.monthlyPrevious;
            console.log(card.dataset.weeklyCurrent)
            lastWhat = 'Last month'
            break;

    }

    elementCurrent.textContent = `${current}hrs`
    elementPrevious.textContent = `${lastWhat} - ${previous}`
}

const onMenuLinkClick = (evt) => {
    evt.preventDefault();
    const currentLink = evt.target;
    console.log(currentLink)
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
        const cardTitle = title;
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
            '/data.json'
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
// cards.forEach((card) => {
//     fillInCard(card, 'weekly');
// })
// Initial vars & functions
const neededImageArticles = 4
const newscontainer = document.querySelector('.newscontainer')
const mainnews = document.querySelector('.main-news')
const verticalnews = document.querySelector('.vertical-news')
const othernews = document.querySelector('.other-news > div')

// Making HTML element
function createElement (type, attributes) {
    const element = document.createElement(type)
    for (var attribute in attributes) {
        element.setAttribute(attribute, attributes[attribute])
    }
    return element
}

// Setting basic article structure
function createArticle (article) {
    const title = createElement('h3')
    title.append(article.title)

    const published = createElement('time')
    published.append(article.publishedAt.substring(0, 10))

    const articlelink = createElement('a', {href: article.url, target: '_blank'})
    articlelink.append('Go to article >>')

    const newsitemtext = createElement('div', {'class': 'newsitemtext'})
    newsitemtext.append(title)
    newsitemtext.append(published)
    newsitemtext.append(articlelink)

    const newsitem = createElement('div', {'class': 'newsitem twelve'})
    newsitem.append(newsitemtext)

    return newsitem
}

// Creating HTML article with image
function createImageArticle (article) {
    const DOMarticle = createArticle(article)

    // image
    const newsimage = createElement('div', {'class': 'newsimage'})
    DOMarticle.prepend(newsimage)
    DOMarticle.classList.add('hasimage')

    // find stuff to add stuff
    const newsitemtext = DOMarticle.querySelector('.newsitemtext')

    // description
    if (article.description != null) {
        const text = createElement('p')
        text.append(article.description.substring(0, 100).trim() + '...')
        newsitemtext.append(text)
    }

    // backup image if empty string
    if (article.urlToImage === "") {
        newsimage.style.backgroundImage = "url('images/backup-newsimage.jpg')" // backup for faulty images
    } else {
        newsimage.style.backgroundImage = "url('" + article.urlToImage + "')"
    }

    return DOMarticle
}

// Getting news via API
fetch('https://newsapi.org/v2/top-headlines?sources=hacker-news&apiKey=d5fd3705dc214827afd29a85565e7693')

// Check for errors
    .then(HNresult => {
    if (!HNresult.ok) {
        throw HNresult
    }
    return HNresult.json()
})

// Setting article arrays 
    .then(HNresult => {
    let imageArticles = []
    let otherArticles = []
    for (var i = 0; i < HNresult.articles.length; i++) {
        const article = HNresult.articles[i]
        if (article.urlToImage != null && imageArticles.length < neededImageArticles) {
            imageArticles.push(article)
        } else {
            otherArticles.push(article)
        }
    }

    if (imageArticles.length < neededImageArticles) {
        const needed = neededImageArticles - imageArticles.length
        otherArticles.slice(0, needed).forEach(function (article) {
            imageArticles.push(article)
        })
        otherArticles = otherArticles.slice(needed, otherArticles.length)
    }

    // Loop articles WITH images
    for (let i = 0; i < imageArticles.length; i++) {
        const article = imageArticles[i]
        const DOMarticle = createImageArticle(article)
        DOMarticle.classList.add(`mainitem-${i + 1}`)
        if (i < 3) {
            mainnews.append(DOMarticle)
        } else {
            verticalnews.append(DOMarticle)
        }
    }

    // Loop articles WITHOUT images
    for (let i = 0; i < otherArticles.length; i++) {
        const article = otherArticles[i]
        const DOMarticle = createArticle(article)
        othernews.append(DOMarticle)
    }
})

// Error message
    .catch(err => {
    err.text().then(errorMessage => {
        const errormessage = createElement('div', {'class': 'error'})
        errormessage.append('Whoops! Something went wrong fetching Hacker News, please look back later!')
        newscontainer.prepend(errormessage)
    })
})

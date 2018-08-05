// Initial vars & functions
const neededImageArticles = 4
const newscontainer = document.getElementById('newscontainer')
const mainnews = document.getElementById('main-news')
const verticalnews = document.getElementById('vertical-news')
const othernews = document.getElementById('other-news')

// Creating HTML element
function createElement (type, attributes) {
  const element = document.createElement(type)
  for (var attribute in attributes) {
    element.setAttribute(attribute, attributes[attribute])
  }
  return element
}

// Creating article HTML structure
function createArticle (article) {
  const title = createElement('h3')
  title.append(article.title)

  const articlelink = createElement('a', {href: article.url, target: '_blank'})
  articlelink.append('Go to article >>')

  const newsitemtext = createElement('div', {'class': 'newsitemtext'})
  newsitemtext.append(title)
  newsitemtext.append(articlelink)

  const newsitem = createElement('div', {'class': 'newsitem twelve'})
  newsitem.append(newsitemtext)

  return newsitem
}

// Creating article with image HTML structure
function createImageArticle (article) {
  const DOMarticle = createArticle(article)

  const newsimage = createElement('div', {'class': 'newsimage'})
  DOMarticle.prepend(newsimage)

  DOMarticle.classList.add('has_image')

  const newsitemtext = DOMarticle.querySelector('.newsitemtext')

  // text wrapper
  const textwrapper = createElement('div', {'class': 'textwrapper'})
  newsitemtext.append(textwrapper)

  // description
  if (article.description != null) {
    const text = createElement('p')
    text.append(article.description.substring(0, 70))
    textwrapper.append(text)
  }

  // date + author
  const published = createElement('time')
  published.append(article.publishedAt.substring(0, 10))
  textwrapper.append(published)

  if (article.author != null) {
    const author = createElement('span')
    author.append('Source: ' + article.author)
    textwrapper.append(author)
  }

  if (!article.urlToImage) {
    newsimage.style.backgroundImage = "url('backup_newsimage.jpg')" // backup for faulty images
  } else {
    newsimage.style.backgroundImage = "url('" + article.urlToImage + "')"
  }

  return DOMarticle
}

// Getting news
fetch('https://newsapi.org/v2/everything?sources=hacker-news&apiKey=d5fd3705dc214827afd29a85565e7693')

// Check for errors
  .then(HNresult => {
    if (!HNresult.ok) {
      throw HNresult
    }
    return HNresult.json()
  })

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

    // Loop image articles
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

    // Non-image articles
    for (let i = 0; i < otherArticles.length; i++) {
      const article = otherArticles[i]
      const DOMarticle = createArticle(article)
      othernews.append(DOMarticle)
    }
  })

// error message
  .catch(err => {
    err.text().then(errorMessage => {
      const errormessage = document.createElement('div')
      errormessage.setAttribute('class', 'error twelve')
      errormessage.textContent = 'Whoops! Something went wrong fetching the news, please look back later!'
      newscontainer.append(errormessage)
    })
  })

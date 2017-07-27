

const loadInventory = function() {
  fetch('/api/v1/inventory')
  .then((response) => response.json())
  .then((data) => {
    data.forEach((item) => {
      let formattedItem = `
        <article class='card'>
          <h3 class='item-title'>${item.title}</h3>
          <img src='${item.image_url}' class='card-image' alt='${item.title}'>
          <p class='item-description>${item.description}</p>
        </article>
        `
      $('#products-section').prepend(formattedItem)
    })
    console.log(data, 'inventory')
  })
}

loadInventory()
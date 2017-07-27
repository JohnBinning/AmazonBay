
const findDuplicates = (cart, title) => {
  return cart.find((item) => {
    return item.title === title;
  });
};

const addToCartStorage = (item) => {
  const { title, price } = item;

  const body = {
    title,
    price
  };

  let cart = JSON.parse(localStorage.getItem('cart'));

  if (!cart) {
    cart = [];
  }

  const duplicateItems = findDuplicates(cart, title);

  duplicateItems ? false : cart.push(body);
  localStorage.setItem('cart', JSON.stringify(cart));
};


const addItemToPage = (data) => {
  data.forEach((item) => {
    const { title, image_url, description, price } = item;
    const formattedPrice = price / 100;

    const formattedItem = `
      <article class='card'>
        <h3 class='item-title'>${title}</h3>
        <img src='${image_url}' class='card-image' alt='${item.title}'>
        <p class='item-description>${description}</p>
        <p class='item-price'>$${formattedPrice}</p>
        <button class='add-to-cart'>ADD TO CART</button>
      </article>
      `
    $('#products-section').prepend(formattedItem)
    $('.add-to-cart').on('click', () => {
      const itemToAdd = {
        title,
        price
      };
      addToCartStorage(itemToAdd);
      })
  });
};

const loadInventory = function() {
  fetch('/api/v1/inventory')
  .then((response) => response.json())
  .then((data) => {
      addItemToPage(data);   
  })
  .catch((error) => {
    console.log(error, 'something went getting the inventory')
  });
};

loadInventory();

$('.toggle-cart').on('click', () => {
  let currentWidth = $('.cart').width() == 100 ? '300px' : '100px';
  $('.cart').animate({width: currentWidth});
})

$('.toggle-order-history').on('click', () => {
  let currentWidth = $('.order-history').width() == 100 ? '300px' : '100px';
  $('.order-history').animate({width: currentWidth});
})
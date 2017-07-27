
const findDuplicates = (cart, title) => {
  return cart.find((item) => {
    return item.title === title;
  });
};

const addToCart = (item) => {
  const { title, price, formattedPrice } = item;

  const body = {
    title,
    formattedPrice,
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
    let priceString = price.toString();
    let spliceIndex = priceString.length - 2;
    let formattedPrice = priceString.slice(0, spliceIndex) + '.' + priceString.slice(spliceIndex);
    const formattedItem = `
      <article class='card'>
        <h3 class='item-title'>${title}</h3>
        <img src='${image_url}' class='card-image' alt='${item.title}'>
        <p class='item-description>${description}</p>
        <p class='item-price'>${formattedPrice}</p>
        <button class='add-to-cart'>ADD TO CART</button>
      </article>
      `
    $('#products-section').prepend(formattedItem)
    $('.add-to-cart').on('click', () => {
      const itemToAdd = {
        title,
        formattedPrice,
        price
      };
      addToCart(itemToAdd);
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
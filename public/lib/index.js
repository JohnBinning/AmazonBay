
const findDuplicates = (cart, title) => {
  return cart.find((item) => {
    return item.title === title;
  });
};

const clearCartTarget = () => {
  $('.cart-target').html('');
}

const updateStoragePrice = (amount, reset) => {
  let price = JSON.parse(localStorage.getItem('price'));
  if (!price) {
    price = 0;
  }
  reset ? price = 0 : price += amount;
  localStorage.setItem('price', JSON.stringify(price))
}

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

  if(!duplicateItems) {
    cart.push(body);
    updateStoragePrice(price)
  }
  localStorage.setItem('cart', JSON.stringify(cart));
};

const prependOrders = (data) => {
  data.forEach((order) => {
    const formattedOrder = `
    <article class='order-card'>
      <h4 class='order-price'>Order total: $${order.price / 100}</h4>
      <p class='order-time'>Date purchased: ${order.created_at.slice(0, 10)}</p>
    </article>`
    $('#order-target').prepend(formattedOrder);
  });
}

const getOrderHistory = () => {
  fetch('/api/v1/orders')
  .then((response) => response.json())
  .then((data) => {
    setTimeout(() => { 
      $('#order-target').html('')
      prependOrders(data);
    }, 200);
  })
  .catch((error) => {
    console.log(error, 'something went wrong getting the order history')
  });
};

const prependToCart = (items) => {
  items.forEach((item) => {
    const { title, price } = item;
    const formattedPrice = price / 100;
    const card = `
      <article class='cart-card'>
        <h4 class='cart-card-title'>${title}</h4>
        <div class='cart-card-price'>Price: $<span class='cart-card-price-amount'>${formattedPrice}</span></div>
      </article>`
    $('.cart-target').prepend(card);
  });
  updateCartTotal();
};

const addItemToPage = (data) => {
  data.forEach((item) => {
    const { title, image_url, description, price } = item;
    const formattedPrice = price / 100;

    const formattedItem = `
      <article class='card'>
        <h3 class='item-title'>${title}</h3>
        <p class='item-description'>Description: ${description}</p>
        <img src='${image_url}' class='card-image' alt='${item.title}'>
        <p class='item-price'>Price: $${formattedPrice}</p>
        <button class='add-to-cart'>ADD TO CART</button>
      </article>
      `
    $('#products-section').prepend(formattedItem)
    $('.add-to-cart').on('click', () => {
      const itemToAdd = {
        title,
        price
      };
      clearCartTarget();
      addToCartStorage(itemToAdd);
      let items = JSON.parse(localStorage.getItem('cart'));
      prependToCart(items)
      updateCartTotal()
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
    console.log(error, 'something went wrong getting the inventory')
  });
};

loadInventory();

const updateCartTotal = () => {
  let updatePrice = JSON.parse(localStorage.getItem('price'))
  $('#cart-total-amount').html(`${updatePrice / 100}`)
};

const showCartContent = () => {
  let items = JSON.parse(localStorage.getItem('cart'));
  setTimeout(() => { 
    $('#cart-total-text').toggleClass('hidden');
    $('#checkout').toggleClass('hidden');
    $('.cart-target').toggleClass('hidden');


    if (!items) {
      $('.cart-target').prepend(`<div class='empty-cart'>Your cart is empty</div>`)
      $('#cart-total-amount').html('0')
    } else {
      prependToCart(items);
    }
  }, 280);
};

const hideCartCards = () => {
  setTimeout(() => { 
    $('#cart-total-text').toggleClass('hidden');
    $('#checkout').toggleClass('hidden');
    $('.cart-target').toggleClass('hidden');
    clearCartTarget();
  }, 280);
}

$('.toggle-cart').on('click', () => {
  let currentWidth = $('.cart').width() == 100 ? '300px' : '100px';
  currentWidth === '100px' ? hideCartCards() : showCartContent()
  $('.cart').animate({width: currentWidth});
});

$('.toggle-order-history').on('click', () => {
  let currentWidth = $('.order-history').width() == 100 ? '300px' : '100px';
  $('.order-history').animate({width: currentWidth});
  setTimeout(() => {
    $('#order-target').toggleClass('hidden');
  }, 140);
  getOrderHistory()
});



$('#checkout').on('click', () => {
  let price = JSON.parse(localStorage.getItem('price'))
  fetch(`/api/v1/orders/${price}`, {
      method: 'POST'
    })
    .then(resp => {
      getOrderHistory();
      return resp.json();
    })
    .catch((error) => {
    console.log(error, 'something went wrong processing the order')
  });
    localStorage.clear();
    updateCartTotal();
    clearCartTarget();
});

updateCartTotal();
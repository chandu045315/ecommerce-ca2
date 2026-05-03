import { useState, useEffect } from 'react'
import { ProductList } from './Components/ProductList'
import itemList from './Assets/random_products_175.json';
import './e-commerce-stylesheet.css'

type Product = {
  id: number
  name: string
  price: number
  category: string
  quantity: number
  rating: number
  image_link: string
}

type BasketItem = Product & {
  basketQuantity: number
}

function App() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortMethod, setSortMethod] = useState<string>('AtoZ');
  const [showInStockOnly, setShowInStockOnly] = useState<boolean>(false);
  const [searchedProducts, setSearchedProducts] = useState<Product[]>(itemList);
  const [basket, setBasket] = useState<BasketItem[]>([]);

  useEffect(() => updateSearchedProducts(), [searchTerm, sortMethod, showInStockOnly]);

  function showBasket(){
    let areaObject = document.getElementById('shopping-area');
    if(areaObject !== null){
      areaObject.style.display='block';
    }
  }

  function hideBasket(){
    let areaObject = document.getElementById('shopping-area');
    if(areaObject !== null){
      areaObject.style.display='none';
    }
  }

  function addToBasket(product: Product){
    setBasket(currentBasket => {
      const existingItem = currentBasket.find(item => item.id === product.id);

      if(existingItem !== undefined){
        return currentBasket.map(item =>
          item.id === product.id
            ? { ...item, basketQuantity: item.basketQuantity + 1 }
            : item
        );
      }

      return [...currentBasket, { ...product, basketQuantity: 1 }];
    });
  }

  function removeFromBasket(productId: number){
    setBasket(currentBasket =>
      currentBasket
        .map(item =>
          item.id === productId
            ? { ...item, basketQuantity: item.basketQuantity - 1 }
            : item
        )
        .filter(item => item.basketQuantity > 0)
    );
  }

  function getBasketTotal(){
    return basket.reduce((total, item) => total + item.price * item.basketQuantity, 0);
  }

  function updateSearchedProducts(){
    let holderList: Product[] = [...itemList];

    holderList = holderList.filter((product: Product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if(showInStockOnly){
      holderList = holderList.filter((product: Product) => product.quantity > 0);
    }

    holderList.sort((firstProduct: Product, secondProduct: Product) => {
      switch(sortMethod){
        case 'ZtoA':
          return secondProduct.name.localeCompare(firstProduct.name);
        case '£LtoH':
          return firstProduct.price - secondProduct.price;
        case '£HtoL':
          return secondProduct.price - firstProduct.price;
        case '*LtoH':
          return firstProduct.rating - secondProduct.rating;
        case '*HtoL':
          return secondProduct.rating - firstProduct.rating;
        case 'AtoZ':
        default:
          return firstProduct.name.localeCompare(secondProduct.name);
      }
    });

    setSearchedProducts(holderList);
  }

  function getResultsIndicator(){
    const numberOfProducts = searchedProducts.length;
    const trimmedSearchTerm = searchTerm.trim();

    if(trimmedSearchTerm === ''){
      return numberOfProducts === 1 ? '1 Product' : `${numberOfProducts} Products`;
    }

    if(numberOfProducts === 0){
      return 'No search results found';
    }

    return numberOfProducts === 1 ? '1 Result' : `${numberOfProducts} Results`;
  }

  return (
    <div id="container"> 
      <div id="logo-bar">
        <div id="logo-area">
          <img src="/Logo.png"></img>
        </div>

        <div id="shopping-icon-area">
          <img id="shopping-icon" onClick={showBasket} src="/shopping-basket.png"></img>
        </div>

        <div id="shopping-area">
          <div id="exit-area">
            <p id="exit-icon" onClick={hideBasket}>x</p>
          </div>

          {basket.length === 0 ? (
            <p>Your basket is empty</p>
          ) : (
            <>
              {basket.map((item) => (
                <div key={item.name} className="shopping-row">
                  <div className="shopping-information">
                    <p>{item.name} (£{item.price.toFixed(2)}) - {item.basketQuantity}</p>
                  </div>
                  <button onClick={() => removeFromBasket(item.id)}>Remove</button>
                </div>
              ))}

              <p>Total: £{getBasketTotal().toFixed(2)}</p>
            </>
          )}
        </div>
      </div>

      <div id="search-bar">
        <input 
          type="text" 
          placeholder="Search..." 
          onChange={changeEventObject => setSearchTerm(changeEventObject.target.value)}
        ></input>

        <div id="control-area">
          <select value={sortMethod} onChange={changeEventObject => setSortMethod(changeEventObject.target.value)}>
            <option value="AtoZ">By name (A - Z)</option>
            <option value="ZtoA">By name (Z - A)</option>
            <option value="£LtoH">By price (low - high)</option>
            <option value="£HtoL">By price (high - low)</option>
            <option value="*LtoH">By rating (low - high)</option>
            <option value="*HtoL">By rating (high - low)</option>
          </select>

          <input 
            id="inStock" 
            type="checkbox" 
            checked={showInStockOnly} 
            onChange={changeEventObject => setShowInStockOnly(changeEventObject.target.checked)}
          ></input>

          <label htmlFor="inStock">In stock</label>
        </div>
      </div>

      <p id="results-indicator">{getResultsIndicator()}</p>

      <ProductList itemList={searchedProducts} addToBasket={addToBasket}/>
    </div>
  )
}

export default App
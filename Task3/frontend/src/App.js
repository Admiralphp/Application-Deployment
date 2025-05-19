// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    // Charger les produits au démarrage
    fetchProducts();
    // Vérifier si l'utilisateur est connecté
    checkAuth();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/catalogue/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
    }
  };

  const checkAuth = async () => {
    try {
      const response = await axios.get('/api/users/current');
      if (response.data && response.data.username) {
        setUser(response.data);
      }
    } catch (error) {
      console.error('Non authentifié:', error);
    }
  };

  const login = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/users/login', 
        { username, password },
        { 
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      setUser(response.data);
      setUsername('');
      setPassword('');
    } catch (error) {
      console.error('Erreur de connexion:', error);
      alert('Échec de la connexion');
    }
  };

  const logout = async () => {
    try {
      await axios.post('/api/users/logout');
      setUser(null);
      setCart([]);
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
    }
  };

  const addToCart = async (productId) => {
    if (!user) {
      alert('Veuillez vous connecter pour ajouter des produits au panier');
      return;
    }
    
    try {
      await axios.post('/api/cart/add', { productId, quantity: 1 });
      fetchCart();
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
    }
  };

  const fetchCart = async () => {
    try {
      const response = await axios.get('/api/cart');
      setCart(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement du panier:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>ShopFast</h1>
        {user ? (
          <div className="user-info">
            <p>Bienvenue, {user.username}</p>
            <button onClick={logout}>Déconnexion</button>
          </div>
        ) : (
          <form onSubmit={login} className="login-form">
            <input
              type="text"
              placeholder="Nom d'utilisateur"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Connexion</button>
          </form>
        )}
      </header>
      
      <div className="container">
        <div className="products-container">
          <h2>Catalogue de Produits</h2>
          <div className="products-grid">
            {products.map(product => (
              <div key={product.id} className="product-card">
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <p className="price">{product.price} €</p>
                <button onClick={() => addToCart(product.id)}>
                  Ajouter au panier
                </button>
              </div>
            ))}
          </div>
        </div>
        
        {user && (
          <div className="cart-container">
            <h2>Panier</h2>
            {cart.length === 0 ? (
              <p>Votre panier est vide</p>
            ) : (
              <div>
                {cart.map(item => (
                  <div key={item.productId} className="cart-item">
                    <p>{item.productName} - Quantité: {item.quantity}</p>
                    <p>{item.price * item.quantity} €</p>
                  </div>
                ))}
                <div className="cart-total">
                  <h3>Total: {cart.reduce((total, item) => total + (item.price * item.quantity), 0)} €</h3>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

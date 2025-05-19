// cart-service/server.js
const express = require('express');
const redis = require('redis');
const { promisify } = require('util');
const axios = require('axios');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);

const app = express();
const PORT = process.env.PORT || 4000;

// Configuration Redis
const REDIS_HOST = process.env.REDIS_HOST || 'redis';
const REDIS_PORT = process.env.REDIS_PORT || 6379;

// Configuration du service catalogue
const CATALOGUE_SERVICE_URL = process.env.CATALOGUE_SERVICE_URL || 'http://catalogue-service:5000';

// Créer le client Redis
const redisClient = redis.createClient({
  host: REDIS_HOST,
  port: REDIS_PORT
});

// Promisify redis commands
const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);
const delAsync = promisify(redisClient.del).bind(redisClient);

// Erreur Redis
redisClient.on('error', (err) => {
  console.error('Erreur Redis:', err);
});

// Configuration du middleware
app.use(express.json());

// Middleware de session avec Redis
app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET || 'shopping_cart_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 heures
  }
}));

// Middleware pour vérifier l'authentification
const isAuthenticated = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Non authentifié' });
  }
  next();
};

// Fonction pour récupérer les détails d'un produit
const getProductDetails = async (productId) => {
  try {
    const response = await axios.get(`${CATALOGUE_SERVICE_URL}/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération du produit ${productId}:`, error);
    throw new Error(`Produit non trouvé: ${productId}`);
  }
};

// Route pour ajouter un produit au panier
app.post('/add', async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.session.userId;
    
    if (!productId || !quantity || quantity <= 0) {
      return res.status(400).json({ error: 'Données invalides' });
    }
    
    // Vérifier si le produit existe
    let productDetails;
    try {
      productDetails = await getProductDetails(productId);
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
    
    const cartKey = `cart:${userId}`;
    
    // Récupérer le panier actuel
    let cart = [];
    const cartData = await getAsync(cartKey);
    
    if (cartData) {
      cart = JSON.parse(cartData);
    }
    
    // Vérifier si le produit est déjà dans le panier
    const existingItemIndex = cart.findIndex(item => item.productId === productId);
    
    if (existingItemIndex >= 0) {
      // Mettre à jour la quantité
      cart[existingItemIndex].quantity += quantity;
    } else {
      // Ajouter le nouveau produit
      cart.push({
        productId,
        productName: productDetails.name,
        price: productDetails.price,
        quantity
      });
    }
    
    // Sauvegarder le panier dans Redis
    await setAsync(cartKey, JSON.stringify(cart));
    
    res.status(200).json({ message: 'Produit ajouté au panier', cart });
  } catch (error) {
    console.error('Erreur lors de l\'ajout au panier:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour obtenir le contenu du panier
app.get('/', async (req, res) => {
  try {
    const userId = req.session.userId;
    const cartKey = `cart:${userId}`;
    
    const cartData = await getAsync(cartKey);
    
    if (!cartData) {
      return res.status(200).json([]);
    }
    
    const cart = JSON.parse(cartData);
    res.status(200).json(cart);
  } catch (error) {
    console.error('Erreur lors de la récupération du panier:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour supprimer un produit du panier
app.delete('/remove/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.session.userId;
    const cartKey = `cart:${userId}`;
    
    // Récupérer le panier actuel
    const cartData = await getAsync(cartKey);
    
    if (!cartData) {
      return res.status(404).json({ error: 'Panier non trouvé' });
    }
    
    let cart = JSON.parse(cartData);
    
    // Filtrer le produit à supprimer
    const newCart = cart.filter(item => item.productId !== productId);
    
    // Sauvegarder le nouveau panier
    await setAsync(cartKey, JSON.stringify(newCart));
    
    res.status(200).json({ message: 'Produit supprimé du panier', cart: newCart });
  } catch (error) {
    console.error('Erreur lors de la suppression du produit:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour vider le panier
app.delete('/clear', async (req, res) => {
  try {
    const userId = req.session.userId;
    const cartKey = `cart:${userId}`;
    
    await delAsync(cartKey);
    
    res.status(200).json({ message: 'Panier vidé' });
  } catch (error) {
    console.error('Erreur lors du vidage du panier:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route de santé pour les healthchecks
app.get('/health', (req, res) => {
  if (redisClient.connected) {
    res.status(200).json({ status: 'UP' });
  } else {
    res.status(503).json({ status: 'DOWN', error: 'Redis non connecté' });
  }
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Service panier démarré sur le port ${PORT}`);
});

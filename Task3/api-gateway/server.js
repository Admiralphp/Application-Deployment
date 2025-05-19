// api-gateway/server.js
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

// Configuration de proxy pour les services
const catalogueServiceUrl = process.env.CATALOGUE_SERVICE_URL || 'http://catalogue-service:5000';
const userServiceUrl = process.env.USER_SERVICE_URL || 'http://user-service:8080';
const cartServiceUrl = process.env.CART_SERVICE_URL || 'http://cart-service:4000';

// Proxy pour le service catalogue
app.use('/api/catalogue', createProxyMiddleware({
  target: catalogueServiceUrl,
  changeOrigin: true,
  pathRewrite: {
    '^/api/catalogue': '/'
  }
}));

// Proxy pour le service utilisateur
app.use('/api/users', createProxyMiddleware({
  target: userServiceUrl,
  changeOrigin: true,
  pathRewrite: {
    '^/api/users': '/api/users'
  },
  onProxyReq: (proxyReq, req) => {
    if (req.body) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  }
}));

// Proxy pour le service panier
app.use('/api/cart', createProxyMiddleware({
  target: cartServiceUrl,
  changeOrigin: true,
  pathRewrite: {
    '^/api/cart': '/'
  },
  onProxyReq: (proxyReq, req) => {
    if (req.body) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  }
}));

// Route de santé pour les healthchecks
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});

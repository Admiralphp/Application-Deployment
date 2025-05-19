// Classe de modèle pour logger les informations
package com.shopfast.userservice.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.shopfast.userservice.model.User;
import com.shopfast.userservice.repository.UserRepository;

import jakarta.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        logger.info("Demande d'inscription pour l'utilisateur: {}", user.getUsername());

        if (userRepository.existsByUsername(user.getUsername())) {
            logger.warn("Tentative d'inscription avec un nom d'utilisateur déjà pris: {}", user.getUsername());
            return new ResponseEntity<>("Nom d'utilisateur déjà pris", HttpStatus.BAD_REQUEST);
        }

        if (userRepository.existsByEmail(user.getEmail())) {
            logger.warn("Tentative d'inscription avec un email déjà utilisé: {}", user.getEmail());
            return new ResponseEntity<>("Email déjà utilisé", HttpStatus.BAD_REQUEST);
        }

        // Dans une application réelle, hashage du mot de passe
        User newUser = userRepository.save(user);
        logger.info("Nouvel utilisateur enregistré avec succès: {}", user.getUsername());

        // Ne pas retourner le mot de passe
        newUser.setPassword(null);
        return new ResponseEntity<>(newUser, HttpStatus.CREATED);
    }

    @PostMapping("/logappin")
    public ResponseEntity<?> logAppin(@RequestBody Map<String, String> credentials, HttpSession session) {
        String username = credentials.get("username");
        String password = credentials.get("password");
        logger.info("Demande de connexion pour l'utilisateur: {}", username);
        return credentials.get("username") != null && credentials.get("password") != null
                ? new ResponseEntity<>("Connexion réussie", HttpStatus.OK)
                : new ResponseEntity<>("Nom d'utilisateur ou mot de passe manquant", HttpStatus.BAD_REQUEST);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials, HttpSession session) {
        try {
            logger.debug("Received login request with payload: {}", credentials);

            if (credentials == null) {
                logger.error("Login request received with null credentials");
                return new ResponseEntity<>("Request body cannot be null", HttpStatus.BAD_REQUEST);
            }

            String username = credentials.get("username");
            String password = credentials.get("password");

            if (username == null || password == null) {
                logger.error("Missing username or password in request");
                return new ResponseEntity<>("Username and password are required", HttpStatus.BAD_REQUEST);
            }

            logger.info("Attempting login for user: {}", username);

            Optional<User> optionalUser = userRepository.findByUsername(username);

            if (optionalUser.isPresent()) {
                User user = optionalUser.get();
                // In a real application, password would be hashed
                if (password.equals(user.getPassword())) {
                    session.setAttribute("userId", user.getId());
                    logger.info("Login successful for user: {}", username);

                    user.setPassword(null);
                    return new ResponseEntity<>(user, HttpStatus.OK);
                }
            }

            logger.warn("Login failed for user: {}", username);
            return new ResponseEntity<>("Invalid credentials", HttpStatus.UNAUTHORIZED);

        } catch (Exception e) {
            logger.error("Error processing login request", e);
            return new ResponseEntity<>("Error processing login request: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        String userId = (String) session.getAttribute("userId");
        logger.info("Déconnexion de l'utilisateur ID: {}", userId);
        session.invalidate();
        return new ResponseEntity<>("Déconnexion réussie", HttpStatus.OK);
    }

    @GetMapping("/current")
    public ResponseEntity<?> getCurrentUser(HttpSession session) {
        String userId = (String) session.getAttribute("userId");
        logger.debug("Vérification de l'utilisateur courant, ID de session: {}", userId);

        if (userId != null) {
            Optional<User> optionalUser = userRepository.findById(userId);

            if (optionalUser.isPresent()) {
                User user = optionalUser.get();
                user.setPassword(null);
                logger.debug("Utilisateur trouvé: {}", user.getUsername());
                return new ResponseEntity<>(user, HttpStatus.OK);
            }
        }

        logger.debug("Aucun utilisateur authentifié trouvé");
        return new ResponseEntity<>("Aucun utilisateur authentifié trouvé", HttpStatus.UNAUTHORIZED);
    }

    @GetMapping("/health")
    public ResponseEntity<?> healthCheck() {
        logger.debug("Healthcheck demandé");
        Map<String, String> status = new HashMap<>();
        status.put("status", "UP");
        return new ResponseEntity<>(status, HttpStatus.OK);
    }

    @PostMapping("/test-credentials")
    public ResponseEntity<?> testCredentials(@RequestBody Map<String, String> credentials) {
        logger.info("Testing credentials reception");

        Map<String, Object> response = new HashMap<>();
        response.put("received", true);
        response.put("username", credentials.get("username"));
        response.put("fieldsReceived", credentials.keySet());

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}

package com.shopfast.userservice.utils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.shopfast.userservice.model.User;
import com.shopfast.userservice.repository.UserRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        // Vérifier si des utilisateurs existent déjà
        if (userRepository.count() == 0) {
            System.out.println("Initialisation des données utilisateurs...");
            
            // Créer un utilisateur administrateur
            User admin = new User("admin", "admin123", "admin@shopfast.com", "ADMIN");
            userRepository.save(admin);
            
            // Créer un utilisateur standard
            User user = new User("user", "user123", "user@shopfast.com", "USER");
            userRepository.save(user);
            
            System.out.println("Données utilisateurs initialisées avec succès!");
        }
    }
}
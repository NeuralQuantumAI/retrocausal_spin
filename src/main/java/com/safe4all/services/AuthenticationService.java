package com.safe4all.services;

import com.safe4all.models.AuthResponse;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.Map;

public class AuthenticationService {
    
    private Map<String, UserCredentials> userDatabase;
    
    public AuthenticationService() {
        initializeDemoData();
    }
    
    private void initializeDemoData() {
        userDatabase = new HashMap<>();
        
        userDatabase.put("caregiver1", new UserCredentials(
            "caregiver1", 
            hashPin("1234"), 
            "SuperCaregiver",
            "user-001"
        ));
        
        userDatabase.put("client1", new UserCredentials(
            "client1", 
            hashPin("5678"), 
            "Client",
            "user-002"
        ));
    }
    
    public AuthResponse authenticate(String username, String pin, String role, String deviceId) {
        if (username == null || pin == null || role == null) {
            return new AuthResponse(false, "001", "Missing required parameters");
        }
        
        UserCredentials user = userDatabase.get(username);
        if (user == null) {
            return new AuthResponse(false, "002", "User not found");
        }
        
        String hashedPin = hashPin(pin);
        if (!user.getHashedPin().equals(hashedPin)) {
            return new AuthResponse(false, "001", "Invalid PIN");
        }
        
        if (!user.getRole().equals(role)) {
            return new AuthResponse(false, "003", "Role mismatch");
        }
        
        return new AuthResponse(true, user.getUserId(), "000", "Authentication successful");
    }
    
    private String hashPin(String pin) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(pin.getBytes());
            StringBuilder hexString = new StringBuilder();
            
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not available", e);
        }
    }
    
    private static class UserCredentials {
        private String username;
        private String hashedPin;
        private String role;
        private String userId;
        
        public UserCredentials(String username, String hashedPin, String role, String userId) {
            this.username = username;
            this.hashedPin = hashedPin;
            this.role = role;
            this.userId = userId;
        }
        
        public String getUsername() { return username; }
        public String getHashedPin() { return hashedPin; }
        public String getRole() { return role; }
        public String getUserId() { return userId; }
    }
}
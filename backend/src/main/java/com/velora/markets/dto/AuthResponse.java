package com.velora.markets.dto;

public class AuthResponse {
    private Long userId;
    private String fullName;
    private String username;
    private String email;
    private String country;
    private String currency;
    private String subscriptionTier;
    private String role;
    private String token;
    private String tokenType;
    private String message;

    public AuthResponse() {}

    public AuthResponse(Long userId, String fullName, String username, String email,
                        String country, String currency, String subscriptionTier,
                        String role, String token, String tokenType, String message) {
        this.userId = userId;
        this.fullName = fullName;
        this.username = username;
        this.email = email;
        this.country = country;
        this.currency = currency;
        this.subscriptionTier = subscriptionTier;
        this.role = role;
        this.token = token;
        this.tokenType = tokenType;
        this.message = message;
    }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public String getSubscriptionTier() { return subscriptionTier; }
    public void setSubscriptionTier(String subscriptionTier) { this.subscriptionTier = subscriptionTier; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public String getTokenType() { return tokenType; }
    public void setTokenType(String tokenType) { this.tokenType = tokenType; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}

package com.velora.markets.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class UpdateUserRequest {

    @NotBlank
    @Size(min = 2, max = 60)
    @Pattern(regexp = "^[a-zA-Z\\s]+$", message = "Name can only contain letters")
    private String fullName;

    @NotBlank
    @Size(min = 3, max = 20)
    @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "Only letters, numbers, and underscores")
    private String username;

    @Size(min = 7, max = 20)
    @Pattern(regexp = "^[0-9+\\-\\s()]+$", message = "Enter a valid phone number")
    private String phone;

    @Size(max = 10)
    private String country;

    @Size(max = 10)
    private String currency;

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
}

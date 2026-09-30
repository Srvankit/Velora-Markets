package com.velora.markets.controller;

import com.velora.markets.dto.ChangePasswordRequest;
import com.velora.markets.dto.UpdateUserRequest;
import com.velora.markets.dto.UserResponse;
import com.velora.markets.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public UserResponse me() {
        return userService.me();
    }

    @PutMapping("/me")
    public UserResponse update(@Valid @RequestBody UpdateUserRequest request) {
        return userService.updateProfile(request);
    }

    @PostMapping(value = "/change-password", produces = MediaType.TEXT_PLAIN_VALUE)
    public String changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        return userService.changePassword(request);
    }
}

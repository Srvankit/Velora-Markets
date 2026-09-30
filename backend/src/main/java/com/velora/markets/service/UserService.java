package com.velora.markets.service;

import com.velora.markets.dto.ChangePasswordRequest;
import com.velora.markets.dto.UpdateUserRequest;
import com.velora.markets.dto.UserResponse;
import com.velora.markets.entity.User;
import com.velora.markets.exception.ApiException;
import com.velora.markets.repository.UserRepository;
import com.velora.markets.security.SecurityUtils;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final MapperService mapper;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, MapperService mapper) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.mapper = mapper;
    }

    @Transactional
    public UserResponse me() {
        User user = current();
        if (user.getCurrency() == null || user.getCurrency().isBlank()) {
            user.setCurrency(AuthService.resolveCurrency(user.getCountry(), null));
            user = userRepository.save(user);
        }
        return mapper.toUserResponse(user);
    }

    @Transactional
    public UserResponse updateProfile(UpdateUserRequest request) {
        User user = current();

        if (!user.getUsername().equalsIgnoreCase(request.getUsername())
            && userRepository.existsByUsernameIgnoreCase(request.getUsername())) {
            throw new ApiException("Username is already taken", HttpStatus.CONFLICT);
        }

        user.setFullName(request.getFullName().trim());
        user.setUsername(request.getUsername().trim());
        if (request.getPhone() != null) user.setPhone(request.getPhone().trim());
        if (request.getCountry() != null) {
            user.setCountry(request.getCountry().trim());
            if (request.getCurrency() == null || request.getCurrency().isBlank()) {
                user.setCurrency(AuthService.resolveCurrency(request.getCountry(), null));
            }
        }
        if (request.getCurrency() != null && !request.getCurrency().isBlank()) {
            user.setCurrency(request.getCurrency().trim().toUpperCase());
        }
        return mapper.toUserResponse(userRepository.save(user));
    }

    @Transactional
    public String changePassword(ChangePasswordRequest request) {
        User user = current();

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new ApiException("Current password is incorrect", HttpStatus.BAD_REQUEST);
        }
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new ApiException("New password and confirmation do not match", HttpStatus.BAD_REQUEST);
        }
        if (passwordEncoder.matches(request.getNewPassword(), user.getPasswordHash())) {
            throw new ApiException("New password must be different from the current password", HttpStatus.BAD_REQUEST);
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        return "Password changed successfully";
    }

    private User current() {
        Long id = SecurityUtils.currentUser().getId();
        return userRepository.findById(id)
            .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND));
    }
}

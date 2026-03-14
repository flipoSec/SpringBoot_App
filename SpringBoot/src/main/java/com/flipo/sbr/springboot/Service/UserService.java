package com.flipo.sbr.springboot.service;

import com.flipo.sbr.springboot.dto.auth.AuthResponse;
import com.flipo.sbr.springboot.entity.User;
import com.flipo.sbr.springboot.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    //  Get all users (admin)
    public List<AuthResponse> findAll() {
        return userRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    //  Get user by email (used for /me endpoint)
    public AuthResponse findByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return toResponse(user);
    }

    //  Delete user (admin)
    public void delete(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

    //  Entity → Response DTO
    private AuthResponse toResponse(User user) {
        return AuthResponse.builder()
                .role(user.getRole().name())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .build(); // ← no token here, just profile info
    }
}
package com.flipo.sbr.springboot.service;

import com.flipo.sbr.springboot.dto.auth.AuthResponse;
import com.flipo.sbr.springboot.dto.auth.LoginRequest;
import com.flipo.sbr.springboot.dto.auth.RegisterRequest;
import com.flipo.sbr.springboot.entity.Role;
import com.flipo.sbr.springboot.entity.User;
import com.flipo.sbr.springboot.repository.UserRepository;
import com.flipo.sbr.springboot.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    // Register
    public AuthResponse register(RegisterRequest request) {

        // 1. Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use");
        }

        // 2. Build the User entity
        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword())) // ← hashed
                .role(Role.CUSTOMER) // ← new users are always CUSTOMER
                .build();

        // 3. Save to DB
        userRepository.save(user);

        // 4. Generate JWT
        String token = jwtService.generateToken(user);

        // 5. Return token + user info
        return AuthResponse.builder()
                .token(token)
                .role(user.getRole().name())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .build();
    }

    //Login
    public AuthResponse login(LoginRequest request) {

        // 1. Authenticate — throws exception if wrong credentials
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        // 2. Load user from DB
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 3. Generate JWT
        String token = jwtService.generateToken(user);

        // 4. Return token + user info
        return AuthResponse.builder()
                .token(token)
                .role(user.getRole().name())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .build();
    }
}

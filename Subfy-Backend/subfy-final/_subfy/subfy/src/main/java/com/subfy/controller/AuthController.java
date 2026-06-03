package com.subfy.controller;

import com.subfy.entity.User;
import com.subfy.repository.UserRepository;
import com.subfy.security.JwtUtil;

import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public AuthController(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    // LOGIN
    @PostMapping("/login")
    public Map<String, String> login(@RequestBody User loginRequest) {

        Optional<User> optionalUser =
                userRepository.findByEmail(loginRequest.getEmail());

        if (optionalUser.isPresent()) {

            User user = optionalUser.get();

            if (user.getPassword().equals(loginRequest.getPassword())) {

                String token = jwtUtil.generateToken(user.getEmail());

                Map<String, String> response = new HashMap<>();

                response.put("token", token);
                response.put("email", user.getEmail());

                return response;
            }
        }

        throw new RuntimeException("Email ou senha inválidos");
    }

    // REGISTER
    @PostMapping("/register")
    public User register(@RequestBody User user) {

        Optional<User> existingUser =
                userRepository.findByEmail(user.getEmail());

        if (existingUser.isPresent()) {
            throw new RuntimeException("Usuário já existe");
        }

        return userRepository.save(user);
    }
}
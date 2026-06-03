package com.subfy.controller;

import com.subfy.entity.User;
import com.subfy.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/{email}")
    public User getUserByEmail(@PathVariable String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    @PutMapping("/{email}")
    public User updateUser(@PathVariable String email, @RequestBody User updatedUser) {
        User user = userRepository.findByEmail(email).orElse(null);

        if (user != null) {
            user.setName(updatedUser.getName());
            return userRepository.save(user);
        }

        return null;
    }
}
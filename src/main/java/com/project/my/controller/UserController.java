package com.project.my.controller;

import com.project.my.exception.ResourceNotFoundException;
import com.project.my.repository.UserRepository;
import com.project.my.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Optional;

@RestController
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/users")
    public Page<User> getUsers(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    @GetMapping("/users/{id}")
    public Optional<User> getUsers(@PathVariable Long id) {
        return userRepository.findById(id);
    }

    @PostMapping("/users")
    public User createUser(@Valid @RequestBody User user) {
        return userRepository.save(user);
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id,
                           @Valid @RequestBody User userRequest) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setFirstName(userRequest.getFirstName());
                    user.setLastName(userRequest.getLastName());
                    user.setGender(userRequest.getGender());
                    user.setBirthDay(userRequest.getBirthDay());
                    userRepository.save(user);
                    return ResponseEntity.noContent().build();
                }).orElseThrow(() -> new ResourceNotFoundException("User not found with id " + id));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteQuestion(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(user -> {
                    userRepository.delete(user);
                    return ResponseEntity.ok("");
                }).orElseThrow(() -> new ResourceNotFoundException("User not found with id " + id));
    }

}

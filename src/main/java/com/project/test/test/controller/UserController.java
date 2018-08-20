package com.project.test.test.controller;

import com.project.test.test.exception.ResourceNotFoundException;
import com.project.test.test.model.User;
import com.project.test.test.repository.UserRepository;
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
    public User updateUser(@PathVariable Long id,
                           /*@Valid */@RequestBody User userRequest) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setFirstName(userRequest.getFirstName());
                    user.setLastName(userRequest.getLastName());
                    user.setGender(userRequest.getGender());
                    user.setBirthDay(userRequest.getBirthDay());
                    return userRepository.save(user);
                }).orElseThrow(() -> new ResourceNotFoundException("User not found with id " + id));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteQuestion(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(user -> {
                    userRepository.delete(user);
                    return ResponseEntity.ok().build();
                }).orElseThrow(() -> new ResourceNotFoundException("User not found with id " + id));
    }

}

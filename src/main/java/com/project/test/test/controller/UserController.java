package com.project.test.test.controller;

import com.project.test.test.exception.ResourceNotFoundException;
import com.project.test.test.model.User;
import com.project.test.test.repository.UserRepository;
import org.hibernate.annotations.Loader;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Optional;

@RestController
public class UserController {
    Logger logger = LoggerFactory.getLogger(UserController.class);
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
                           @Valid @RequestBody User userRequest) {
        logger.debug("PUT id=" + id + " : " + userRequest.toString());
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
                    return new ResponseEntity<>("{\"msg\": \"Successful\"}", HttpStatus.OK);
                }).orElseThrow(() -> new ResourceNotFoundException("User not found with id " + id));
    }

}

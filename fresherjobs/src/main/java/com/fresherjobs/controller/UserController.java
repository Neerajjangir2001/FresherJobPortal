package com.fresherjobs.controller;

import com.fresherjobs.entity.User;
import com.fresherjobs.exception.ResourceNotFoundException;
import com.fresherjobs.repository.UserRepository;
import com.fresherjobs.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;

    @DeleteMapping("/me")
    public ResponseEntity<?> deleteMyAccount(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        userService.deleteUser(user.getId());

        return ResponseEntity.ok(Map.of("message", "Account deleted successfully"));
    }
}

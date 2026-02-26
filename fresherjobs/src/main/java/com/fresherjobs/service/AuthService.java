package com.fresherjobs.service;

import com.fresherjobs.dto.request.LoginRequest;
import com.fresherjobs.dto.request.RegisterRequest;
import com.fresherjobs.dto.response.AuthResponse;
import com.fresherjobs.entity.Company;
import com.fresherjobs.entity.User;
import com.fresherjobs.enums.Role;
import com.fresherjobs.exception.ResourceNotFoundException;
import com.fresherjobs.repository.CompanyRepository;
import com.fresherjobs.repository.UserRepository;
import com.fresherjobs.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

        private final UserRepository userRepository;
        private final CompanyRepository companyRepository;
        private final PasswordEncoder passwordEncoder;
        private final JwtUtil jwtUtil;
        private final AuthenticationManager authenticationManager;
        private final EmailService emailService;

        @Transactional
        public AuthResponse register(RegisterRequest request) {
                if (userRepository.existsByEmail(request.getEmail())) {
                        throw new IllegalStateException("Email already registered: " + request.getEmail());
                }

                User user = User.builder()
                                .name(request.getName())
                                .email(request.getEmail())
                                .password(passwordEncoder.encode(request.getPassword()))
                                .role(request.getRole())
                                .isApproved(request.getRole() == Role.ADMIN || request.getRole() == Role.JOB_SEEKER)
                                .build();

                user = userRepository.save(user);

                // If registering as RECRUITER, also create a company profile
                if (request.getRole() == Role.RECRUITER && request.getCompanyName() != null) {
                        Company company = Company.builder()
                                        .user(user)
                                        .companyName(request.getCompanyName())
                                        .website(request.getWebsite())
                                        .location(request.getCompanyLocation())
                                        .description(request.getCompanyDescription())
                                        .build();
                        companyRepository.save(company);
                }

                String token = jwtUtil.generateToken(user);

                // Send Welcome Email
                emailService.sendHtmlEmail(
                                user.getEmail(),
                                "Welcome to FresherJobs!",
                                "welcome",
                                Map.of("userName", user.getName()));

                return AuthResponse.builder()
                                .token(token)
                                .tokenType("Bearer")
                                .userId(user.getId())
                                .name(user.getName())
                                .email(user.getEmail())
                                .role(user.getRole())
                                .isApproved(user.getIsApproved())
                                .build();
        }

        public AuthResponse login(LoginRequest request) {
                User user = userRepository.findByEmail(request.getEmail())
                                .orElseThrow(() -> new ResourceNotFoundException("User not available "));

                authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

                String token = jwtUtil.generateToken(user);

                return AuthResponse.builder()
                                .token(token)
                                .tokenType("Bearer")
                                .userId(user.getId())
                                .name(user.getName())
                                .email(user.getEmail())
                                .role(user.getRole())
                                .isApproved(user.getIsApproved())
                                .build();
        }

        @Transactional
        public void forgotPassword(String email) {
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "User not found with email: " + email));

                String token = UUID.randomUUID().toString();
                user.setResetPasswordToken(token);
                user.setResetPasswordTokenExpiry(LocalDateTime.now().plusHours(1));

                userRepository.save(user);

                emailService.sendHtmlEmail(
                                user.getEmail(),
                                "Password Reset Request",
                                "password-reset",
                                Map.of("userName", user.getName(), "resetLink", "/reset-password/" + token));
        }

        @Transactional
        public void resetPassword(String token, String newPassword) {
                User user = userRepository.findByResetPasswordToken(token)
                                .orElseThrow(() -> new IllegalArgumentException("Invalid password reset token"));

                if (user.getResetPasswordTokenExpiry().isBefore(LocalDateTime.now())) {
                        throw new IllegalArgumentException("Password reset token has expired");
                }

                user.setPassword(passwordEncoder.encode(newPassword));
                user.setResetPasswordToken(null);
                user.setResetPasswordTokenExpiry(null);

                userRepository.save(user);
        }
}

package com.genai.capstone.config;

import com.genai.capstone.entity.Role;
import com.genai.capstone.entity.User;
import com.genai.capstone.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        ensureUser("System Admin", "admin@example.com", "Admin@123", Role.ADMIN);
        ensureUser("Senior Reviewer", "reviewer@example.com", "Reviewer@123", Role.REVIEWER);
        ensureUser("John Intern", "intern@example.com", "Intern@123", Role.INTERN);
        ensureUser("Alex Rivera", "alex.intern@example.com", "Intern@123", Role.INTERN);
        ensureUser("Sarah Chen", "sarah.intern@example.com", "Intern@123", Role.INTERN);
    }

    private void ensureUser(String name, String email, String rawPassword, Role role) {
        User user = userRepository.findByEmail(email).orElseGet(() ->
                User.builder()
                        .name(name)
                        .email(email)
                        .role(role)
                        .active(true)
                        .build()
        );

        user.setName(name);
        user.setPasswordHash(passwordEncoder.encode(rawPassword));
        user.setRole(role);
        user.setActive(true);

        userRepository.save(user);
    }
}

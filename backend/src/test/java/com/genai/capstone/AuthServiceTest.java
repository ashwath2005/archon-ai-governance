package com.genai.capstone;

import com.genai.capstone.dto.LoginRequest;
import com.genai.capstone.dto.RegisterRequest;
import com.genai.capstone.entity.Role;
import com.genai.capstone.entity.User;
import com.genai.capstone.exception.BadRequestException;
import com.genai.capstone.repository.UserRepository;
import com.genai.capstone.security.JwtTokenProvider;
import com.genai.capstone.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider tokenProvider;

    @InjectMocks
    private AuthService authService;

    private RegisterRequest registerRequest;

    @BeforeEach
    void setUp() {
        registerRequest = new RegisterRequest();
        registerRequest.setName("Test Intern");
        registerRequest.setEmail("test.intern@example.com");
        registerRequest.setPassword("Password@123");
        registerRequest.setRole(Role.INTERN);
    }

    @Test
    void testRegisterUser_Success() {
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        
        User savedUser = User.builder()
                .id(10L)
                .name(registerRequest.getName())
                .email(registerRequest.getEmail())
                .passwordHash("encodedPassword")
                .role(Role.INTERN)
                .active(true)
                .build();
                
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        var response = authService.register(registerRequest);

        assertNotNull(response);
        assertEquals("test.intern@example.com", response.getEmail());
        assertEquals(Role.INTERN, response.getRole());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testRegisterUser_DuplicateEmail_ThrowsException() {
        when(userRepository.existsByEmail("test.intern@example.com")).thenReturn(true);

        assertThrows(BadRequestException.class, () -> authService.register(registerRequest));
        verify(userRepository, never()).save(any(User.class));
    }
}

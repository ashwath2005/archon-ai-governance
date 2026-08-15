package com.genai.capstone;

import com.genai.capstone.dto.SubmissionRequest;
import com.genai.capstone.entity.Role;
import com.genai.capstone.entity.Status;
import com.genai.capstone.entity.Submission;
import com.genai.capstone.entity.User;
import com.genai.capstone.exception.BadRequestException;
import com.genai.capstone.repository.SubmissionRepository;
import com.genai.capstone.repository.UserRepository;
import com.genai.capstone.security.UserPrincipal;
import com.genai.capstone.service.SubmissionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SubmissionServiceTest {

    @Mock
    private SubmissionRepository submissionRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private SubmissionService submissionService;

    private User internUser;
    private UserPrincipal internPrincipal;
    private SubmissionRequest submissionRequest;

    @BeforeEach
    void setUp() {
        internUser = User.builder()
                .id(3L)
                .name("John Intern")
                .email("intern@example.com")
                .role(Role.INTERN)
                .active(true)
                .build();

        internPrincipal = UserPrincipal.create(internUser);

        submissionRequest = new SubmissionRequest();
        submissionRequest.setInternName("John Intern");
        submissionRequest.setProjectTitle("Test Capstone Project");
        submissionRequest.setProjectDomain("FinTech");
        submissionRequest.setGithubUrl("https://github.com/intern/test-capstone");
        submissionRequest.setOnePagerUrl("https://notion.so/intern/one-pager");
        submissionRequest.setDateSubmitted(LocalDate.now());
    }

    @Test
    void testCreateSubmission_Success_InitialStatusNotReviewed() {
        when(userRepository.findById(3L)).thenReturn(Optional.of(internUser));

        Submission savedSubmission = Submission.builder()
                .id(100L)
                .intern(internUser)
                .projectTitle(submissionRequest.getProjectTitle())
                .projectDomain(submissionRequest.getProjectDomain())
                .githubUrl(submissionRequest.getGithubUrl())
                .onePagerUrl(submissionRequest.getOnePagerUrl())
                .dateSubmitted(submissionRequest.getDateSubmitted())
                .status(Status.NOT_REVIEWED)
                .reasoningIncluded(false)
                .build();

        when(submissionRepository.save(any(Submission.class))).thenReturn(savedSubmission);

        var result = submissionService.createSubmission(submissionRequest, internPrincipal);

        assertNotNull(result);
        assertEquals(Status.NOT_REVIEWED, result.getStatus());
        assertFalse(result.isReasoningIncluded());
        verify(submissionRepository, times(1)).save(any(Submission.class));
    }

    @Test
    void testCreateSubmission_FutureDate_ThrowsException() {
        when(userRepository.findById(3L)).thenReturn(Optional.of(internUser));
        submissionRequest.setDateSubmitted(LocalDate.now().plusDays(5));

        assertThrows(BadRequestException.class, () -> submissionService.createSubmission(submissionRequest, internPrincipal));
    }
}

package com.genai.capstone;

import com.genai.capstone.dto.ReviewRequest;
import com.genai.capstone.entity.*;
import com.genai.capstone.exception.BadRequestException;
import com.genai.capstone.repository.ReviewHistoryRepository;
import com.genai.capstone.repository.SubmissionRepository;
import com.genai.capstone.repository.UserRepository;
import com.genai.capstone.security.UserPrincipal;
import com.genai.capstone.service.ReviewService;
import com.genai.capstone.service.SubmissionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReviewServiceTest {

    @Mock
    private SubmissionRepository submissionRepository;

    @Mock
    private ReviewHistoryRepository reviewHistoryRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private SubmissionService submissionService;

    @InjectMocks
    private ReviewService reviewService;

    private User reviewerUser;
    private UserPrincipal reviewerPrincipal;
    private Submission mockSubmission;

    @BeforeEach
    void setUp() {
        reviewerUser = User.builder()
                .id(2L)
                .name("Senior Reviewer")
                .email("reviewer@example.com")
                .role(Role.REVIEWER)
                .active(true)
                .build();

        reviewerPrincipal = UserPrincipal.create(reviewerUser);

        mockSubmission = Submission.builder()
                .id(1L)
                .projectTitle("RAG Search App")
                .status(Status.NOT_REVIEWED)
                .reasoningIncluded(false)
                .build();
    }

    @Test
    void testApproveSubmission_WithoutReasoning_ThrowsException() {
        when(submissionRepository.findById(1L)).thenReturn(Optional.of(mockSubmission));
        when(userRepository.findById(2L)).thenReturn(Optional.of(reviewerUser));

        ReviewRequest request = new ReviewRequest();
        request.setStatus(Status.APPROVED);
        request.setReasoningIncluded(false); // Missing reasoning!
        request.setReviewerNotes("Attempting approval without reasoning");

        assertThrows(BadRequestException.class, () -> reviewService.reviewSubmission(1L, request, reviewerPrincipal));
    }

    @Test
    void testNeedsRevision_SavesHistory() {
        when(submissionRepository.findById(1L)).thenReturn(Optional.of(mockSubmission));
        when(userRepository.findById(2L)).thenReturn(Optional.of(reviewerUser));
        when(submissionRepository.save(any(Submission.class))).thenReturn(mockSubmission);

        ReviewRequest request = new ReviewRequest();
        request.setStatus(Status.NEEDS_REVISION);
        request.setReasoningIncluded(false);
        request.setReviewerNotes("Please justify fine-tuning");

        reviewService.reviewSubmission(1L, request, reviewerPrincipal);

        verify(reviewHistoryRepository, times(1)).save(any(ReviewHistory.class));
    }
}

package com.genai.capstone.service;

import com.genai.capstone.dto.*;
import com.genai.capstone.entity.*;
import com.genai.capstone.exception.BadRequestException;
import com.genai.capstone.exception.ResourceNotFoundException;
import com.genai.capstone.exception.UnauthorizedException;
import com.genai.capstone.repository.SubmissionRepository;
import com.genai.capstone.repository.UserRepository;
import com.genai.capstone.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public PagedResponse<SubmissionResponseDto> getAllSubmissions(
            String search,
            Status status,
            Boolean reasoningIncluded,
            Long reviewerId,
            Long internId,
            int page,
            int size,
            String sortBy,
            String sortDir,
            UserPrincipal currentUser) {

        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ?
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);

        // If user is INTERN, automatically restrict to their own submissions unless specified
        Long effectiveInternId = internId;
        if (currentUser.getRole() == Role.INTERN) {
            effectiveInternId = currentUser.getId();
        }

        Page<Submission> submissions = submissionRepository.findAllFiltered(
                search, status, reasoningIncluded, reviewerId, effectiveInternId, pageable
        );

        List<SubmissionResponseDto> content = submissions.getContent().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());

        return PagedResponse.<SubmissionResponseDto>builder()
                .content(content)
                .pageNumber(submissions.getNumber())
                .pageSize(submissions.getSize())
                .totalElements(submissions.getTotalElements())
                .totalPages(submissions.getTotalPages())
                .last(submissions.isLast())
                .build();
    }

    @Transactional(readOnly = true)
    public SubmissionResponseDto getSubmissionById(Long id, UserPrincipal currentUser) {
        Submission submission = submissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Submission", "id", id));

        if (currentUser.getRole() == Role.INTERN && !submission.getIntern().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You do not have permission to view this submission");
        }

        return mapToDto(submission);
    }

    @Transactional
    public SubmissionResponseDto createSubmission(SubmissionRequest request, UserPrincipal currentUser) {
        User intern = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", currentUser.getId()));

        if (request.getDateSubmitted().isAfter(LocalDate.now())) {
            throw new BadRequestException("Submission date cannot be in the future");
        }

        Submission submission = Submission.builder()
                .intern(intern)
                .projectTitle(request.getProjectTitle())
                .projectDomain(request.getProjectDomain())
                .githubUrl(request.getGithubUrl())
                .onePagerUrl(request.getOnePagerUrl())
                .dateSubmitted(request.getDateSubmitted())
                .reasoningIncluded(false) // Default false until evaluated by reviewer or reasoning verified
                .status(Status.NOT_REVIEWED) // Rule 1: Starts as NOT_REVIEWED
                .build();

        Submission saved = submissionRepository.save(submission);
        return mapToDto(saved);
    }

    @Transactional
    public SubmissionResponseDto updateSubmission(Long id, SubmissionRequest request, UserPrincipal currentUser) {
        Submission submission = submissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Submission", "id", id));

        // Rule 7 & Rule 8: Normal intern cannot modify APPROVED submission. Admin can override.
        if (currentUser.getRole() == Role.INTERN) {
            if (!submission.getIntern().getId().equals(currentUser.getId())) {
                throw new UnauthorizedException("You can only edit your own submission");
            }

            if (submission.getStatus() == Status.APPROVED) {
                throw new BadRequestException("Approved submissions cannot be modified");
            }
        }

        if (request.getDateSubmitted().isAfter(LocalDate.now())) {
            throw new BadRequestException("Submission date cannot be in the future");
        }

        submission.setProjectTitle(request.getProjectTitle());
        submission.setProjectDomain(request.getProjectDomain());
        submission.setGithubUrl(request.getGithubUrl());
        submission.setOnePagerUrl(request.getOnePagerUrl());
        submission.setDateSubmitted(request.getDateSubmitted());

        // Rule 6: If resubmitting after NEEDS_REVISION, reset status to NOT_REVIEWED
        if (submission.getStatus() == Status.NEEDS_REVISION) {
            submission.setStatus(Status.NOT_REVIEWED);
        }

        Submission updated = submissionRepository.save(submission);
        return mapToDto(updated);
    }

    @Transactional
    public void deleteSubmission(Long id, UserPrincipal currentUser) {
        Submission submission = submissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Submission", "id", id));

        if (currentUser.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("Only Administrators can delete submissions");
        }

        submissionRepository.delete(submission);
    }

    @Transactional(readOnly = true)
    public ByteArrayInputStream exportSubmissionsToCsv(
            String search, Status status, Boolean reasoningIncluded, Long reviewerId, Long internId) {

        List<Submission> submissions = submissionRepository.findAllFilteredList(
                search, status, reasoningIncluded, reviewerId, internId
        );

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try (PrintWriter writer = new PrintWriter(out, true, StandardCharsets.UTF_8)) {
            // Header
            writer.println("#,Intern Name,Project Title,Domain,GitHub URL,One-Pager URL,Date Submitted,Reasoning Included,Status,Reviewer Notes");

            int index = 1;
            for (Submission sub : submissions) {
                writer.printf("%d,\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",%s,%s,%s,\"%s\"\n",
                        index++,
                        escapeCsv(sub.getIntern().getName()),
                        escapeCsv(sub.getProjectTitle()),
                        escapeCsv(sub.getProjectDomain()),
                        escapeCsv(sub.getGithubUrl()),
                        escapeCsv(sub.getOnePagerUrl()),
                        sub.getDateSubmitted(),
                        sub.isReasoningIncluded() ? "Y" : "N",
                        sub.getStatus().name(),
                        escapeCsv(sub.getReviewerNotes() != null ? sub.getReviewerNotes() : "")
                );
            }
            writer.flush();
            return new ByteArrayInputStream(out.toByteArray());
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate CSV export", e);
        }
    }

    private String escapeCsv(String data) {
        if (data == null) return "";
        return data.replace("\"", "\"\"");
    }

    public SubmissionResponseDto mapToDto(Submission submission) {
        return SubmissionResponseDto.builder()
                .id(submission.getId())
                .internId(submission.getIntern().getId())
                .internName(submission.getIntern().getName())
                .internEmail(submission.getIntern().getEmail())
                .projectTitle(submission.getProjectTitle())
                .projectDomain(submission.getProjectDomain())
                .githubUrl(submission.getGithubUrl())
                .onePagerUrl(submission.getOnePagerUrl())
                .dateSubmitted(submission.getDateSubmitted())
                .reasoningIncluded(submission.isReasoningIncluded())
                .status(submission.getStatus())
                .reviewerNotes(submission.getReviewerNotes())
                .reviewedById(submission.getReviewedBy() != null ? submission.getReviewedBy().getId() : null)
                .reviewedByName(submission.getReviewedBy() != null ? submission.getReviewedBy().getName() : null)
                .reviewedAt(submission.getReviewedAt())
                .createdAt(submission.getCreatedAt())
                .updatedAt(submission.getUpdatedAt())
                .build();
    }
}

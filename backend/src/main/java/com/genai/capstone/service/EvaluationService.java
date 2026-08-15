package com.genai.capstone.service;

import com.genai.capstone.dto.BulkEvaluationRequest;
import com.genai.capstone.dto.EvaluationRequest;
import com.genai.capstone.dto.EvaluationResponseDto;
import com.genai.capstone.entity.*;
import com.genai.capstone.exception.BadRequestException;
import com.genai.capstone.exception.ResourceNotFoundException;
import com.genai.capstone.repository.RubricItemRepository;
import com.genai.capstone.repository.SubmissionEvaluationRepository;
import com.genai.capstone.repository.SubmissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EvaluationService {

    private final SubmissionEvaluationRepository evaluationRepository;
    private final SubmissionRepository submissionRepository;
    private final RubricItemRepository rubricItemRepository;

    @Transactional(readOnly = true)
    public List<EvaluationResponseDto> getEvaluationsForSubmission(Long submissionId) {
        if (!submissionRepository.existsById(submissionId)) {
            throw new ResourceNotFoundException("Submission", "id", submissionId);
        }

        return evaluationRepository.findBySubmissionId(submissionId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public List<EvaluationResponseDto> saveBulkEvaluations(Long submissionId, BulkEvaluationRequest request) {
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Submission", "id", submissionId));

        List<SubmissionEvaluation> savedEvaluations = new ArrayList<>();
        boolean allReasoningValid = true;

        for (EvaluationRequest evalReq : request.getEvaluations()) {
            RubricItem rubricItem = rubricItemRepository.findById(evalReq.getRubricItemId())
                    .orElseThrow(() -> new ResourceNotFoundException("RubricItem", "id", evalReq.getRubricItemId()));

            String decision = evalReq.getDecision() != null ? evalReq.getDecision().trim() : "";
            String reasoning = evalReq.getReasoning() != null ? evalReq.getReasoning().trim() : "";

            // Validate Reasoning rule: If decision is chosen and not NOT_APPLICABLE, reasoning must not be blank
            if (!decision.isEmpty() && !"NOT_APPLICABLE".equalsIgnoreCase(decision) && !"Not needed".equalsIgnoreCase(decision)) {
                if (reasoning.isBlank() || reasoning.length() < 10) {
                    allReasoningValid = false;
                }
            }

            Optional<SubmissionEvaluation> existingOpt =
                    evaluationRepository.findBySubmissionIdAndRubricItemId(submissionId, rubricItem.getId());

            SubmissionEvaluation eval;
            if (existingOpt.isPresent()) {
                eval = existingOpt.get();
                eval.setDecision(decision);
                eval.setReasoning(reasoning);
                if (evalReq.getReviewerComment() != null) {
                    eval.setReviewerComment(evalReq.getReviewerComment());
                }
            } else {
                eval = SubmissionEvaluation.builder()
                        .submission(submission)
                        .rubricItem(rubricItem)
                        .decision(decision)
                        .reasoning(reasoning)
                        .reviewerComment(evalReq.getReviewerComment())
                        .build();
            }

            savedEvaluations.add(evaluationRepository.save(eval));
        }

        // Automatically update submission's reasoning_included status
        submission.setReasoningIncluded(allReasoningValid && !savedEvaluations.isEmpty());
        submissionRepository.save(submission);

        return savedEvaluations.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public EvaluationResponseDto mapToDto(SubmissionEvaluation eval) {
        return EvaluationResponseDto.builder()
                .id(eval.getId())
                .submissionId(eval.getSubmission().getId())
                .rubricItemId(eval.getRubricItem().getId())
                .itemKey(eval.getRubricItem().getItemKey())
                .itemName(eval.getRubricItem().getItemName())
                .sectionCode(eval.getRubricItem().getSection().getSectionCode())
                .sectionName(eval.getRubricItem().getSection().getSectionName())
                .decision(eval.getDecision())
                .reasoning(eval.getReasoning())
                .reviewerComment(eval.getReviewerComment())
                .createdAt(eval.getCreatedAt())
                .updatedAt(eval.getUpdatedAt())
                .build();
    }
}

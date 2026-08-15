package com.genai.capstone.repository;

import com.genai.capstone.entity.SubmissionEvaluation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubmissionEvaluationRepository extends JpaRepository<SubmissionEvaluation, Long> {
    List<SubmissionEvaluation> findBySubmissionId(Long submissionId);
    Optional<SubmissionEvaluation> findBySubmissionIdAndRubricItemId(Long submissionId, Long rubricItemId);
    void deleteBySubmissionId(Long submissionId);
}

package com.genai.capstone.repository;

import com.genai.capstone.entity.ReviewHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewHistoryRepository extends JpaRepository<ReviewHistory, Long> {
    List<ReviewHistory> findBySubmissionIdOrderByCreatedAtDesc(Long submissionId);
}

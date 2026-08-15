package com.genai.capstone.repository;

import com.genai.capstone.entity.Status;
import com.genai.capstone.entity.Submission;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {

    Page<Submission> findByInternId(Long internId, Pageable pageable);

    @Query("SELECT s FROM Submission s WHERE " +
           "(:search IS NULL OR LOWER(s.projectTitle) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(s.projectDomain) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(s.intern.name) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:status IS NULL OR s.status = :status) AND " +
           "(:reasoningIncluded IS NULL OR s.reasoningIncluded = :reasoningIncluded) AND " +
           "(:reviewerId IS NULL OR s.reviewedBy.id = :reviewerId) AND " +
           "(:internId IS NULL OR s.intern.id = :internId)")
    Page<Submission> findAllFiltered(
            @Param("search") String search,
            @Param("status") Status status,
            @Param("reasoningIncluded") Boolean reasoningIncluded,
            @Param("reviewerId") Long reviewerId,
            @Param("internId") Long internId,
            Pageable pageable
    );

    @Query("SELECT s FROM Submission s WHERE " +
           "(:search IS NULL OR LOWER(s.projectTitle) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(s.projectDomain) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(s.intern.name) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:status IS NULL OR s.status = :status) AND " +
           "(:reasoningIncluded IS NULL OR s.reasoningIncluded = :reasoningIncluded) AND " +
           "(:reviewerId IS NULL OR s.reviewedBy.id = :reviewerId) AND " +
           "(:internId IS NULL OR s.intern.id = :internId)")
    List<Submission> findAllFilteredList(
            @Param("search") String search,
            @Param("status") Status status,
            @Param("reasoningIncluded") Boolean reasoningIncluded,
            @Param("reviewerId") Long reviewerId,
            @Param("internId") Long internId
    );

    long countByStatus(Status status);

    long countByReasoningIncluded(boolean reasoningIncluded);

    @Query("SELECT s.projectDomain, COUNT(s) FROM Submission s GROUP BY s.projectDomain")
    List<Object[]> countSubmissionsByDomain();

    @Query("SELECT s.status, COUNT(s) FROM Submission s GROUP BY s.status")
    List<Object[]> countSubmissionsByStatusGroup();

    List<Submission> findTop5ByOrderByCreatedAtDesc();
}

package com.genai.capstone.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "submissions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Submission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "intern_id", nullable = false)
    private User intern;

    @Column(name = "project_title", nullable = false, length = 255)
    private String projectTitle;

    @Column(name = "project_domain", nullable = false, length = 150)
    private String projectDomain;

    @Column(name = "github_url", nullable = false, length = 500)
    private String githubUrl;

    @Column(name = "one_pager_url", nullable = false, length = 500)
    private String onePagerUrl;

    @Column(name = "date_submitted", nullable = false)
    private LocalDate dateSubmitted;

    @Column(name = "reasoning_included", nullable = false)
    private boolean reasoningIncluded = false;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private Status status = Status.NOT_REVIEWED;

    @Column(name = "reviewer_notes", columnDefinition = "TEXT")
    private String reviewerNotes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewed_by")
    private User reviewedBy;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}

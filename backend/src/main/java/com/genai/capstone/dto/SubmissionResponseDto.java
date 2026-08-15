package com.genai.capstone.dto;

import com.genai.capstone.entity.Status;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SubmissionResponseDto {
    private Long id;
    private Long internId;
    private String internName;
    private String internEmail;
    private String projectTitle;
    private String projectDomain;
    private String githubUrl;
    private String onePagerUrl;
    private LocalDate dateSubmitted;
    private boolean reasoningIncluded;
    private Status status;
    private String reviewerNotes;
    private Long reviewedById;
    private String reviewedByName;
    private LocalDateTime reviewedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

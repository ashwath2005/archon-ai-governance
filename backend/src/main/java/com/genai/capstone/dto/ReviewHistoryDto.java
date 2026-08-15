package com.genai.capstone.dto;

import com.genai.capstone.entity.Status;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ReviewHistoryDto {
    private Long id;
    private Long submissionId;
    private Long reviewerId;
    private String reviewerName;
    private Status previousStatus;
    private Status newStatus;
    private String comments;
    private LocalDateTime createdAt;
}

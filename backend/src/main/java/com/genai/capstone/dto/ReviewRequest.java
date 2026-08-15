package com.genai.capstone.dto;

import com.genai.capstone.entity.Status;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ReviewRequest {

    @NotNull(message = "Status is required")
    private Status status;

    private boolean reasoningIncluded;

    private String reviewerNotes;

    private String comments;
}

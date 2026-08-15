package com.genai.capstone.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.hibernate.validator.constraints.URL;
import lombok.Data;

import java.time.LocalDate;

@Data
public class SubmissionRequest {

    @NotBlank(message = "Intern name is required")
    private String internName;

    @NotBlank(message = "Project title is required")
    private String projectTitle;

    @NotBlank(message = "Project domain is required")
    private String projectDomain;

    @NotBlank(message = "GitHub repository URL is required")
    @URL(message = "Invalid GitHub repository URL")
    private String githubUrl;

    @NotBlank(message = "Mapping One-Pager URL is required")
    @URL(message = "Invalid Mapping One-Pager URL")
    private String onePagerUrl;

    @NotNull(message = "Date submitted is required")
    private LocalDate dateSubmitted;
}

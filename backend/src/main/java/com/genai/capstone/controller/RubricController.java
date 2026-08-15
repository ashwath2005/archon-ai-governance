package com.genai.capstone.controller;

import com.genai.capstone.dto.ApiResponse;
import com.genai.capstone.dto.RubricSectionDto;
import com.genai.capstone.service.RubricService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rubric")
@RequiredArgsConstructor
@Tag(name = "Rubric", description = "Endpoints for fetching evaluation rubric sections and criteria")
public class RubricController {

    private final RubricService rubricService;

    @GetMapping
    @Operation(summary = "Get full rubric", description = "Returns all 6 active rubric evaluation sections and items")
    public ResponseEntity<ApiResponse<List<RubricSectionDto>>> getFullRubric() {
        List<RubricSectionDto> sections = rubricService.getAllActiveSections();
        return ResponseEntity.ok(ApiResponse.success(sections));
    }

    @GetMapping("/sections")
    @Operation(summary = "Get rubric sections", description = "Returns all active rubric sections")
    public ResponseEntity<ApiResponse<List<RubricSectionDto>>> getRubricSections() {
        List<RubricSectionDto> sections = rubricService.getAllActiveSections();
        return ResponseEntity.ok(ApiResponse.success(sections));
    }

    @GetMapping("/sections/{id}")
    @Operation(summary = "Get rubric section by ID", description = "Retrieves a specific rubric section and its items")
    public ResponseEntity<ApiResponse<RubricSectionDto>> getRubricSectionById(@PathVariable Long id) {
        RubricSectionDto section = rubricService.getSectionById(id);
        return ResponseEntity.ok(ApiResponse.success(section));
    }
}

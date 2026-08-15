package com.genai.capstone.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.genai.capstone.dto.RubricItemDto;
import com.genai.capstone.dto.RubricSectionDto;
import com.genai.capstone.entity.RubricItem;
import com.genai.capstone.entity.RubricSection;
import com.genai.capstone.exception.ResourceNotFoundException;
import com.genai.capstone.repository.RubricItemRepository;
import com.genai.capstone.repository.RubricSectionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RubricService {

    private final RubricSectionRepository rubricSectionRepository;
    private final RubricItemRepository rubricItemRepository;
    private final ObjectMapper objectMapper;

    @Transactional(readOnly = true)
    public List<RubricSectionDto> getAllActiveSections() {
        return rubricSectionRepository.findByActiveTrueOrderByDisplayOrderAsc().stream()
                .map(this::mapSectionToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public RubricSectionDto getSectionById(Long id) {
        RubricSection section = rubricSectionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("RubricSection", "id", id));
        return mapSectionToDto(section);
    }

    @Transactional(readOnly = true)
    public RubricSectionDto getSectionByCode(Integer code) {
        RubricSection section = rubricSectionRepository.findBySectionCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("RubricSection", "sectionCode", code));
        return mapSectionToDto(section);
    }

    public RubricSectionDto mapSectionToDto(RubricSection section) {
        List<RubricItemDto> itemDtos = section.getItems().stream()
                .map(this::mapItemToDto)
                .collect(Collectors.toList());

        return RubricSectionDto.builder()
                .id(section.getId())
                .sectionCode(section.getSectionCode())
                .sectionName(section.getSectionName())
                .description(section.getDescription())
                .displayOrder(section.getDisplayOrder())
                .active(section.isActive())
                .items(itemDtos)
                .build();
    }

    public RubricItemDto mapItemToDto(RubricItem item) {
        List<String> parsedOptions = new ArrayList<>();
        if (item.getOptions() != null && !item.getOptions().isBlank()) {
            try {
                parsedOptions = objectMapper.readValue(item.getOptions(), new TypeReference<List<String>>() {});
            } catch (Exception e) {
                parsedOptions = List.of(item.getOptions().split(","));
            }
        }

        return RubricItemDto.builder()
                .id(item.getId())
                .sectionId(item.getSection().getId())
                .itemKey(item.getItemKey())
                .itemName(item.getItemName())
                .description(item.getDescription())
                .options(parsedOptions)
                .required(item.isRequired())
                .displayOrder(item.getDisplayOrder())
                .build();
    }
}

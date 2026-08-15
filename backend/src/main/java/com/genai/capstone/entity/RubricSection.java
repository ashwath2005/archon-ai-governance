package com.genai.capstone.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "rubric_sections")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RubricSection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "section_code", nullable = false, unique = true)
    private Integer sectionCode;

    @Column(name = "section_name", nullable = false, length = 100)
    private String sectionName;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder;

    @Column(nullable = false)
    private boolean active = true;

    @OneToMany(mappedBy = "section", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("displayOrder ASC")
    @Builder.Default
    private List<RubricItem> items = new ArrayList<>();
}

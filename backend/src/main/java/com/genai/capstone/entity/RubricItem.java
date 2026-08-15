package com.genai.capstone.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "rubric_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RubricItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rubric_section_id", nullable = false)
    private RubricSection section;

    @Column(name = "item_key", nullable = false, unique = true, length = 100)
    private String itemKey;

    @Column(name = "item_name", nullable = false, length = 150)
    private String itemName;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String options;

    @Column(nullable = false)
    private boolean required = true;

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder;
}

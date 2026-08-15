package com.genai.capstone.repository;

import com.genai.capstone.entity.RubricSection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RubricSectionRepository extends JpaRepository<RubricSection, Long> {
    Optional<RubricSection> findBySectionCode(Integer sectionCode);
    List<RubricSection> findByActiveTrueOrderByDisplayOrderAsc();
}

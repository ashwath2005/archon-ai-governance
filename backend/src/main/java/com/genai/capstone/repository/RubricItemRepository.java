package com.genai.capstone.repository;

import com.genai.capstone.entity.RubricItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RubricItemRepository extends JpaRepository<RubricItem, Long> {
    Optional<RubricItem> findByItemKey(String itemKey);
    List<RubricItem> findBySectionIdOrderByDisplayOrderAsc(Long sectionId);
}

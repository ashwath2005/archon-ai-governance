package com.genai.capstone.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ReasoningSummaryDto {
    private long includedCount;
    private long missingCount;
    private double includedPercentage;
    private double missingPercentage;
}

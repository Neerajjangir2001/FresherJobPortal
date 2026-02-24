package com.fresherjobs.dto.response;

import com.fresherjobs.enums.JobType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobResponse {
    private Long id;
    private String title;
    private String description;
    private String skillsRequired;
    private JobType jobType;
    private Integer experienceRequired;
    private Integer graduationYear;
    private BigDecimal salaryMin;
    private BigDecimal salaryMax;
    private String location;
    private Boolean isActive;
    private LocalDateTime postedAt;
    private LocalDate expiresAt;
    private String companyName;
    private String companyLogoUrl;
    private String companyWebsite;
    private String categoryName;
}

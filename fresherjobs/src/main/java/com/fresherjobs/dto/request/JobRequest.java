package com.fresherjobs.dto.request;

import com.fresherjobs.enums.JobType;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class JobRequest {

    @NotBlank(message = "Job title is required")
    private String title;

    @NotBlank(message = "Job description is required")
    private String description;

    private String skillsRequired;

    @NotNull(message = "Job type is required")
    private JobType jobType;

    @NotNull(message = "Experience required is mandatory")
    @Min(value = 0, message = "Experience must be 0 or 1 year")
    @Max(value = 1, message = "Only fresher jobs (0-1 year experience) are allowed!")
    private Integer experienceRequired;

    private Integer graduationYear;

    private BigDecimal salaryMin;

    private BigDecimal salaryMax;

    private String location;

    private LocalDate expiresAt;

    private Long categoryId;
}

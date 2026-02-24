package com.fresherjobs.dto.response;

import com.fresherjobs.enums.AppStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationResponse {
    private Long id;
    private Long jobId;
    private String jobTitle;
    private String companyName;
    private Long userId;
    private String applicantName;
    private String applicantEmail;
    private String resumeUrl;
    private String coverLetter;
    private AppStatus status;
    private LocalDateTime appliedAt;

    // Applicant profile details
    private String profilePhoto;
    private String collegeName;
    private String degree;
    private Integer graduationYear;
    private Double cgpa;
    private String skills;
    private String about;
}

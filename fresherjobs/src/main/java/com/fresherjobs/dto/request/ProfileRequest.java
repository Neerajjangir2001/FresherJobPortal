package com.fresherjobs.dto.request;

import lombok.Data;

@Data
public class ProfileRequest {
    private String collegeName;
    private String degree;
    private Integer graduationYear;
    private Double cgpa;
    private String skills;
    private String resumeUrl;
    private String profilePhoto;
    private String about;
}

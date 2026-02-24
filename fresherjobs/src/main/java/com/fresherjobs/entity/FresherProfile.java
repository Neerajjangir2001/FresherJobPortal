package com.fresherjobs.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "fresher_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FresherProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    private User user;

    @Column(name = "college_name")
    private String collegeName;

    @Column(name = "degree")
    private String degree;

    @Column(name = "graduation_year")
    private Integer graduationYear;

    @Column(name = "cgpa")
    private Double cgpa;

    @Column(name = "skills", columnDefinition = "TEXT")
    private String skills;

    @Column(name = "resume_url")
    private String resumeUrl;

    @Column(name = "profile_photo")
    private String profilePhoto;

    @Column(name = "about", columnDefinition = "TEXT")
    private String about;
}

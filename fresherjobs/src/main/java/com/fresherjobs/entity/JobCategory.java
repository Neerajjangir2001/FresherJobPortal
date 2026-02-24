package com.fresherjobs.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "job_categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "cat_name", nullable = false)
    private String catName;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
}

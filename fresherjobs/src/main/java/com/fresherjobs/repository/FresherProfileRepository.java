package com.fresherjobs.repository;

import com.fresherjobs.entity.FresherProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FresherProfileRepository extends JpaRepository<FresherProfile, Long> {
    Optional<FresherProfile> findByUserId(Long userId);
    boolean existsByUserId(Long userId);
}

package com.fresherjobs.repository;

import com.fresherjobs.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

    List<Job> findAllByIsActiveTrue();

    List<Job> findAllByCompanyUserId(Long userId);

    List<Job> findAllByCompanyId(Long companyId);

    @Modifying
    @Query("UPDATE Job j SET j.isActive = false WHERE j.expiresAt < :today AND j.isActive = true")
    void deactivateExpiredJobs(LocalDate today);
}

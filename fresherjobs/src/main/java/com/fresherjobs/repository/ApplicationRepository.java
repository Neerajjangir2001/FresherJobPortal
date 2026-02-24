package com.fresherjobs.repository;

import com.fresherjobs.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    List<Application> findAllByUserId(Long userId);

    List<Application> findAllByJobId(Long jobId);

    boolean existsByUserIdAndJobId(Long userId, Long jobId);

    Optional<Application> findByUserIdAndJobId(Long userId, Long jobId);

    void deleteAllByJobId(Long jobId);

    void deleteAllByUserId(Long userId);
}

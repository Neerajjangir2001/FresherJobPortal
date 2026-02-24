package com.fresherjobs.service;

import com.fresherjobs.dto.response.JobResponse;
import com.fresherjobs.entity.Job;
import com.fresherjobs.entity.User;
import com.fresherjobs.enums.Role;
import com.fresherjobs.exception.ResourceNotFoundException;
import com.fresherjobs.repository.JobRepository;
import com.fresherjobs.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;

    public List<User> getAllRecruiters() {
        return userRepository.findAllByRole(Role.RECRUITER);
    }

    @Transactional
    public User approveRecruiter(Long recruiterId) {
        User recruiter = userRepository.findById(recruiterId)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter", recruiterId));

        if (recruiter.getRole() != Role.RECRUITER) {
            throw new IllegalStateException("User is not a recruiter");
        }

        recruiter.setIsApproved(true);
        return userRepository.save(recruiter);
    }

    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    @Transactional
    public void removeJob(Long jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", jobId));
        jobRepository.delete(job);
    }
}

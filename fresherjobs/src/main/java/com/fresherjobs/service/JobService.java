package com.fresherjobs.service;

import com.fresherjobs.dto.request.JobRequest;
import com.fresherjobs.dto.response.JobResponse;
import com.fresherjobs.entity.Company;
import com.fresherjobs.entity.Job;
import com.fresherjobs.entity.JobCategory;
import com.fresherjobs.entity.User;
import com.fresherjobs.exception.FresherJobViolationException;
import com.fresherjobs.exception.ResourceNotFoundException;
import com.fresherjobs.repository.ApplicationRepository;
import com.fresherjobs.repository.CompanyRepository;
import com.fresherjobs.repository.JobCategoryRepository;
import com.fresherjobs.repository.JobRepository;
import com.fresherjobs.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class JobService {

    private final JobRepository jobRepository;
    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;
    private final JobCategoryRepository jobCategoryRepository;
    private final ApplicationRepository applicationRepository;

    @Transactional
    public JobResponse createJob(JobRequest request, String recruiterEmail) {
        User recruiter = userRepository.findByEmail(recruiterEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter not found"));

        if (!recruiter.getIsApproved()) {
            throw new AccessDeniedException("Your account is pending admin approval. You cannot post jobs yet.");
        }

        if (request.getExperienceRequired() > 1) {
            throw new FresherJobViolationException("Only fresher jobs (0-1 year experience) are allowed!");
        }

        Company company = companyRepository.findByUserId(recruiter.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Company profile not found for recruiter"));

        JobCategory category = null;
        if (request.getCategoryId() != null) {
            category = jobCategoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("JobCategory", request.getCategoryId()));
        }

        Job job = Job.builder()
                .company(company)
                .category(category)
                .title(request.getTitle())
                .description(request.getDescription())
                .skillsRequired(request.getSkillsRequired())
                .jobType(request.getJobType())
                .experienceRequired(request.getExperienceRequired())
                .graduationYear(request.getGraduationYear())
                .salaryMin(request.getSalaryMin())
                .salaryMax(request.getSalaryMax())
                .location(request.getLocation())
                .expiresAt(request.getExpiresAt())
                .build();

        job = jobRepository.save(job);
        return mapToResponse(job);
    }

    public List<JobResponse> getAllActiveJobs() {
        return jobRepository.findAllByIsActiveTrue()
                .stream().map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public JobResponse getJobById(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job", id));
        return mapToResponse(job);
    }

    @Transactional
    public JobResponse updateJob(Long id, JobRequest request, String recruiterEmail) {
        User recruiter = userRepository.findByEmail(recruiterEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter not found"));

        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job", id));

        if (!job.getCompany().getUser().getId().equals(recruiter.getId())) {
            throw new AccessDeniedException("You are not authorized to update this job");
        }

        if (request.getExperienceRequired() > 1) {
            throw new FresherJobViolationException("Only fresher jobs (0-1 year experience) are allowed!");
        }

        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setSkillsRequired(request.getSkillsRequired());
        job.setJobType(request.getJobType());
        job.setExperienceRequired(request.getExperienceRequired());
        job.setGraduationYear(request.getGraduationYear());
        job.setSalaryMin(request.getSalaryMin());
        job.setSalaryMax(request.getSalaryMax());
        job.setLocation(request.getLocation());
        job.setExpiresAt(request.getExpiresAt());

        if (request.getCategoryId() != null) {
            JobCategory category = jobCategoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("JobCategory", request.getCategoryId()));
            job.setCategory(category);
        }

        return mapToResponse(jobRepository.save(job));
    }

    @Transactional
    public void deleteJob(Long id, String recruiterEmail) {
        User recruiter = userRepository.findByEmail(recruiterEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter not found"));

        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job", id));

        if (!job.getCompany().getUser().getId().equals(recruiter.getId())) {
            throw new AccessDeniedException("You are not authorized to delete this job");
        }

        // Delete all applications for this job first
        applicationRepository.deleteAllByJobId(id);
        jobRepository.delete(job);
    }

    public List<JobResponse> getMyJobs(String recruiterEmail) {
        User recruiter = userRepository.findByEmail(recruiterEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter not found"));

        return jobRepository.findAllByCompanyUserId(recruiter.getId())
                .stream().map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Scheduled(cron = "0 0 0 * * *")
    @Transactional
    public void deactivateExpiredJobs() {
        log.info("Running scheduled job expiry check at midnight...");
        jobRepository.deactivateExpiredJobs(LocalDate.now());
        log.info("Expired jobs deactivated.");
    }

    private JobResponse mapToResponse(Job job) {
        return JobResponse.builder()
                .id(job.getId())
                .title(job.getTitle())
                .description(job.getDescription())
                .skillsRequired(job.getSkillsRequired())
                .jobType(job.getJobType())
                .experienceRequired(job.getExperienceRequired())
                .graduationYear(job.getGraduationYear())
                .salaryMin(job.getSalaryMin())
                .salaryMax(job.getSalaryMax())
                .location(job.getLocation())
                .isActive(job.getIsActive())
                .postedAt(job.getPostedAt())
                .expiresAt(job.getExpiresAt())
                .companyName(job.getCompany() != null ? job.getCompany().getCompanyName() : null)
                .companyLogoUrl(job.getCompany() != null ? job.getCompany().getLogoUrl() : null)
                .companyWebsite(job.getCompany() != null ? job.getCompany().getWebsite() : null)
                .categoryName(job.getCategory() != null ? job.getCategory().getCatName() : null)
                .build();
    }
}

package com.fresherjobs.service;

import com.fresherjobs.entity.Company;
import com.fresherjobs.entity.FresherProfile;
import com.fresherjobs.entity.Job;
import com.fresherjobs.entity.User;
import com.fresherjobs.enums.Role;
import com.fresherjobs.exception.ResourceNotFoundException;
import com.fresherjobs.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final FresherProfileRepository fresherProfileRepository;
    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final CloudinaryService cloudinaryService;

    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getRole() == Role.JOB_SEEKER) {
            deleteJobSeeker(user);
        } else if (user.getRole() == Role.RECRUITER) {
            deleteRecruiter(user);
        }

        userRepository.delete(user);
    }

    private void deleteJobSeeker(User user) {
        // Delete Fresher Profile
        fresherProfileRepository.findByUserId(user.getId()).ifPresent(profile -> {
            // Delete Cloudinary Files
            if (profile.getResumeUrl() != null) {
                // Determine publicId from email (stable ID pattern)
                String publicId = user.getEmail().replaceAll("[^a-zA-Z0-9]", "_") + "_resume";
                cloudinaryService.deleteFile(publicId);
            }
            if (profile.getProfilePhoto() != null) {
                String publicId = user.getEmail().replaceAll("[^a-zA-Z0-9]", "_") + "_photo";
                cloudinaryService.deleteFile(publicId);
            }
            fresherProfileRepository.delete(profile);
        });

        // Delete Applications
        applicationRepository.deleteAllByUserId(user.getId());
    }

    private void deleteRecruiter(User user) {
        companyRepository.findByUserId(user.getId()).ifPresent(company -> {
            // Delete Jobs posted by this company
            List<Job> jobs = jobRepository.findAllByCompanyId(company.getId());
            for (Job job : jobs) {
                // Delete applications for this job first
                applicationRepository.deleteAllByJobId(job.getId());
                jobRepository.delete(job);
            }
            if (company.getLogoUrl() != null) {
                // Assuming logo public ID logic if implemented
                String publicId = user.getEmail().replaceAll("[^a-zA-Z0-9]", "_") + "_logo";
                cloudinaryService.deleteFile(publicId);
            }
            companyRepository.delete(company);
        });
    }
}

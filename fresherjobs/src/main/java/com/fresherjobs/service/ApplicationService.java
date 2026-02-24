package com.fresherjobs.service;

import com.fresherjobs.dto.request.ApplicationRequest;
import com.fresherjobs.dto.response.ApplicationResponse;
import com.fresherjobs.entity.Application;
import com.fresherjobs.entity.FresherProfile;
import com.fresherjobs.entity.Job;
import com.fresherjobs.entity.Notification;
import com.fresherjobs.entity.User;
import com.fresherjobs.enums.AppStatus;
import com.fresherjobs.enums.NotifType;
import com.fresherjobs.enums.Role;
import com.fresherjobs.exception.ResourceNotFoundException;
import com.fresherjobs.repository.ApplicationRepository;
import com.fresherjobs.repository.FresherProfileRepository;
import com.fresherjobs.repository.JobRepository;
import com.fresherjobs.repository.NotificationRepository;
import com.fresherjobs.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApplicationService {

        private final ApplicationRepository applicationRepository;
        private final JobRepository jobRepository;
        private final UserRepository userRepository;
        private final NotificationRepository notificationRepository;
        private final FresherProfileRepository fresherProfileRepository;
        private final EmailService emailService;

        @Transactional
        public ApplicationResponse applyForJob(Long jobId, ApplicationRequest request, String userEmail) {
                User user = userRepository.findByEmail(userEmail)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

                if (user.getRole() != Role.JOB_SEEKER) {
                        throw new AccessDeniedException("Only job seekers can apply for jobs");
                }

                Job job = jobRepository.findById(jobId)
                                .orElseThrow(() -> new ResourceNotFoundException("Job", jobId));

                if (!job.getIsActive()) {
                        throw new IllegalStateException("This job posting is no longer active.");
                }

                if (applicationRepository.existsByUserIdAndJobId(user.getId(), jobId)) {
                        throw new IllegalStateException("Already applied to this job.");
                }

                Application application = Application.builder()
                                .user(user)
                                .job(job)
                                .resumeUrl(request.getResumeUrl())
                                .coverLetter(request.getCoverLetter())
                                .status(AppStatus.APPLIED)
                                .build();

                application = applicationRepository.save(application);

                // Notify the recruiter (as IN_APP notification)
                Notification recruiterNotif = Notification.builder()
                                .user(job.getCompany().getUser())
                                .message("New application received for job: " + job.getTitle() + " from "
                                                + user.getName())
                                .type(NotifType.IN_APP)
                                .build();
                notificationRepository.save(recruiterNotif);

                // Notify the recruiter via Email
                String recruiterEmail = job.getCompany().getUser().getEmail();
                emailService.sendHtmlEmail(
                                recruiterEmail,
                                "New Application for " + job.getTitle(),
                                "new-application",
                                Map.of(
                                                "recruiterName", job.getCompany().getUser().getName(),
                                                "jobTitle", job.getTitle(),
                                                "applicantName", user.getName(),
                                                "applicantEmail", user.getEmail()));

                // Notify the applicant via Email
                emailService.sendHtmlEmail(
                                user.getEmail(),
                                "Application Submitted: " + job.getTitle(),
                                "application-submitted",
                                Map.of(
                                                "userName", user.getName(),
                                                "jobTitle", job.getTitle(),
                                                "companyName", job.getCompany().getCompanyName()));

                return mapToResponse(application);
        }

        public List<ApplicationResponse> getMyApplications(String userEmail) {
                User user = userRepository.findByEmail(userEmail)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

                return applicationRepository.findAllByUserId(user.getId())
                                .stream().map(this::mapToResponse)
                                .collect(Collectors.toList());
        }

        public List<ApplicationResponse> getApplicantsForJob(Long jobId, String recruiterEmail) {
                User recruiter = userRepository.findByEmail(recruiterEmail)
                                .orElseThrow(() -> new ResourceNotFoundException("Recruiter not found"));

                Job job = jobRepository.findById(jobId)
                                .orElseThrow(() -> new ResourceNotFoundException("Job", jobId));

                if (!job.getCompany().getUser().getId().equals(recruiter.getId())) {
                        throw new AccessDeniedException("You are not authorized to view applications for this job");
                }

                return applicationRepository.findAllByJobId(jobId)
                                .stream().map(this::mapToResponse)
                                .collect(Collectors.toList());
        }

        @Transactional
        public ApplicationResponse updateApplicationStatus(Long applicationId, AppStatus newStatus,
                        String recruiterEmail) {
                User recruiter = userRepository.findByEmail(recruiterEmail)
                                .orElseThrow(() -> new ResourceNotFoundException("Recruiter not found"));

                Application application = applicationRepository.findById(applicationId)
                                .orElseThrow(() -> new ResourceNotFoundException("Application", applicationId));

                if (!application.getJob().getCompany().getUser().getId().equals(recruiter.getId())) {
                        throw new AccessDeniedException("You are not authorized to update this application");
                }

                application.setStatus(newStatus);
                application = applicationRepository.save(application);

                // Notify the job seeker about status change
                String statusMsg = buildStatusMessage(application.getJob().getTitle(), newStatus);
                Notification notification = Notification.builder()
                                .user(application.getUser())
                                .message(statusMsg)
                                .type(NotifType.IN_APP)
                                .build();
                notificationRepository.save(notification);

                // Notify the job seeker via Email
                String subject = "Application Status Update: " + application.getJob().getTitle();
                Map<String, String> statusVars = new HashMap<>();
                statusVars.put("userName", application.getUser().getName());
                statusVars.put("statusMessage", statusMsg);
                statusVars.put("statusName", newStatus.name());

                // Color coding based on status
                switch (newStatus) {
                        case HIRED -> {
                                statusVars.put("statusBgColor", "#ecfdf5");
                                statusVars.put("statusBorderColor", "#a7f3d0");
                                statusVars.put("statusTextColor", "#059669");
                        }
                        case SHORTLISTED -> {
                                statusVars.put("statusBgColor", "#fffbeb");
                                statusVars.put("statusBorderColor", "#fde68a");
                                statusVars.put("statusTextColor", "#d97706");
                        }
                        case REJECTED -> {
                                statusVars.put("statusBgColor", "#fef2f2");
                                statusVars.put("statusBorderColor", "#fecaca");
                                statusVars.put("statusTextColor", "#dc2626");
                        }
                        default -> {
                                statusVars.put("statusBgColor", "#f5f3ff");
                                statusVars.put("statusBorderColor", "#ddd6fe");
                                statusVars.put("statusTextColor", "#4f46e5");
                        }
                }
                emailService.sendHtmlEmail(application.getUser().getEmail(), subject, "status-update", statusVars);

                return mapToResponse(application);
        }

        private String buildStatusMessage(String jobTitle, AppStatus status) {
                return switch (status) {
                        case SHORTLISTED -> "Congratulations! You have been shortlisted for: " + jobTitle;
                        case HIRED -> "Great news! You have been hired for: " + jobTitle;
                        case REJECTED ->
                                "We regret to inform you that your application for " + jobTitle + " was not selected.";
                        default -> "Your application status for " + jobTitle + " has been updated to: " + status.name();
                };
        }

        private ApplicationResponse mapToResponse(Application app) {
                ApplicationResponse.ApplicationResponseBuilder builder = ApplicationResponse.builder()
                                .id(app.getId())
                                .jobId(app.getJob().getId())
                                .jobTitle(app.getJob().getTitle())
                                .companyName(app.getJob().getCompany().getCompanyName())
                                .userId(app.getUser().getId())
                                .applicantName(app.getUser().getName())
                                .applicantEmail(app.getUser().getEmail())
                                .resumeUrl(app.getResumeUrl())
                                .coverLetter(app.getCoverLetter())
                                .status(app.getStatus())
                                .appliedAt(app.getAppliedAt());

                // Enrich with profile data
                Optional<FresherProfile> profileOpt = fresherProfileRepository.findByUserId(app.getUser().getId());
                profileOpt.ifPresent(profile -> {
                        builder.profilePhoto(profile.getProfilePhoto())
                                        .collegeName(profile.getCollegeName())
                                        .degree(profile.getDegree())
                                        .graduationYear(profile.getGraduationYear())
                                        .cgpa(profile.getCgpa())
                                        .skills(profile.getSkills())
                                        .about(profile.getAbout());
                        // Use profile resume as fallback if application doesn't have one
                        if ((app.getResumeUrl() == null || app.getResumeUrl().isBlank())
                                        && profile.getResumeUrl() != null) {
                                builder.resumeUrl(profile.getResumeUrl());
                        }
                });

                return builder.build();
        }
}

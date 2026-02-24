package com.fresherjobs.controller;

import com.fresherjobs.dto.request.ApplicationRequest;
import com.fresherjobs.dto.response.ApplicationResponse;
import com.fresherjobs.enums.AppStatus;
import com.fresherjobs.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    @PostMapping("/{jobId}/apply")
    @PreAuthorize("hasRole('JOB_SEEKER')")
    public ResponseEntity<ApplicationResponse> applyForJob(
            @PathVariable Long jobId,
            @RequestBody ApplicationRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        ApplicationResponse response = applicationService.applyForJob(jobId, request, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('JOB_SEEKER')")
    public ResponseEntity<List<ApplicationResponse>> getMyApplications(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(applicationService.getMyApplications(userDetails.getUsername()));
    }

    @GetMapping("/job/{jobId}")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<List<ApplicationResponse>> getApplicantsForJob(
            @PathVariable Long jobId,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(applicationService.getApplicantsForJob(jobId, userDetails.getUsername()));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<ApplicationResponse> updateApplicationStatus(
            @PathVariable Long id,
            @RequestParam AppStatus status,
            @AuthenticationPrincipal UserDetails userDetails) {
        ApplicationResponse response = applicationService.updateApplicationStatus(id, status, userDetails.getUsername());
        return ResponseEntity.ok(response);
    }
}

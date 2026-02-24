package com.fresherjobs.controller;

import com.fresherjobs.dto.request.ProfileRequest;
import com.fresherjobs.entity.FresherProfile;
import com.fresherjobs.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @PostMapping
    @PreAuthorize("hasRole('JOB_SEEKER')")
    public ResponseEntity<FresherProfile> createOrUpdateProfile(
            @RequestBody ProfileRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        FresherProfile profile = profileService.createOrUpdateProfile(request, userDetails.getUsername());
        return ResponseEntity.ok(profile);
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('JOB_SEEKER')")
    public ResponseEntity<FresherProfile> getMyProfile(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(profileService.getMyProfile(userDetails.getUsername()));
    }
}

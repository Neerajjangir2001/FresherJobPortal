package com.fresherjobs.service;

import com.fresherjobs.dto.request.ProfileRequest;
import com.fresherjobs.entity.FresherProfile;
import com.fresherjobs.entity.User;
import com.fresherjobs.exception.ResourceNotFoundException;
import com.fresherjobs.repository.FresherProfileRepository;
import com.fresherjobs.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final FresherProfileRepository profileRepository;
    private final UserRepository userRepository;

    @Transactional
    public FresherProfile createOrUpdateProfile(ProfileRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        FresherProfile profile = profileRepository.findByUserId(user.getId())
                .orElse(FresherProfile.builder().user(user).build());

        profile.setCollegeName(request.getCollegeName());
        profile.setDegree(request.getDegree());
        profile.setGraduationYear(request.getGraduationYear());
        profile.setCgpa(request.getCgpa());
        profile.setSkills(request.getSkills());
        profile.setResumeUrl(request.getResumeUrl());
        profile.setProfilePhoto(request.getProfilePhoto());
        profile.setAbout(request.getAbout());

        return profileRepository.save(profile);
    }

    public FresherProfile getMyProfile(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return profileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found. Please create your profile first."));
    }
}

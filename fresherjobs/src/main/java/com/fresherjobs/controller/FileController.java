package com.fresherjobs.controller;

import com.fresherjobs.service.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileController {

    private final CloudinaryService cloudinaryService;

    @PostMapping("/upload/resume")
    public ResponseEntity<Map<String, String>> uploadResume(
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {
        // Use email as stable public_id so re-uploads keep the same URL
        String email = authentication.getName();
        String publicId = email.replaceAll("[^a-zA-Z0-9]", "_") + "_resume";
        String url = cloudinaryService.uploadFile(file, "resumes", publicId);
        return ResponseEntity.ok(Map.of(
                "url", url,
                "filename", file.getOriginalFilename() != null ? file.getOriginalFilename() : "resume"));
    }

    @PostMapping("/upload/photo")
    public ResponseEntity<Map<String, String>> uploadPhoto(
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {
        // Use email as stable public_id so re-uploads keep the same URL
        String email = authentication.getName();
        String publicId = email.replaceAll("[^a-zA-Z0-9]", "_") + "_photo";
        String url = cloudinaryService.uploadImage(file, "photos", publicId);
        return ResponseEntity.ok(Map.of(
                "url", url,
                "filename", file.getOriginalFilename() != null ? file.getOriginalFilename() : "photo"));
    }
}

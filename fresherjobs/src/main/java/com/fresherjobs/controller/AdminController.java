package com.fresherjobs.controller;

import com.fresherjobs.entity.Job;
import com.fresherjobs.entity.User;
import com.fresherjobs.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/recruiters")
    public ResponseEntity<List<User>> getAllRecruiters() {
        return ResponseEntity.ok(adminService.getAllRecruiters());
    }

    @PutMapping("/recruiters/{id}/approve")
    public ResponseEntity<User> approveRecruiter(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.approveRecruiter(id));
    }

    @GetMapping("/jobs")
    public ResponseEntity<List<Job>> getAllJobs() {
        return ResponseEntity.ok(adminService.getAllJobs());
    }

    @DeleteMapping("/jobs/{id}")
    public ResponseEntity<Void> removeJob(@PathVariable Long id) {
        adminService.removeJob(id);
        return ResponseEntity.noContent().build();
    }
}

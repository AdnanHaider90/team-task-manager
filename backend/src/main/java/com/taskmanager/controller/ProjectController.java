package com.taskmanager.controller;

import com.taskmanager.dto.AppDto.*;
import com.taskmanager.model.User;
import com.taskmanager.repository.UserRepository;
import com.taskmanager.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;
    private final UserRepository userRepository;

    private User getCurrentUser(Authentication auth) {
        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(@RequestBody ProjectRequest request,
                                                          Authentication auth) {
        return ResponseEntity.ok(projectService.createProject(request, getCurrentUser(auth)));
    }

    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getMyProjects(Authentication auth) {
        return ResponseEntity.ok(projectService.getMyProjects(getCurrentUser(auth)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponse> getProject(@PathVariable Long id, Authentication auth) {
        return ResponseEntity.ok(projectService.getProject(id, getCurrentUser(auth)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectResponse> updateProject(@PathVariable Long id,
                                                          @RequestBody ProjectRequest request,
                                                          Authentication auth) {
        return ResponseEntity.ok(projectService.updateProject(id, request, getCurrentUser(auth)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id, Authentication auth) {
        projectService.deleteProject(id, getCurrentUser(auth));
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserSummary>> getAllUsers() {
        return ResponseEntity.ok(projectService.getAllUsers());
    }
}

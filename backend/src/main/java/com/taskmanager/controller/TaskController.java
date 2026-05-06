package com.taskmanager.controller;

import com.taskmanager.dto.AppDto.*;
import com.taskmanager.model.User;
import com.taskmanager.repository.UserRepository;
import com.taskmanager.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;
    private final UserRepository userRepository;

    private User getCurrentUser(Authentication auth) {
        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PostMapping
    public ResponseEntity<TaskResponse> createTask(@RequestBody TaskRequest request, Authentication auth) {
        return ResponseEntity.ok(taskService.createTask(request, getCurrentUser(auth)));
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<TaskResponse>> getTasksByProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(taskService.getTasksByProject(projectId));
    }

    @GetMapping("/my")
    public ResponseEntity<List<TaskResponse>> getMyTasks(Authentication auth) {
        return ResponseEntity.ok(taskService.getMyTasks(getCurrentUser(auth)));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardResponse> getDashboard(Authentication auth) {
        return ResponseEntity.ok(taskService.getDashboard(getCurrentUser(auth)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskResponse> updateTask(@PathVariable Long id,
                                                    @RequestBody TaskRequest request,
                                                    Authentication auth) {
        return ResponseEntity.ok(taskService.updateTask(id, request, getCurrentUser(auth)));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<TaskResponse> updateStatus(@PathVariable Long id,
                                                      @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(taskService.updateTaskStatus(id, body.get("status")));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }
}

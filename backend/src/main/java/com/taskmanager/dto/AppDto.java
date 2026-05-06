package com.taskmanager.dto;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class AppDto {

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class ProjectRequest {
        private String name;
        private String description;
        private List<Long> memberIds;
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class ProjectResponse {
        private Long id;
        private String name;
        private String description;
        private String createdBy;
        private LocalDateTime createdAt;
        private List<UserSummary> members;
        private int taskCount;
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class TaskRequest {
        private String title;
        private String description;
        private String status;
        private String priority;
        private LocalDate dueDate;
        private Long projectId;
        private Long assignedToId;
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class TaskResponse {
        private Long id;
        private String title;
        private String description;
        private String status;
        private String priority;
        private LocalDate dueDate;
        private Long projectId;
        private String projectName;
        private UserSummary assignedTo;
        private String createdBy;
        private LocalDateTime createdAt;
        private boolean overdue;
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class UserSummary {
        private Long id;
        private String name;
        private String email;
        private String role;
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class DashboardResponse {
        private int totalProjects;
        private int totalTasks;
        private int todoCount;
        private int inProgressCount;
        private int doneCount;
        private int overdueCount;
        private List<TaskResponse> recentTasks;
        private List<TaskResponse> overdueTasks;
    }
}

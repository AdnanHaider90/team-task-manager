package com.taskmanager.service;

import com.taskmanager.dto.AppDto.*;
import com.taskmanager.model.Project;
import com.taskmanager.model.Task;
import com.taskmanager.model.User;
import com.taskmanager.repository.ProjectRepository;
import com.taskmanager.repository.TaskRepository;
import com.taskmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public TaskResponse createTask(TaskRequest request, User currentUser) {
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found"));

        User assignedTo = null;
        if (request.getAssignedToId() != null) {
            assignedTo = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new RuntimeException("Assigned user not found"));
        }

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .status(request.getStatus() != null ? Task.Status.valueOf(request.getStatus()) : Task.Status.TODO)
                .priority(request.getPriority() != null ? Task.Priority.valueOf(request.getPriority()) : Task.Priority.MEDIUM)
                .dueDate(request.getDueDate())
                .project(project)
                .assignedTo(assignedTo)
                .createdBy(currentUser)
                .build();

        return toResponse(taskRepository.save(task));
    }

    public List<TaskResponse> getTasksByProject(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        return taskRepository.findByProject(project).stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    public List<TaskResponse> getMyTasks(User currentUser) {
        return taskRepository.findByAssignedTo(currentUser).stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    public TaskResponse updateTask(Long id, TaskRequest request, User currentUser) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        if (request.getStatus() != null) task.setStatus(Task.Status.valueOf(request.getStatus()));
        if (request.getPriority() != null) task.setPriority(Task.Priority.valueOf(request.getPriority()));
        task.setDueDate(request.getDueDate());

        if (request.getAssignedToId() != null) {
            User assignedTo = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            task.setAssignedTo(assignedTo);
        }

        return toResponse(taskRepository.save(task));
    }

    public TaskResponse updateTaskStatus(Long id, String status) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        task.setStatus(Task.Status.valueOf(status));
        return toResponse(taskRepository.save(task));
    }

    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }

    public DashboardResponse getDashboard(User currentUser) {
        List<Project> projects = projectRepository.findAllByUser(currentUser);
        List<Task> allTasks = taskRepository.findAllByProjects(projects);

        long todo = allTasks.stream().filter(t -> t.getStatus() == Task.Status.TODO).count();
        long inProgress = allTasks.stream().filter(t -> t.getStatus() == Task.Status.IN_PROGRESS).count();
        long done = allTasks.stream().filter(t -> t.getStatus() == Task.Status.DONE).count();

        List<Task> overdueTasks = taskRepository.findOverdueTasksForProjects(projects, LocalDate.now());

        List<TaskResponse> recent = allTasks.stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .limit(5)
                .map(this::toResponse)
                .collect(Collectors.toList());

        return DashboardResponse.builder()
                .totalProjects(projects.size())
                .totalTasks(allTasks.size())
                .todoCount((int) todo)
                .inProgressCount((int) inProgress)
                .doneCount((int) done)
                .overdueCount(overdueTasks.size())
                .recentTasks(recent)
                .overdueTasks(overdueTasks.stream().map(this::toResponse).collect(Collectors.toList()))
                .build();
    }

    public TaskResponse toResponse(Task t) {
        boolean overdue = t.getDueDate() != null
                && t.getDueDate().isBefore(LocalDate.now())
                && t.getStatus() != Task.Status.DONE;

        UserSummary assignedSummary = null;
        if (t.getAssignedTo() != null) {
            assignedSummary = UserSummary.builder()
                    .id(t.getAssignedTo().getId())
                    .name(t.getAssignedTo().getName())
                    .email(t.getAssignedTo().getEmail())
                    .role(t.getAssignedTo().getRole().name())
                    .build();
        }

        return TaskResponse.builder()
                .id(t.getId())
                .title(t.getTitle())
                .description(t.getDescription())
                .status(t.getStatus().name())
                .priority(t.getPriority().name())
                .dueDate(t.getDueDate())
                .projectId(t.getProject().getId())
                .projectName(t.getProject().getName())
                .assignedTo(assignedSummary)
                .createdBy(t.getCreatedBy() != null ? t.getCreatedBy().getName() : "")
                .createdAt(t.getCreatedAt())
                .overdue(overdue)
                .build();
    }
}

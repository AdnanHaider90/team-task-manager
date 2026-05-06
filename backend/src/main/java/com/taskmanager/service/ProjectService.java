package com.taskmanager.service;

import com.taskmanager.dto.AppDto.*;
import com.taskmanager.model.Project;
import com.taskmanager.model.User;
import com.taskmanager.repository.ProjectRepository;
import com.taskmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public ProjectResponse createProject(ProjectRequest request, User currentUser) {
        Project project = Project.builder()
                .name(request.getName())
                .description(request.getDescription())
                .createdBy(currentUser)
                .build();

        if (request.getMemberIds() != null && !request.getMemberIds().isEmpty()) {
            Set<User> members = new HashSet<>(userRepository.findAllById(request.getMemberIds()));
            members.add(currentUser);
            project.setMembers(members);
        } else {
            project.setMembers(Set.of(currentUser));
        }

        return toResponse(projectRepository.save(project));
    }

    public List<ProjectResponse> getMyProjects(User currentUser) {
        return projectRepository.findAllByUser(currentUser)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public ProjectResponse getProject(Long id, User currentUser) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        return toResponse(project);
    }

    public ProjectResponse updateProject(Long id, ProjectRequest request, User currentUser) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        if (!project.getCreatedBy().getId().equals(currentUser.getId())
                && currentUser.getRole() != User.Role.ADMIN) {
            throw new RuntimeException("Not authorized");
        }

        project.setName(request.getName());
        project.setDescription(request.getDescription());

        if (request.getMemberIds() != null) {
            Set<User> members = new HashSet<>(userRepository.findAllById(request.getMemberIds()));
            members.add(currentUser);
            project.setMembers(members);
        }

        return toResponse(projectRepository.save(project));
    }

    public void deleteProject(Long id, User currentUser) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        if (!project.getCreatedBy().getId().equals(currentUser.getId())
                && currentUser.getRole() != User.Role.ADMIN) {
            throw new RuntimeException("Not authorized");
        }

        projectRepository.delete(project);
    }

    public List<UserSummary> getAllUsers() {
        return userRepository.findAll().stream()
                .map(u -> UserSummary.builder()
                        .id(u.getId()).name(u.getName())
                        .email(u.getEmail()).role(u.getRole().name())
                        .build())
                .collect(Collectors.toList());
    }

    private ProjectResponse toResponse(Project p) {
        List<UserSummary> members = p.getMembers().stream()
                .map(u -> UserSummary.builder()
                        .id(u.getId()).name(u.getName())
                        .email(u.getEmail()).role(u.getRole().name())
                        .build())
                .collect(Collectors.toList());

        return ProjectResponse.builder()
                .id(p.getId())
                .name(p.getName())
                .description(p.getDescription())
                .createdBy(p.getCreatedBy().getName())
                .createdAt(p.getCreatedAt())
                .members(members)
                .taskCount(p.getTasks() != null ? p.getTasks().size() : 0)
                .build();
    }
}

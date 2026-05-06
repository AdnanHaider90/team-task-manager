package com.taskmanager.repository;

import com.taskmanager.model.Task;
import com.taskmanager.model.User;
import com.taskmanager.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByProject(Project project);
    List<Task> findByAssignedTo(User user);

    @Query("SELECT t FROM Task t WHERE t.project.id = :projectId")
    List<Task> findByProjectId(@Param("projectId") Long projectId);

    @Query("SELECT t FROM Task t WHERE t.assignedTo = :user AND t.dueDate < :today AND t.status != 'DONE'")
    List<Task> findOverdueTasksForUser(@Param("user") User user, @Param("today") LocalDate today);

    @Query("SELECT t FROM Task t WHERE t.project IN :projects AND t.dueDate < :today AND t.status != 'DONE'")
    List<Task> findOverdueTasksForProjects(@Param("projects") List<Project> projects, @Param("today") LocalDate today);

    @Query("SELECT t FROM Task t WHERE t.project IN :projects")
    List<Task> findAllByProjects(@Param("projects") List<Project> projects);
}

package com.sts.Etickette.entity;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name="ticket")
@EntityListeners(AuditingEntityListener.class)
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="ticket_id")
    private Long id;

    @Column(name="title", nullable = false)
    private String title;

    @Column(name="description", nullable = false)
    private String description;

    @CreatedDate
    @Column(name="created_at", updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name="updated_at")
    private LocalDateTime updatedAt;

    @Column(name="resolved_at")
    private LocalDateTime resolvedAt;

    @ManyToOne
    @JoinColumn(name="client_id", nullable = false)
    private User client;

    @ManyToOne
    @JoinColumn(name="agent_id", nullable = true)
    private Agent agent;

    @Enumerated(EnumType.STRING)
    @Column(nullable=false, name="priority")
    private Priority priority;

    @Enumerated(EnumType.STRING)
    @Column(nullable=false, name="status")
    private Status status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, name="category")
    private Category category;

    public enum Priority{
        LOW, MEDIUM, HIGH, CRITICAL
    }

    public enum Status{
        OPEN, IN_PROGRESS, RESOLVED, CLOSED, QUEUED
    }

    public enum Category {
        TECHNICAL_ISSUE,
        ACCOUNT_BILLING,
        FEATURE_REQUEST,
        GENERAL_INQUIRY,
        SERVICE_OUTAGE,
        SECURITY,
        FEEDBACK
    }

    public Ticket() {}

    public Ticket(Long id, String title, String description, LocalDateTime createdAt, LocalDateTime updatedAt, LocalDateTime resolvedAt, User client, Agent agent, Priority priority, Status status, Category category) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.resolvedAt = resolvedAt;
        this.client = client;
        this.agent = agent;
        this.priority = priority;
        this.status = status;
        this.category = category;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public LocalDateTime getResolvedAt() {
        return resolvedAt;
    }

    public void setResolvedAt(LocalDateTime resolvedAt) {
        this.resolvedAt = resolvedAt;
    }

    public User getClient() {
        return client;
    }

    public void setClient(User client) {
        this.client = client;
    }

    public Agent getAgent() {
        return agent;
    }

    public void setAgent(Agent agent) {
        this.agent = agent;
    }

    public Priority getPriority() {
        return priority;
    }

    public void setPriority(Priority priority) {
        this.priority = priority;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }
}

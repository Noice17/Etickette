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

    @Column(name="rating")
    private Double rating;

    @ManyToOne
    @JoinColumn(name="user_id", nullable = false)
    private Long client;

    @ManyToOne
    @JoinColumn(name="agent_id", nullable = false)
    private Long agentId;

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
        OPEN, IN_PROGRESS, RESOLVED, CLOSED
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

    public Ticket(Long id, String title, String description, LocalDateTime createdAt, LocalDateTime updatedAt, LocalDateTime resolvedAt, Double rating, Long client, Long agentId, Priority priority, Status status, Category category) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.resolvedAt = resolvedAt;
        this.rating = rating;
        this.client = client;
        this.agentId = agentId;
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

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public Long getClient() {
        return client;
    }

    public void setClient(Long client) {
        this.client = client;
    }

    public Long getAgent() {
        return agentId;
    }

    public void setAgent(Long agentId) {
        this.agentId = agentId;
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

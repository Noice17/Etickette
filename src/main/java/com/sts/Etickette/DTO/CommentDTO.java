package com.sts.Etickette.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class CommentDTO {
    private Long id;

    @NotBlank(message = "Message is required")
    private String message;

    private LocalDateTime createdAt;

    @NotNull(message = "Ticket is required")
    private Long ticketId;

    @NotNull(message = "User is required")
    private Long userId;

    public CommentDTO() {}

    public CommentDTO(Long id, String message, LocalDateTime createdAt, Long ticketId, Long userId) {
        this.id = id;
        this.message = message;
        this.createdAt = createdAt;
        this.ticketId = ticketId;
        this.userId = userId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Long getTicketId() {
        return ticketId;
    }

    public void setTicketId(Long ticketId) {
        this.ticketId = ticketId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
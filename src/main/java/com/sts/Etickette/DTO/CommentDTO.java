package com.sts.Etickette.DTO;

import com.sts.Etickette.entity.Ticket;

import java.time.LocalDateTime;

public class CommentDTO {
    private Long id;
    private String message;
    private LocalDateTime createdAt;
    private Ticket ticketId;
    private Long userId;

    public CommentDTO() {}

    public CommentDTO(Long id, String message, LocalDateTime createdAt, Ticket ticketId, Long userId) {
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

    public Ticket getTicketId() {
        return ticketId;
    }

    public void setTicketId(Ticket ticketId) {
        this.ticketId = ticketId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}

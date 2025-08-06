package com.sts.Etickette.DTO;

import com.sts.Etickette.entity.Ticket;
import com.sts.Etickette.entity.User;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class CommentDTO {
    private Long id;

    @NotBlank(message = "Message is required")
    private String message;

    private LocalDateTime createdAt;

    @NotNull(message = "Ticket is required")
    private Ticket ticket;

    @NotNull(message = "User is required")
    private User user;

    public CommentDTO() {}

    public CommentDTO(Long id, String message, LocalDateTime createdAt, Ticket ticket, User user) {
        this.id = id;
        this.message = message;
        this.createdAt = createdAt;
        this.ticket = ticket;
        this.user = user;
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

    public Ticket getTicket() {
        return ticket;
    }

    public void setTicket(Ticket ticket) {
        this.ticket = ticket;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
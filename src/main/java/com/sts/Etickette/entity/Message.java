package com.sts.Etickette.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

import java.time.LocalDateTime;

@Entity
public class Message {
    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    private Ticket ticket;

    @ManyToOne
    private User sender;

    private String content;
    private LocalDateTime sentAt;
    private LocalDateTime readAt;

    public Message() {}

    public Message(Long id, Ticket ticket, User sender, String content, LocalDateTime sentAt, LocalDateTime readAt) {
        this.id = id;
        this.ticket = ticket;
        this.sender = sender;
        this.content = content;
        this.sentAt = sentAt;
        this.readAt = readAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Ticket getTicket() {
        return ticket;
    }

    public void setTicket(Ticket ticket) {
        this.ticket = ticket;
    }

    public User getSender() {
        return sender;
    }

    public void setSender(User sender) {
        this.sender = sender;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getSentAt() {
        return sentAt;
    }

    public void setSentAt(LocalDateTime sentAt) {
        this.sentAt = sentAt;
    }

    public LocalDateTime getReadAt() {
        return readAt;
    }

    public void setReadAt(LocalDateTime readAt) {
        this.readAt = readAt;
    }
}

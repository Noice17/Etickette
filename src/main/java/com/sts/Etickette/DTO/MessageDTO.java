package com.sts.Etickette.DTO;

import java.time.LocalDateTime;

public class MessageDTO {
    private Long id;
    private Long ticketId;
    private Long senderId;
    private String content;
    private LocalDateTime sentAt;
    private LocalDateTime readAt;
    private String senderName;

    public MessageDTO() {}

    public MessageDTO(Long id, Long ticketId, Long senderId, String content, LocalDateTime sentAt, LocalDateTime readAt, String senderName) {
        this.id = id;
        this.ticketId = ticketId;
        this.senderId = senderId;
        this.content = content;
        this.sentAt = sentAt;
        this.readAt = readAt;
        this.senderName = senderName;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getTicketId() {
        return ticketId;
    }

    public void setTicketId(Long ticketId) {
        this.ticketId = ticketId;
    }

    public Long getSenderId() {
        return senderId;
    }

    public void setSenderId(Long senderId) {
        this.senderId = senderId;
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

    public String getSenderName() {
        return senderName;
    }

    public void setSenderName(String senderName) {
        this.senderName = senderName;
    }
}

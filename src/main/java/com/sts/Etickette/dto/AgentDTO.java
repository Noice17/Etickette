package com.sts.Etickette.dto;

import com.sts.Etickette.entity.User;

public class AgentDTO {
    private Long id;
    private Long userId;
    private int maxWorkload;
    private int currentWorkload;

    public AgentDTO() {
    }

    public AgentDTO(Long id, Long userId, int maxWorkload, int currentWorkload) {
        this.id = id;
        this.userId = userId;
        this.maxWorkload = maxWorkload;
        this.currentWorkload = currentWorkload;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public int getMaxWorkload() {
        return maxWorkload;
    }

    public void setMaxWorkload(int maxWorkload) {
        this.maxWorkload = maxWorkload;
    }

    public int getCurrentWorkload() {
        return currentWorkload;
    }

    public void setCurrentWorkload(int currentWorkload) {
        this.currentWorkload = currentWorkload;
    }
}

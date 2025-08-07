package com.sts.Etickette.DTO;

public class AgentDTO {
    private Long userId;
    private String username;
    private String email;
    private Integer maxWorkload;
    private Integer currentWorkload;
    private Double averageRating = 0.0;
    private Integer ratingCount = 0;

    public AgentDTO() {
    }

    public AgentDTO(Long userId, Integer maxWorkload, Integer currentWorkload, Double averageRating, Integer ratingCount) {
        this.userId = userId;
        this.maxWorkload = maxWorkload;
        this.currentWorkload = currentWorkload;
        this.averageRating = averageRating;
        this.ratingCount = ratingCount;
    }

    public AgentDTO(Long userId, String username, String email, Integer maxWorkload, Integer currentWorkload, Double averageRating, Integer ratingCount) {
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.maxWorkload = maxWorkload;
        this.currentWorkload = currentWorkload;
        this.averageRating = averageRating;
        this.ratingCount = ratingCount;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Integer getMaxWorkload() {
        return maxWorkload;
    }

    public void setMaxWorkload(Integer maxWorkload) {
        this.maxWorkload = maxWorkload;
    }

    public Integer getCurrentWorkload() {
        return currentWorkload;
    }

    public void setCurrentWorkload(Integer currentWorkload) {
        this.currentWorkload = currentWorkload;
    }

    public Double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(Double averageRating) {
        this.averageRating = averageRating;
    }

    public Integer getRatingCount() {
        return ratingCount;
    }

    public void setRatingCount(Integer ratingCount) {
        this.ratingCount = ratingCount;
    }
}

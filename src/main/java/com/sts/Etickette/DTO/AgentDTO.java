package com.sts.Etickette.DTO;

public class AgentDTO {
    private Long userId;
    private int maxWorkload;
    private int currentWorkload;
    private double averageRating = 0.0;
    private int ratingCount = 0;

    public AgentDTO() {
    }

    public AgentDTO(Long userId, int maxWorkload, int currentWorkload, double averageRating, int ratingCount) {
        this.userId = userId;
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

    public double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(double averageRating) {
        this.averageRating = averageRating;
    }

    public int getRatingCount() {
        return ratingCount;
    }

    public void setRatingCount(int ratingCount) {
        this.ratingCount = ratingCount;
    }
}

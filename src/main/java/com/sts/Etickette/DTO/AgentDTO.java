package com.sts.Etickette.DTO;

import java.util.List;

public class AgentDTO {
    private Long userId;
    private int maxWorkload;
    private int currentWorkload;
    private List<Integer> rating;
    private double averageRating = 0.0;

    public AgentDTO() {
    }

    public AgentDTO(Long userId, int maxWorkload, int currentWorkload, List<Integer> rating, double averageRating) {
        this.userId = userId;
        this.maxWorkload = maxWorkload;
        this.currentWorkload = currentWorkload;
        this.rating = rating;
        this.averageRating = averageRating;
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

    public List<Integer> getRating() {
        return rating;
    }

    public void setRating(List<Integer> rating) {
        this.rating = rating;
    }

    public double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(double averageRating) {
        this.averageRating = averageRating;
    }
}

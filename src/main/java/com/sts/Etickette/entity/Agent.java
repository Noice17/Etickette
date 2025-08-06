package com.sts.Etickette.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
@Table(name = "agents")
public class Agent {

    @Id
    private Long userId;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @MapsId
    @JoinColumn(name = "user_id", nullable = false)
    @JsonBackReference
    private User user;

    @Column(name = "max_workload", nullable = false)
    private int maxWorkload = 25;

    @Column(name = "current_workload", nullable = false)
    private int currentWorkload = 0;

    @Column(name = "average_rating")
    private double averageRating = 0.0;

    @Column(name = "rating_count")
    private int ratingCount = 0;

    public Agent() {}

    public Agent(User user, int maxWorkload, int currentWorkload, double averageRating, int ratingCount) {
        this.user = user;
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

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
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

    public void addRating(int newRating) {
        double totalRating = this.averageRating * this.ratingCount;
        this.ratingCount++;
        this.averageRating = (totalRating + newRating) / this.ratingCount;
    }
}

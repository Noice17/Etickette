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
    private Integer maxWorkload = 25;

    @Column(name = "current_workload", nullable = false)
    private Integer currentWorkload = 0;

    @Column(name = "average_rating", nullable = false)
    private Double averageRating = 0.0;

    @Column(name = "rating_count", nullable = false)
    private Integer ratingCount = 0;

    public Agent() {}

    public Agent(User user, Integer maxWorkload, Integer currentWorkload, Double averageRating, Integer ratingCount) {
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

    public void addRating(Integer newRating) {
        if (this.ratingCount == null) this.ratingCount = 0;
        if (this.averageRating == null) this.averageRating = 0.0;

        double totalRating = this.averageRating * this.ratingCount;
        this.ratingCount++;
        this.averageRating = (totalRating + newRating) / this.ratingCount;
    }

}

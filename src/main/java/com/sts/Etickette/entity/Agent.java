package com.sts.Etickette.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

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

    @ElementCollection
    @CollectionTable(name = "agent_ratings", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "rating")
    private List<Integer> rating = new ArrayList<>();

    @Column(name = "average_rating")
    private double averageRating = 0.0;


    public Agent() {}

    public Agent(User user, int maxWorkload, int currentWorkload, List<Integer> rating, double averageRating) {
        this.user = user;
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

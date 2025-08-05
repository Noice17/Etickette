package com.sts.Etickette.repository;

import com.sts.Etickette.entity.Agent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AgentRepository extends JpaRepository<Agent, Long> {
    Agent findByUserId(Long userId);

}

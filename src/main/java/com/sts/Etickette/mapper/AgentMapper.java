package com.sts.Etickette.mapper;

import com.sts.Etickette.DTO.AgentDTO;
import com.sts.Etickette.entity.Agent;
import com.sts.Etickette.entity.User;
import org.springframework.stereotype.Component;

@Component
public class AgentMapper {

    public static Agent toEntity(AgentDTO dto) {
        Agent agent = new Agent();
        agent.setMaxWorkload(dto.getMaxWorkload());
        agent.setCurrentWorkload(dto.getCurrentWorkload());
        agent.setAverageRating(dto.getAverageRating());
        agent.setRatingCount(dto.getRatingCount());
        return agent;
    }

    public static Agent toEntity(AgentDTO dto, User user) {
        Agent agent = new Agent();
        agent.setMaxWorkload(dto.getMaxWorkload());
        agent.setCurrentWorkload(dto.getCurrentWorkload());
        agent.setAverageRating(dto.getAverageRating());
        agent.setRatingCount(dto.getRatingCount());
        agent.setUser(user);
        return agent;
    }

    public static AgentDTO toDTO(Agent agent) {
        AgentDTO dto = new AgentDTO();
        dto.setUserId(agent.getUser().getId());
        dto.setMaxWorkload(agent.getMaxWorkload());
        dto.setCurrentWorkload(agent.getCurrentWorkload());
        dto.setAverageRating(agent.getAverageRating());
        dto.setRatingCount(agent.getRatingCount());
        return dto;
    }
}

package com.sts.Etickette.mapper;

import com.sts.Etickette.DTO.AgentDTO;
import com.sts.Etickette.entity.Agent;
import com.sts.Etickette.entity.User;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class AgentMapper {

    public static Agent toEntity(AgentDTO dto) {
        Agent agent = new Agent();
        agent.setMaxWorkload(25);
        agent.setCurrentWorkload(dto.getCurrentWorkload());
        agent.setRating(dto.getRating());
        return agent;
    }

    public static Agent toEntity(AgentDTO dto, User user) {
        Agent agent = new Agent();
        agent.setMaxWorkload(25);
        agent.setCurrentWorkload(dto.getCurrentWorkload());
        agent.setUser(user);
        return agent;
    }

    public static AgentDTO toDTO(Agent agent) {
        AgentDTO dto = new AgentDTO();

        dto.setUserId(agent.getUser().getId());
        dto.setMaxWorkload(agent.getMaxWorkload());
        dto.setCurrentWorkload(agent.getCurrentWorkload());

        List<Integer> ratings = agent.getRating();

        if (ratings != null && !ratings.isEmpty()) {
            double avg = ratings.stream().mapToInt(Integer::intValue).average().orElse(0.0);
            dto.setAverageRating(avg);
            dto.setRating(ratings);
        } else {
            dto.setAverageRating(0.0);
            dto.setRating(List.of());
        }
        return dto;
    }
}

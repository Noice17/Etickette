package com.sts.Etickette.mapper;

import com.sts.Etickette.dto.AgentDTO;
import com.sts.Etickette.entity.Agent;
import com.sts.Etickette.entity.User;

public class AgentMapper {

    public static Agent toEntity(AgentDTO dto) {
        Agent agent = new Agent();
        agent.setMaxWorkload(25);
        agent.setCurrentWorkload(dto.getCurrentWorkload());
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
        dto.setId(agent.getId());
        dto.setMaxWorkload(25);
        dto.setCurrentWorkload(agent.getCurrentWorkload());
        return dto;
    }
}

package com.sts.Etickette.service;

import com.sts.Etickette.DTO.AgentDTO;

import java.util.List;

public interface AgentService {
    AgentDTO updateAgent(Long agentId, AgentDTO agentDTO);
    AgentDTO getAgentById(Long agentId);
    AgentDTO incrementWorkload(Long agentId, int increment);
    List<AgentDTO> getAllAgents();
}

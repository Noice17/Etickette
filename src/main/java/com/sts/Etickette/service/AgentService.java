package com.sts.Etickette.service;

import com.sts.Etickette.DTO.AgentDTO;

public interface AgentService {
    AgentDTO updateAgent(Long agentId, AgentDTO agentDTO);
    AgentDTO getAgentById(Long agentId);
    AgentDTO incrementWorkload(Long agentId);
    AgentDTO decrementWorkload(Long agentId);
}

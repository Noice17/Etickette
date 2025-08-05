package com.sts.Etickette.service;

import com.sts.Etickette.dto.AgentDTO;

public interface AgentService {
    AgentDTO updateAgent(Long agentId, AgentDTO agentDTO);
    AgentDTO getAgentById(Long agentId);
}

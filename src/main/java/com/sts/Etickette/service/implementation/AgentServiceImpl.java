package com.sts.Etickette.service.implementation;

import com.sts.Etickette.DTO.AgentDTO;
import com.sts.Etickette.entity.Agent;
import com.sts.Etickette.mapper.AgentMapper;
import com.sts.Etickette.repository.AgentRepository;
import com.sts.Etickette.service.AgentService;
import com.sts.Etickette.exception.ResourceNotFoundException;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AgentServiceImpl implements AgentService {

    private final AgentRepository agentRepository;
    private final AgentMapper agentMapper;

    public AgentServiceImpl(AgentRepository agentRepository, AgentMapper agentMapper) {
        this.agentRepository = agentRepository;
        this.agentMapper = agentMapper;
    }

    @Override
    public AgentDTO getAgentById(Long id) {
        Agent agent = agentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Agent not found with ID: " + id));
        return AgentMapper.toDTO(agent);
    }

    @Override
    public AgentDTO updateAgent(Long id, AgentDTO agentDTO) {
        Agent agent = agentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Agent not found with ID: " + id));

        agent.setCurrentWorkload(agentDTO.getCurrentWorkload());
        agent.setMaxWorkload(agentDTO.getMaxWorkload());

        Agent updated = agentRepository.save(agent);
        return AgentMapper.toDTO(updated);
    }

    @Override
    public List<AgentDTO> getAllAgents() {
        List<Agent> agents = agentRepository.findAll();
        return agents.stream()
                .map(AgentMapper::toDTO)
                .collect(Collectors.toList());
    }


    @Override
    public AgentDTO incrementWorkload(Long agentId, int increment) {
        Agent agent = agentRepository.findById(agentId)
                .orElseThrow(() -> new ResourceNotFoundException("Agent not found with ID: " + agentId));

        if (agent.getCurrentWorkload() + increment > agent.getMaxWorkload()) {
            throw new IllegalStateException("Agent will exceed maximum workload.");
        }

        agent.setCurrentWorkload(agent.getCurrentWorkload() + increment);
        return AgentMapper.toDTO(agentRepository.save(agent));
    }

}

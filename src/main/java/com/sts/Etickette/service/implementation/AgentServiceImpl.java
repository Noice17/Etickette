package com.sts.Etickette.service.implementation;

import com.sts.Etickette.DTO.AgentDTO;
import com.sts.Etickette.entity.Agent;
import com.sts.Etickette.mapper.AgentMapper;
import com.sts.Etickette.repository.AgentRepository;
import com.sts.Etickette.service.AgentService;
import com.sts.Etickette.exception.ResourceNotFoundException;

import org.springframework.stereotype.Service;

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
    public AgentDTO addRating(Long agentId, int rating) {
        Agent agent = agentRepository.findById(agentId)
                .orElseThrow(() -> new ResourceNotFoundException("Agent not found"));

        double totalRating = agent.getAverageRating() * agent.getRatingCount();
        totalRating += rating;
        agent.setRatingCount(agent.getRatingCount() + 1);
        agent.setAverageRating(totalRating / agent.getRatingCount());

        agentRepository.save(agent);
        return agentMapper.toDTO(agent);
    }


    @Override
    public AgentDTO incrementWorkload(Long agentId) {
        Agent agent = agentRepository.findById(agentId)
                .orElseThrow(() -> new ResourceNotFoundException("Agent not found with ID: " + agentId));

        if (agent.getCurrentWorkload() >= agent.getMaxWorkload()) {
            throw new IllegalStateException("Agent has reached maximum workload.");
        }

        agent.setCurrentWorkload(agent.getCurrentWorkload() + 1);
        return AgentMapper.toDTO(agentRepository.save(agent));
    }

    @Override
    public AgentDTO decrementWorkload(Long agentId) {
        Agent agent = agentRepository.findById(agentId)
                .orElseThrow(() -> new ResourceNotFoundException("Agent not found with ID: " + agentId));

        if (agent.getCurrentWorkload() <= 0) {
            throw new IllegalStateException("Agent's workload is already zero.");
        }

        agent.setCurrentWorkload(agent.getCurrentWorkload() - 1);
        return AgentMapper.toDTO(agentRepository.save(agent));
    }
}

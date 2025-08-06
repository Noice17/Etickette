package com.sts.Etickette.controller;

import com.sts.Etickette.DTO.AgentDTO;
import com.sts.Etickette.service.AgentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/agents")
public class AgentController {

    private final AgentService agentService;

    public AgentController(AgentService agentService) {
        this.agentService = agentService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<AgentDTO> getAgent(@PathVariable Long id) {
        return ResponseEntity.ok(agentService.getAgentById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AgentDTO> updateAgent(@PathVariable Long id, @RequestBody AgentDTO dto) {
        return ResponseEntity.ok(agentService.updateAgent(id, dto));
    }

    @PostMapping("/{agentId}/ratings")
    public ResponseEntity<AgentDTO> addRating(
            @PathVariable Long agentId,
            @RequestParam int rating) {
        AgentDTO updatedAgent = agentService.addRating(agentId, rating);
        return ResponseEntity.ok(updatedAgent);
    }

}

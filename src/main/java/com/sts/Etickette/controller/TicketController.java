package com.sts.Etickette.controller;

import com.sts.Etickette.DTO.TicketDTO;
import com.sts.Etickette.entity.Agent;
import com.sts.Etickette.entity.Ticket;
import com.sts.Etickette.entity.User;
import com.sts.Etickette.repository.AgentRepository;
import com.sts.Etickette.repository.UserRepository;
import com.sts.Etickette.service.TicketService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketService ticketService;
    private final UserRepository userRepository;
    private final AgentRepository agentRepository;

    public TicketController(TicketService ticketService, UserRepository userRepository, AgentRepository agentRepository) {
        this.ticketService = ticketService;
        this.userRepository = userRepository;
        this.agentRepository = agentRepository;
    }

    @PostMapping
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<?> createTicket(@Valid @RequestBody TicketDTO dto) {
        try {
            if (dto.getClient() != null && dto.getClient().getId() != null) {
                Optional<User> clientOpt = userRepository.findById(dto.getClient().getId());
                if (clientOpt.isEmpty()) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Client not found.");
                }
                dto.setClient(clientOpt.get());
            }
            dto.setAgent(null);
            TicketDTO created = ticketService.createTicket(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to create ticket: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('AGENT') or (hasRole('CLIENT') and @ticketSecurity.isOwner(#id, authentication))")
    public ResponseEntity<?> getTicketById(@PathVariable Long id) {
        return ticketService.getTicketById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("Ticket not found."));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('AGENT')")
    public ResponseEntity<?> updateTicket(@PathVariable Long id, @Valid @RequestBody TicketDTO dto, Authentication authentication) {
        try {
            ticketService.updateTicket(id, dto, authentication);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Ticket not found.");
        } catch (org.springframework.security.access.AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not authorized to update this ticket.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Could not update ticket: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('AGENT')")
    public ResponseEntity<?> deleteTicket(@PathVariable Long id, Authentication authentication) {
        try {
            ticketService.deleteTicket(id, authentication);
            return ResponseEntity.noContent().build();
        } catch (EmptyResultDataAccessException | EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Ticket not found.");
        } catch (org.springframework.security.access.AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not authorized to delete this ticket.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Could not delete ticket: " + e.getMessage());
        }
    }

    @GetMapping("/client/{clientId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getTicketByClient(@PathVariable Long clientId) {
        Optional<User> clientOpt = userRepository.findById(clientId);
        if (clientOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Client not found.");
        }
        List<TicketDTO> tickets = ticketService.getTicketByClient(clientOpt.get());
        return ResponseEntity.ok(tickets);
    }

    @GetMapping("/agent/{agentId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getTicketByAgent(@PathVariable Long agentId) {
        Optional<Agent> agentOpt = agentRepository.findById(agentId);
        if (agentOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Agent not found.");
        }
        List<TicketDTO> tickets = ticketService.getTicketByAgent(agentOpt.get());
        return ResponseEntity.ok(tickets);
    }

    @GetMapping("/title/{title}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getTicketByTitle(@PathVariable String title) {
        List<TicketDTO> tickets = ticketService.getTicketByTitle(title);
        return ResponseEntity.ok(tickets);
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getTicketByStatus(@PathVariable Ticket.Status status) {
        List<TicketDTO> tickets = ticketService.getTicketByStatus(status);
        return ResponseEntity.ok(tickets);
    }

    @GetMapping("/category/{category}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getTicketByCategory(@PathVariable Ticket.Category category) {
        List<TicketDTO> tickets = ticketService.getTicketByCategory(category);
        return ResponseEntity.ok(tickets);
    }

    @GetMapping("/description/{description}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getTicketByDescription(@PathVariable String description) {
        List<TicketDTO> tickets = ticketService.getTicketByDescription(description);
        return ResponseEntity.ok(tickets);
    }

    @GetMapping("/createdAt")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getTicketByCreationDate(@RequestParam String dateTime) {
        try {
            LocalDateTime date = LocalDateTime.parse(dateTime);
            List<TicketDTO> tickets = ticketService.getTicketByCreationDate(date);
            return ResponseEntity.ok(tickets);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid date format. Use ISO (e.g., 2024-12-31T23:59:59).");
        }
    }

    @GetMapping("/resolvedAt")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getTicketByResolutionDate(@RequestParam String dateTime) {
        try {
            LocalDateTime date = LocalDateTime.parse(dateTime);
            List<TicketDTO> tickets = ticketService.getTicketByResolutionDate(date);
            return ResponseEntity.ok(tickets);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid date format. Use ISO (e.g., 2024-12-31T23:59:59).");
        }
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAll() {
        List<TicketDTO> tickets = ticketService.getAll();
        return ResponseEntity.ok(tickets);
    }

    @GetMapping("/metrics/average-resolution-time")
    @PreAuthorize("hasRole('ADMIN')")
    public double getAverageResolutionTime() {
        return ticketService.getAverageResolutionTimeHours();
    }

    @GetMapping("/metrics/total-created")
    @PreAuthorize("hasRole('ADMIN')")
    public long getTotalTicketsCreated() {
        return ticketService.getTotalTicketsCreated();
    }

    @GetMapping("/metrics/total-resolved")
    @PreAuthorize("hasRole('ADMIN')")
    public long getTotalTicketsResolved() {
        return ticketService.getTotalTicketsResolved();
    }

    @GetMapping("/metrics/status-count")
    @PreAuthorize("hasRole('ADMIN')")
    public Map<Ticket.Status, Long> getTicketCountByStatus() {
        return ticketService.getTicketCountByStatus();
    }

    @GetMapping("/metrics/agent-average-resolution")
    @PreAuthorize("hasRole('ADMIN')")
    public Map<Long, Double> getAverageResolutionTimePerAgent() {
        return ticketService.getAverageResolutionTimePerAgent();
    }

    @PutMapping("/{ticketId}/rate")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<?> rateAgent(
            @PathVariable Long ticketId,
            @RequestParam int rating,
            Authentication authentication) {
        try {
            ticketService.rateAgent(ticketId, rating, authentication);
            return ResponseEntity.ok("Rating submitted!");
        } catch (org.springframework.security.access.AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only the ticket owner can rate the agent.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
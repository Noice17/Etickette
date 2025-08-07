package com.sts.Etickette.service.implementation;

import com.sts.Etickette.DTO.TicketDTO;
import com.sts.Etickette.entity.Agent;
import com.sts.Etickette.entity.Ticket;
import com.sts.Etickette.entity.User;
import com.sts.Etickette.mapper.TicketMapper;
import com.sts.Etickette.repository.AgentRepository;
import com.sts.Etickette.repository.TicketRepository;
import com.sts.Etickette.repository.UserRepository;
import com.sts.Etickette.service.EmailService;
import com.sts.Etickette.service.TicketService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TicketServiceImpl implements TicketService {
    private final TicketRepository ticketRepository;
    private final AgentRepository agentRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    public TicketServiceImpl(TicketRepository ticketRepository, AgentRepository agentRepository, UserRepository userRepository, EmailService emailService) {
        this.ticketRepository = ticketRepository;
        this.agentRepository = agentRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    private static final Map<Ticket.Category, Ticket.Priority> CATEGORY_PRIORITY_MAP = Map.of(
            Ticket.Category.SERVICE_OUTAGE, Ticket.Priority.CRITICAL,
            Ticket.Category.SECURITY, Ticket.Priority.CRITICAL,
            Ticket.Category.TECHNICAL_ISSUE, Ticket.Priority.HIGH,
            Ticket.Category.ACCOUNT_BILLING, Ticket.Priority.MEDIUM,
            Ticket.Category.FEATURE_REQUEST, Ticket.Priority.LOW,
            Ticket.Category.FEEDBACK, Ticket.Priority.LOW,
            Ticket.Category.GENERAL_INQUIRY, Ticket.Priority.LOW
    );

    private int getPriorityWeight(Ticket.Priority priority) {
        return switch (priority) {
            case CRITICAL -> 8;
            case HIGH -> 5;
            case MEDIUM -> 3;
            case LOW -> 1;
            default -> 0;
        };
    }

    private Optional<Agent> findAvailableAgent(int workloadIncrement) {
        return agentRepository.findAll().stream()
                .filter(agent -> agent.getCurrentWorkload() + workloadIncrement <= agent.getMaxWorkload())
                .min(Comparator.comparingInt(Agent::getCurrentWorkload));
    }

    private void assignQueuedTickets() {
        List<Ticket> queuedTickets = ticketRepository.findByStatusOrderByCreatedAtAsc(Ticket.Status.QUEUED);
        for (Ticket queued : queuedTickets) {
            Ticket.Priority priority = queued.getPriority();
            int workloadIncrement = getPriorityWeight(priority);
            Optional<Agent> agentOpt = findAvailableAgent(workloadIncrement);
            if (agentOpt.isPresent()) {
                Agent agent = agentOpt.get();
                agent.setCurrentWorkload(agent.getCurrentWorkload() + workloadIncrement);
                agentRepository.save(agent);

                queued.setAgent(agent);
                queued.setStatus(Ticket.Status.OPEN);
                ticketRepository.save(queued);
            }
        }
    }

    @Override
    public TicketDTO createTicket(TicketDTO dto) {
        Ticket.Category category = dto.getCategory();
        Ticket.Priority mappedPriority = CATEGORY_PRIORITY_MAP.getOrDefault(category, Ticket.Priority.LOW);

        int workloadIncrement = getPriorityWeight(mappedPriority);
        Optional<Agent> agentOpt = findAvailableAgent(workloadIncrement);

        if (agentOpt.isPresent()) {
            Agent agent = agentOpt.get();
            agent.setCurrentWorkload(agent.getCurrentWorkload() + workloadIncrement);
            agentRepository.save(agent);
            dto.setAgent(agent);
            dto.setStatus(dto.getStatus() != null ? dto.getStatus() : Ticket.Status.OPEN);
        } else {
            dto.setAgent(null);
            dto.setStatus(Ticket.Status.QUEUED);
        }

        User client = userRepository.findById(dto.getClient().getId())
                .orElseThrow(() -> new RuntimeException("Client not found"));
        dto.setClient(client);

        Ticket ticket = TicketMapper.toEntity(dto);
        ticket.setPriority(mappedPriority);
        Ticket savedTicket = ticketRepository.save(ticket);

        emailService.sendHtmlEmail(ticket.getClient().getEmail(),
                "Ticket Created: " + ticket.getTitle(), "<p>Your ticket has been created with ID " + ticket.getId() + ".</p>");

        return TicketMapper.toDTO(savedTicket);
    }


    @Override
    public void deleteTicket(Long id, Authentication authentication){
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Ticket not found"));
        String currentUserEmail = authentication.getName();
        Agent assignedAgent = ticket.getAgent();
        if (assignedAgent == null || !assignedAgent.getUser().getEmail().equals(currentUserEmail)) {
            throw new org.springframework.security.access.AccessDeniedException("You are not authorized to delete this ticket");
        }
        ticketRepository.deleteById(id);
    }

    @Override
    public void updateTicket(Long id, TicketDTO dto, Authentication authentication){
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Ticket not found"));

        String currentUserEmail = authentication.getName();
        Agent assignedAgent = ticket.getAgent();
        if (assignedAgent == null || !assignedAgent.getUser().getEmail().equals(currentUserEmail)) {
            throw new org.springframework.security.access.AccessDeniedException("You are not authorized to update this ticket");
        }
        Ticket.Status oldStatus = ticket.getStatus();
        Ticket.Status newStatus = dto.getStatus();

        if (oldStatus == Ticket.Status.CLOSED) {
            throw new IllegalStateException("Cannot update a closed ticket.");
        }

        if ((newStatus == Ticket.Status.RESOLVED) &&
                (oldStatus != Ticket.Status.RESOLVED && oldStatus != Ticket.Status.CLOSED) &&
                ticket.getAgent() != null) {
            Agent agent = ticket.getAgent();
            int workloadDecrement = getPriorityWeight(ticket.getPriority());
            agent.setCurrentWorkload(Math.max(0, agent.getCurrentWorkload() - workloadDecrement));
            agentRepository.save(agent);

            assignQueuedTickets();
        }

        ticket.setStatus(newStatus);
        ticket.setUpdatedAt(LocalDateTime.now());
        if (newStatus == Ticket.Status.RESOLVED) {
            ticket.setResolvedAt(LocalDateTime.now());
        }
        ticketRepository.save(ticket);

        String statusMsg = "Ticket status updated to " + ticket.getStatus();
        emailService.sendHtmlEmail(ticket.getClient().getEmail(),
                "Status Update on Ticket #" + ticket.getId(),
                "<p>" + statusMsg + "<p>");
        if(ticket.getAgent() != null) {
            emailService.sendHtmlEmail(ticket.getAgent().getUser().getEmail(),
                    "Ticket #" + ticket.getId() + " Status Update",
                    "<p>" + statusMsg + "</p>");
        }
    }

    @Override
    public Optional<TicketDTO> getTicketById(Long id){
        return ticketRepository.findById(id)
                .map(TicketMapper::toDTO);
    }

    @Override
    public Optional<Ticket> getTicketEntityById(Long id) {
        return ticketRepository.findById(id);
    }

    @Override
    public List<TicketDTO> getTicketByClient(User client){
        return ticketRepository.findByClient(client)
                .stream()
                .map(TicketMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<TicketDTO> getTicketByAgent(Agent agent){
        return ticketRepository.findByAgent(agent)
                .stream()
                .map(TicketMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<TicketDTO> getTicketByTitle(String title){
        return ticketRepository.findByTitle(title)
                .stream()
                .map(TicketMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<TicketDTO> getTicketByCreationDate(LocalDateTime date){
        return ticketRepository.findByCreatedAt(date)
                .stream()
                .map(TicketMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<TicketDTO> getTicketByResolutionDate(LocalDateTime date){
        return ticketRepository.findByResolvedAt(date)
                .stream()
                .map(TicketMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<TicketDTO> getTicketByStatus(Ticket.Status status){
        return ticketRepository.findByStatus(status)
                .stream()
                .map(TicketMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<TicketDTO> getTicketByCategory(Ticket.Category category){
        return ticketRepository.findByCategory(category)
                .stream()
                .map(TicketMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<TicketDTO> getTicketByDescription(String description){
        return ticketRepository.findByDescription(description)
                .stream()
                .map(TicketMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<TicketDTO> getAll(){
        return ticketRepository.findAll()
                .stream()
                .map(TicketMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public double getAverageResolutionTimeHours() {
        List<Ticket> resolvedTickets = ticketRepository.findByStatus(Ticket.Status.RESOLVED);
        return resolvedTickets.stream()
                .filter(t -> t.getCreatedAt() != null && t.getResolvedAt() != null)
                .mapToDouble(t -> Duration.between(t.getCreatedAt(), t.getResolvedAt()).toMinutes() / 60.0)
                .average()
                .orElse(0.0);
    }

    @Override
    public long getTotalTicketsCreated() {
        return ticketRepository.count();
    }

    @Override
    public long getTotalTicketsResolved() {
        return ticketRepository.findByStatus(Ticket.Status.RESOLVED).size();
    }

    @Override
    public Map<Ticket.Status, Long> getTicketCountByStatus() {
        return ticketRepository.findAll().stream()
                .collect(Collectors.groupingBy(Ticket::getStatus, Collectors.counting()));
    }

    @Override
    public Map<Long, Double> getAverageResolutionTimePerAgent() {
        List<Ticket> resolvedTickets = ticketRepository.findByStatus(Ticket.Status.RESOLVED);
        return resolvedTickets.stream()
                .filter(t -> t.getAgent() != null && t.getCreatedAt() != null && t.getResolvedAt() != null)
                .collect(Collectors.groupingBy(
                        t -> t.getAgent().getUserId(),
                        Collectors.averagingDouble(t -> Duration.between(t.getCreatedAt(), t.getResolvedAt()).toMinutes() / 60.0)
                ));
    }

    @Override
    public void rateAgent(Long ticketId, int rating, Authentication authentication){
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new EntityNotFoundException("Ticket not found"));
        Agent agent = ticket.getAgent();

        if (!ticket.getStatus().equals(Ticket.Status.RESOLVED)){
            throw new IllegalArgumentException("Ticket cannot be rated yet");
        }

        String currentUserEmail = authentication.getName();
        if (!ticket.getClient().getEmail().equals(currentUserEmail)) {
            throw new org.springframework.security.access.AccessDeniedException("Only the ticket owner can rate the agent");
        }

        if (agent == null) throw new IllegalStateException("No agent assigned to this ticket");
        if (ticket.getRating() != null) throw new IllegalStateException("Ticket already rated");
        if (rating < 1 || rating > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }

        ticket.setStatus(Ticket.Status.CLOSED);

        ticket.setRating(rating);
        ticketRepository.save(ticket);

        agent.addRating(rating);
        agentRepository.save(agent);
    }
}
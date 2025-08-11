package com.sts.Etickette.service;

import com.sts.Etickette.DTO.TicketDTO;
import com.sts.Etickette.entity.Agent;
import com.sts.Etickette.entity.Ticket;
import com.sts.Etickette.entity.User;
import org.springframework.security.core.Authentication;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface TicketService {
    TicketDTO createTicket(TicketDTO dto);
    void updateTicket(Long id, TicketDTO dto, Authentication authentication);
    void deleteTicket(Long id, Authentication authentication);
    List<TicketDTO> getTicketByClient(User client);
    List<TicketDTO> getTicketByAgent(Agent agent);
    List<TicketDTO> getTicketByTitle(String title);
    List<TicketDTO> getTicketByStatus(Ticket.Status status);
    List<TicketDTO> getTicketByCategory(Ticket.Category category);
    List<TicketDTO> getTicketByDescription(String description);
    Optional<TicketDTO> getTicketById(Long id);
    Optional<Ticket> getTicketEntityById(Long id);
    List<TicketDTO> getTicketByCreationDate(LocalDateTime date);
    List<TicketDTO> getTicketByResolutionDate(LocalDateTime date);
    List<TicketDTO> getAll();
    double getAverageResolutionTimeHours();
    double getAverageRatings();
    long getTotalTicketsCreated();
    long getTotalTicketsResolved();
    Map<Ticket.Status, Long> getTicketCountByStatus();
    Map<Ticket.Category, Long> getTicketCountByCategory();
    Map<Ticket.Priority, Long> getTicketCountByPriority();
    Map<Long, Double> getAverageResolutionTimePerAgent();
    Map<Long, Long> getResolvedTicketCountPerAgent();
    void rateAgent(Long ticketId, int rating, Authentication authentication);
    List<TicketDTO> searchTickets(String title,
                                  User client,
                                  Ticket.Status status,
                                  Agent agent,
                                  String description,
                                  LocalDateTime createdAt,
                                  String categoryPart);
}

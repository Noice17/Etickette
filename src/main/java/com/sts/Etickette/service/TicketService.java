package com.sts.Etickette.service;

import com.sts.Etickette.DTO.TicketDTO;
import com.sts.Etickette.entity.Ticket;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface TicketService {
    TicketDTO createTicket(TicketDTO dto);
    void updateTicket(Long id, TicketDTO dto);
    void deleteTicket(Long id);
    List<TicketDTO> getTicketByClient(Long client);
    List<TicketDTO> getTicketByAgent(Long agent);
    List<TicketDTO> getTicketByTitle(String title);
    List<TicketDTO> getTicketByStatus(Ticket.Status status);
    List<TicketDTO> getTicketByCategory(Ticket.Category category);
    Optional<TicketDTO> getTicketById(Long id);
    List<TicketDTO> getTicketByCreationDate(LocalDateTime date);
    List<TicketDTO> getTicketByResolutionDate(LocalDateTime date);
}

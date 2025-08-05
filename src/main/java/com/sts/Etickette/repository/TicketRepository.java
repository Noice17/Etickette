package com.sts.Etickette.repository;

import com.sts.Etickette.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByCreatedAt(LocalDateTime createdAt);
    List<Ticket> findByResolvedAt(LocalDateTime resolvedAt);
    List<Ticket> findByStatus(Ticket.Status status);
    List<Ticket> findByCategory(Ticket.Category category);
    List<Ticket> findByClient(Long client);
    List<Ticket> findByAgent(Long agentId);
    List<Ticket> findByTitle(String title);
    List<Ticket> findByDescription(String description);
}

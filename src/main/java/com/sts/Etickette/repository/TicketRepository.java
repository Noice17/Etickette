package com.sts.Etickette.repository;

import com.sts.Etickette.entity.Agent;
import com.sts.Etickette.entity.Ticket;
import com.sts.Etickette.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByCreatedAt(LocalDateTime createdAt);
    List<Ticket> findByResolvedAt(LocalDateTime resolvedAt);
    List<Ticket> findByStatus(Ticket.Status status);
    List<Ticket> findByCategory(Ticket.Category category);
    List<Ticket> findByClient(User client);
    List<Ticket> findByAgent(Agent agent);
    List<Ticket> findByTitle(String title);
    List<Ticket> findByDescription(String description);
    List<Ticket> findByStatusIn(List<Ticket.Status> statuses);
}

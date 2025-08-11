package com.sts.Etickette.repository;

import com.sts.Etickette.entity.Agent;
import com.sts.Etickette.entity.Ticket;
import com.sts.Etickette.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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
    @Query("""
        SELECT t FROM Ticket t
        WHERE t.title = :title
          AND t.client = :client
          AND t.status = :status
          AND t.agent = :agent
          AND t.description = :description
          AND t.createdAt = :createdAt
          AND LOWER(CAST(t.category AS string)) LIKE LOWER(CONCAT('%', :categoryPart, '%'))
    """)
    List<Ticket> findByTitleAndClientAndStatusAndAgentAndDescriptionAndCreatedAtAndCategoryContainingIgnoreCase(
            @Param("title") String title,
            @Param("client") User client,
            @Param("status") Ticket.Status status,
            @Param("agent") Agent agent,
            @Param("description") String description,
            @Param("createdAt") LocalDateTime createdAt,
            @Param("categoryPart") String categoryPart
    );
}

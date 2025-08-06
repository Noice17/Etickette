package com.sts.Etickette.repository;

import com.sts.Etickette.entity.Comment;
import com.sts.Etickette.entity.Ticket;
import com.sts.Etickette.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByCreatedAt(LocalDateTime createdAt);
    List<Comment> findByMessage(String message);
    List<Comment> findByTicket(Ticket ticket);
    List<Comment> findByUser(User user);
}

package com.sts.Etickette.repository;

import com.sts.Etickette.entity.Message;
import com.sts.Etickette.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByTicketOrderBySentAtAsc(Ticket ticket);
}

package com.sts.Etickette.security;

import com.sts.Etickette.entity.Ticket;
import com.sts.Etickette.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service("ticketSecurity")
public class TicketSecurity {

    @Autowired
    private TicketRepository ticketRepository;

    public boolean isOwner(Long ticketId, Authentication authentication) {
        Ticket ticket = ticketRepository.findById(ticketId).orElse(null);
        if (ticket == null) return false;

        String username = authentication.getName();

        return ticket.getClient() != null && username.equals(ticket.getClient().getEmail());
    }
}

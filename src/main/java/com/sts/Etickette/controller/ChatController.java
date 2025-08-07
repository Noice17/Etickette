package com.sts.Etickette.controller;

import com.sts.Etickette.DTO.MessageDTO;
import com.sts.Etickette.entity.Message;
import com.sts.Etickette.entity.Ticket;
import com.sts.Etickette.entity.User;
import com.sts.Etickette.mapper.MessageMapper;
import com.sts.Etickette.repository.MessageRepository;
import com.sts.Etickette.repository.TicketRepository;
import com.sts.Etickette.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.time.LocalDateTime;

@Controller
public class ChatController {
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private UserRepository userRepository;

    public void sendMessage(@DestinationVariable Long ticketId, MessageDTO messageDTO, Principal principal) {
        String userEmail = principal.getName();
        User sender = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!(ticket.getClient().getId().equals(sender.getId()) || ticket.getAgent() != null && ticket.getAgent().getUser().getId().equals(sender.getId()))) {
            throw new org.springframework.security.access.AccessDeniedException("You are not authorized to participate in this chat.");
        }

        Message message = new Message();
        message.setTicket(ticket);
        message.setSender(sender);
        message.setContent(messageDTO.getContent());
        message.setSentAt(LocalDateTime.now());
        messageRepository.save(message);

        messagingTemplate.convertAndSend("/topic/chat/" + ticketId, MessageMapper.toDTO(message));
    }

    @MessageMapping("/chat/{ticketId}/read")
    public void readMessage(@DestinationVariable Long ticketId, @Payload MessageDTO messageDTO, Principal principal) {
        String userEmail = principal.getName();
        User sender = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!(ticket.getClient().getId().equals(sender.getId()) || ticket.getAgent() != null && ticket.getAgent().getUser().getId().equals(sender.getId()))) {
            throw new org.springframework.security.access.AccessDeniedException("You are not authorized to participate in this chat.");
        }

        Message message = messageRepository.findById(messageDTO.getId()).orElseThrow();
        message.setReadAt(LocalDateTime.now());
        messageRepository.save(message);

        messagingTemplate.convertAndSend("/topic/chat/" + ticketId + "/read-receipt", MessageMapper.toDTO(message));
    }
}

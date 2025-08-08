package com.sts.Etickette.service.implementation;

import com.sts.Etickette.DTO.CommentDTO;
import com.sts.Etickette.entity.Agent;
import com.sts.Etickette.entity.Comment;
import com.sts.Etickette.entity.Ticket;
import com.sts.Etickette.entity.User;
import com.sts.Etickette.mapper.CommentMapper;
import com.sts.Etickette.repository.CommentRepository;
import com.sts.Etickette.service.CommentService;
import com.sts.Etickette.service.EmailService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentServiceImpl implements CommentService {
    private final CommentRepository commentRepository;
    private final EmailService emailService;

    public CommentServiceImpl(CommentRepository commentRepository, EmailService emailService) {
        this.commentRepository = commentRepository;
        this.emailService = emailService;
    }

    @Override
    public CommentDTO createComment(CommentDTO dto){
        Comment comment = CommentMapper.toEntity(dto);
        comment.setCreatedAt(LocalDateTime.now());
        Ticket ticket = comment.getTicket();
        User commenter = comment.getUser();
        User client = ticket.getClient();
        Agent agent = ticket.getAgent();
        User agentUser = agent != null ? agent.getUser() : null;

        if (agentUser != null && !commenter.getId().equals(agentUser.getId())){
            emailService.sendHtmlEmail(agentUser.getEmail(),
                    "New comment on Ticket #" + ticket.getId(),
                    "<p>Client commented: " + comment.getMessage() + "</p>");
        }

        if (!commenter.getId().equals(client.getId())) {
            emailService.sendHtmlEmail(client.getEmail(),
                    "New comment on Ticket #" + ticket.getId(),
                    "<p>Agent commented: " + comment.getMessage() + "</p>");
        }

        Comment saved = commentRepository.save(comment);

        return CommentMapper.toDTO(saved);
    }

    @Override
    public List<CommentDTO> getCommentsByTicket(Ticket ticket){
        return commentRepository.findByTicketOrderByCreatedAtAsc(ticket)
                .stream()
                .map(CommentMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<CommentDTO> getCommentsByUser(User user){
        return commentRepository.findByUser(user)
                .stream()
                .map(CommentMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<CommentDTO> getCommentsByMessage(String message){
        return commentRepository.findByMessage(message)
                .stream()
                .map(CommentMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<CommentDTO> getCommentsByCreationDate(LocalDateTime date){
        return commentRepository.findByCreatedAt(date)
                .stream()
                .map(CommentMapper::toDTO)
                .collect(Collectors.toList());
    }
}

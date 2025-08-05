package com.sts.Etickette.service;

import com.sts.Etickette.DTO.CommentDTO;
import com.sts.Etickette.entity.Ticket;

import java.time.LocalDateTime;
import java.util.List;

public interface CommentService {
    CommentDTO createComment(CommentDTO dto);
    List<CommentDTO> getCommentsByTicket(Ticket ticket);
    List<CommentDTO> getCommentsByUser(Long user);
    List<CommentDTO> getCommentsByMessage(String message);
    List<CommentDTO> getCommentsByCreationDate(LocalDateTime date);
}

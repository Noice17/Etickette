package com.sts.Etickette.service.implementation;

import com.sts.Etickette.DTO.CommentDTO;
import com.sts.Etickette.entity.Comment;
import com.sts.Etickette.entity.Ticket;
import com.sts.Etickette.entity.User;
import com.sts.Etickette.mapper.CommentMapper;
import com.sts.Etickette.repository.CommentRepository;
import com.sts.Etickette.service.CommentService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentServiceImpl implements CommentService {
    private final CommentRepository commentRepository;

    public CommentServiceImpl(CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    @Override
    public CommentDTO createComment(CommentDTO dto){
        Comment comment = CommentMapper.toEntity(dto);
        comment.setCreatedAt(LocalDateTime.now());
        Comment saved = commentRepository.save(comment);
        return CommentMapper.toDTO(saved);
    }

    @Override
    public List<CommentDTO> getCommentsByTicket(Ticket ticket){
        return commentRepository.findByTicket(ticket)
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

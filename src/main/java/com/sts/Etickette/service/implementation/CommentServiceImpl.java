package com.sts.Etickette.service.implementation;

import com.sts.Etickette.DTO.CommentDTO;
import com.sts.Etickette.entity.Comment;
import com.sts.Etickette.entity.Ticket;
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
    private final CommentMapper commentMapper;

    public CommentServiceImpl(CommentRepository commentRepository, CommentMapper commentMapper) {
        this.commentRepository = commentRepository;
        this.commentMapper = commentMapper;
    }

    @Override
    public CommentDTO createComment(CommentDTO dto){
        Comment comment = commentMapper.toEntity(dto);
        comment.setCreatedAt(LocalDateTime.now());
        Comment saved = commentRepository.save(comment);
        return commentMapper.toDTO(saved);
    }

    @Override
    public List<CommentDTO> getCommentsByTicket(Ticket ticket){
        return commentRepository.findByTicket(ticket)
                .stream()
                .map(commentMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<CommentDTO> getCommentsByUser(Long user){
        return commentRepository.findByUser(user)
                .stream()
                .map(commentMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<CommentDTO> getCommentsByMessage(String message){
        return commentRepository.findByMessage(message)
                .stream()
                .map(commentMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<CommentDTO> getCommentsByCreationDate(LocalDateTime date){
        return commentRepository.findByCreatedAt(date)
                .stream()
                .map(commentMapper::toDTO)
                .collect(Collectors.toList());
    }
}

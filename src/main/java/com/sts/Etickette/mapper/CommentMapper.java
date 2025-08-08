package com.sts.Etickette.mapper;

import com.sts.Etickette.DTO.CommentDTO;
import com.sts.Etickette.entity.Comment;

public class CommentMapper {

    public static CommentDTO toDTO(Comment comment) {
        if (comment == null) return null;
        CommentDTO dto = new CommentDTO();
        dto.setId(comment.getId());
        dto.setMessage(comment.getMessage());
        dto.setCreatedAt(comment.getCreatedAt());
        dto.setTicket(comment.getTicket());
        dto.setUser(comment.getUser());
        return dto;
    }

    public static Comment toEntity(CommentDTO dto) {
        if (dto == null) return null;
        Comment comment = new Comment();
        comment.setId(dto.getId());
        comment.setMessage(dto.getMessage());
        comment.setCreatedAt(dto.getCreatedAt());
        comment.setTicket(dto.getTicket());
        comment.setUser(dto.getUser());
        return comment;
    }
}
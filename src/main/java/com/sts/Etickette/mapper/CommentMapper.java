package com.sts.Etickette.mapper;

import com.sts.Etickette.DTO.CommentDTO;
import com.sts.Etickette.entity.Comment;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface CommentMapper {
    CommentMapper INSTANCE = Mappers.getMapper(CommentMapper.class);

    CommentDTO toDTO(Comment comment);
    Comment toEntity(CommentDTO commentDTO);
}

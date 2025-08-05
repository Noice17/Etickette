package com.sts.Etickette.mapper;

import com.sts.Etickette.DTO.TicketDTO;
import com.sts.Etickette.entity.Ticket;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface TicketMapper {
    TicketMapper INSTANCE = Mappers.getMapper(TicketMapper.class);

    TicketDTO toDTO(Ticket ticket);
    Ticket toEntity(TicketDTO dto);
}

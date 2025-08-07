package com.sts.Etickette.mapper;

import com.sts.Etickette.DTO.TicketDTO;
import com.sts.Etickette.entity.Ticket;

public class TicketMapper {

    public static TicketDTO toDTO(Ticket ticket) {
        if (ticket == null) return null;
        TicketDTO dto = new TicketDTO();
        dto.setId(ticket.getId());
        dto.setTitle(ticket.getTitle());
        dto.setDescription(ticket.getDescription());
        dto.setStatus(ticket.getStatus());
        dto.setPriority(ticket.getPriority());
        dto.setCategory(ticket.getCategory());
        dto.setCreatedAt(ticket.getCreatedAt());
        dto.setUpdatedAt(ticket.getUpdatedAt());
        dto.setResolvedAt(ticket.getResolvedAt());
        dto.setRating(ticket.getRating());
        dto.setClient(ticket.getClient());
        dto.setAgent(ticket.getAgent());
        return dto;
    }

    public static Ticket toEntity(TicketDTO dto) {
        if (dto == null) return null;
        Ticket ticket = new Ticket();
        ticket.setId(dto.getId());
        ticket.setTitle(dto.getTitle());
        ticket.setDescription(dto.getDescription());
        ticket.setStatus(dto.getStatus());
        ticket.setPriority(dto.getPriority());
        ticket.setCategory(dto.getCategory());
        ticket.setCreatedAt(dto.getCreatedAt());
        ticket.setUpdatedAt(dto.getUpdatedAt());
        ticket.setResolvedAt(dto.getResolvedAt());
        ticket.setRating(dto.getRating());
        ticket.setClient(dto.getClient());
        ticket.setAgent(dto.getAgent());
        return ticket;
    }
}
package com.sts.Etickette.mapper;

import com.sts.Etickette.DTO.MessageDTO;
import com.sts.Etickette.entity.Message;

public class MessageMapper {
    public static MessageDTO toDTO(Message message) {
        if (message == null) return null;
        MessageDTO dto = new MessageDTO();
        dto.setId(message.getId());
        dto.setTicketId(message.getTicket().getId());
        dto.setSenderId(message.getSender().getId());
        dto.setContent(message.getContent());
        dto.setSentAt(message.getSentAt());
        dto.setReadAt(message.getReadAt());
        dto.setSenderId(message.getId());
        return dto;
    }
}
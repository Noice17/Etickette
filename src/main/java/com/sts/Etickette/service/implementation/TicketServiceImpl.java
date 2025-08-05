package com.sts.Etickette.service.implementation;

import com.sts.Etickette.DTO.TicketDTO;
import com.sts.Etickette.entity.Ticket;
import com.sts.Etickette.mapper.TicketMapper;
import com.sts.Etickette.repository.TicketRepository;
import com.sts.Etickette.service.TicketService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TicketServiceImpl implements TicketService {
    private final TicketRepository ticketRepository;
    private final TicketMapper ticketMapper;

    public TicketServiceImpl(TicketRepository ticketRepository, TicketMapper ticketMapper) {
        this.ticketRepository = ticketRepository;
        this.ticketMapper = ticketMapper;
    }

    @Override
    public TicketDTO createTicket(TicketDTO dto){
        Ticket ticket = ticketMapper.toEntity(dto);
        Ticket savedTicket = ticketRepository.save(ticket);
        return ticketMapper.toDTO(savedTicket);
    }

    @Override
    public void deleteTicket(Long id){
        ticketRepository.deleteById(id);
    }

    @Override
    public void updateTicket(Long id, TicketDTO dto){
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Ticket not found"));
        ticket.setStatus(Ticket.Status.valueOf(dto.getStatus()));
    }

    @Override
    public Optional<TicketDTO> getTicketById(Long id){
        return ticketRepository.findById(id)
                .map(ticketMapper::toDTO);
    }

    @Override
    public List<TicketDTO> getTicketByTitle(String title){
        return ticketRepository.findByTitle(title)
                .stream()
                .map(ticketMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<TicketDTO> getTicketByCreationDate(LocalDateTime date){
        return ticketRepository.findByCreatedAt(date)
                .stream()
                .map(ticketMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<TicketDTO> getTicketByResolutionDate(LocalDateTime date){
        return ticketRepository.findByResolvedAt(date)
                .stream()
                .map(ticketMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<TicketDTO> getTicketByStatus(Ticket.Status status){
        return ticketRepository.findByStatus(status)
                .stream()
                .map(ticketMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<TicketDTO> getTicketByStatus(Ticket.Category category){
        return ticketRepository.findByCategory(category)
                .stream()
                .map(ticketMapper::toDTO)
                .collect(Collectors.toList());
    }
}

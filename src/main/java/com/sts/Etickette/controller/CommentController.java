package com.sts.Etickette.controller;

import com.sts.Etickette.DTO.CommentDTO;
import com.sts.Etickette.entity.Ticket;
import com.sts.Etickette.entity.User;
import com.sts.Etickette.repository.UserRepository;
import com.sts.Etickette.service.CommentService;
import com.sts.Etickette.service.TicketService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/comments")
public class CommentController {
    private final CommentService commentService;
    private final TicketService ticketService;
    private final UserRepository userRepository;

    public CommentController(CommentService commentService, TicketService ticketService, UserRepository userRepository) {
        this.commentService = commentService;
        this.ticketService = ticketService;
        this.userRepository = userRepository;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('CLIENT', 'AGENT')")
    public ResponseEntity<CommentDTO> createComment(@Valid @RequestBody CommentDTO dto){
        CommentDTO newComment = commentService.createComment(dto);
        return ResponseEntity.ok(newComment);
    }

    @GetMapping("/ticket/{ticketId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<CommentDTO>> getCommentsByTicket(@PathVariable Long ticketId) {
        Optional<Ticket> ticketOpt = ticketService.getTicketEntityById(ticketId);
        if (ticketOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        List<CommentDTO> comments = commentService.getCommentsByTicket(ticketOpt.get());
        return ResponseEntity.ok(comments);
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<CommentDTO>> getCommentsByUser(@PathVariable Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        List<CommentDTO> comments = commentService.getCommentsByUser(userOpt.get());
        return ResponseEntity.ok(comments);
    }

    @GetMapping("/message/{message}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<CommentDTO>> getCommentsByMessage(@PathVariable String message) {
        List<CommentDTO> comments = commentService.getCommentsByMessage(message);
        return ResponseEntity.ok(comments);
    }

    @GetMapping("/createdAt")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<CommentDTO>> getCommentsByCreationDate(@RequestParam String dateTime) {
        LocalDateTime date = LocalDateTime.parse(dateTime);
        List<CommentDTO> comments = commentService.getCommentsByCreationDate(date);
        return ResponseEntity.ok(comments);
    }
}
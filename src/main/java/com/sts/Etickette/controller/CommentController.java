package com.sts.Etickette.controller;

import com.sts.Etickette.DTO.CommentDTO;
import com.sts.Etickette.entity.Ticket;
import com.sts.Etickette.service.CommentService;
import com.sts.Etickette.service.TicketService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {
    private final CommentService commentService;
    private final TicketService ticketService;

    public CommentController(CommentService commentService, TicketService ticketService) {
        this.commentService = commentService;
        this.ticketService = ticketService;
    }

    @PostMapping
    public ResponseEntity<CommentDTO> createComment(@RequestBody CommentDTO dto){
        CommentDTO newComment = commentService.createComment(dto);
        return ResponseEntity.ok(newComment);
    }

    @GetMapping("/ticket/{ticketId}")
    public ResponseEntity<List<CommentDTO>> getCommentsByTicket(@PathVariable Long ticketId) {
        // For now, create a Ticket object with only id set, since Ticket service is not available yet
        Ticket ticket = new Ticket();
        ticket.setId(ticketId);
        List<CommentDTO> comments = commentService.getCommentsByTicket(ticket);
        return ResponseEntity.ok(comments);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CommentDTO>> getCommentsByUser(@PathVariable Long userId) {
        List<CommentDTO> comments = commentService.getCommentsByUser(userId);
        return ResponseEntity.ok(comments);
    }

    @GetMapping("/message/{message}")
    public ResponseEntity<List<CommentDTO>> getCommentsByMessage(@PathVariable String message) {
        List<CommentDTO> comments = commentService.getCommentsByMessage(message);
        return ResponseEntity.ok(comments);
    }

    @GetMapping("/createdAt")
    public ResponseEntity<List<CommentDTO>> getCommentsByCreationDate(@RequestParam String dateTime) {
        LocalDateTime date = LocalDateTime.parse(dateTime);
        List<CommentDTO> comments = commentService.getCommentsByCreationDate(date);
        return ResponseEntity.ok(comments);
    }
}

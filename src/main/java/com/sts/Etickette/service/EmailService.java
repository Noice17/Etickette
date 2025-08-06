package com.sts.Etickette.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender emailSender;

    @Autowired
    public EmailService(JavaMailSender emailSender) {
        this.emailSender = emailSender;
    }

    public void sendHtmlEmail(String to, String subject, String htmlContent) {
        try {
            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true); // true = multipart

            helper.setFrom("your_email@gmail.com"); // must match spring.mail.username
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true); // true = enable HTML

            emailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email: " + e.getMessage());
        }
    }

//    public Ticket updateTicket(Long id, TicketDTO dto) {
//        Ticket ticket = ticketRepository.findById(id).orElseThrow(...);
//        ticket.setStatus(dto.getStatus());
//    ...
//        Ticket updated = ticketRepository.save(ticket);
//
//        emailService.sendTicketUpdateEmail(updated);  // <- Email sent here
//
//        return updated;
//    }
}

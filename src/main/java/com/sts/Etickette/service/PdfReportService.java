package com.sts.Etickette.service;

import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import com.sts.Etickette.entity.Agent;
import com.sts.Etickette.entity.Ticket;
import com.sts.Etickette.repository.AgentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.Map;

import static com.lowagie.text.FontFactory.*;

@Service
public class PdfReportService {
    private final TicketService ticketService;
    private final AgentRepository agentRepository;

    @Autowired
    public PdfReportService(TicketService ticketService, AgentRepository agentRepository) {
        this.ticketService = ticketService;
        this.agentRepository = agentRepository;
    }

    public byte[] generateMetricsReport() {
        Document document = new Document(PageSize.A4);
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            Font titleFont = getFont(HELVETICA_BOLD, 18);
            Paragraph title = new Paragraph("Ticket Metrics Report", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            document.add(Chunk.NEWLINE);

            Font labelFont = getFont(HELVETICA_BOLD, 12);
            Font valueFont = getFont(HELVETICA, 12);

            document.add(new Paragraph("Average Resolution Time (hours): ", labelFont));
            document.add(new Paragraph(String.format("%.2f", ticketService.getAverageResolutionTimeHours()), valueFont));
            document.add(Chunk.NEWLINE);

            document.add(new Paragraph("Total Tickets Created: ", labelFont));
            document.add(new Paragraph(String.valueOf(ticketService.getTotalTicketsCreated()), valueFont));
            document.add(Chunk.NEWLINE);

            document.add(new Paragraph("Total Tickets Resolved: ", labelFont));
            document.add(new Paragraph(String.valueOf(ticketService.getTotalTicketsResolved()), valueFont));
            document.add(Chunk.NEWLINE);

            document.add(new Paragraph("Ticket Count by Status:", labelFont));
            PdfPTable statusTable = new PdfPTable(2);
            statusTable.setWidthPercentage(50);
            statusTable.addCell("Status");
            statusTable.addCell("Count");
            for (Map.Entry<Ticket.Status, Long> entry : ticketService.getTicketCountByStatus().entrySet()) {
                statusTable.addCell(entry.getKey().toString());
                statusTable.addCell(String.valueOf(entry.getValue()));
            }
            document.add(statusTable);
            document.add(Chunk.NEWLINE);

            document.add(new Paragraph("Average Resolution Time Per Agent (hours):", labelFont));
            PdfPTable agentTable = new PdfPTable(2);
            agentTable.setWidthPercentage(80);
            agentTable.addCell("Agent ID");
            agentTable.addCell("Avg Resolution Time");
            for (Map.Entry<Long, Double> entry : ticketService.getAverageResolutionTimePerAgent().entrySet()) {
                agentTable.addCell(String.valueOf(entry.getKey()));
                agentTable.addCell(String.format("%.2f", entry.getValue()));
            }
            document.add(agentTable);
            document.add(Chunk.NEWLINE);

            document.add(new Paragraph("Average Agent Ratings:", labelFont));
            PdfPTable ratingTable = new PdfPTable(3);
            ratingTable.setWidthPercentage(100);
            ratingTable.addCell("Agent ID");
            ratingTable.addCell("Agent Name");
            ratingTable.addCell("Average Rating");
            for (Agent agent : agentRepository.findAll()) {
                ratingTable.addCell(String.valueOf(agent.getUserId()));
                ratingTable.addCell(agent.getUser().getUsername());
                ratingTable.addCell(String.format("%.2f", agent.getAverageRating()));
            }
            document.add(ratingTable);

            document.close();

        } catch (Exception ex) {
            throw new RuntimeException("Error generating PDF", ex);
        }

        return out.toByteArray();
    }
}

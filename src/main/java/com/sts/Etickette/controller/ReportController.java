package com.sts.Etickette.controller;

import com.sts.Etickette.service.PdfReportService;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@PreAuthorize("hasRole('ADMIN')")
@RestController
@RequestMapping("/api/reports")
public class ReportController {
    private final PdfReportService pdfReportService;

    public ReportController(PdfReportService pdfReportService) {
        this.pdfReportService = pdfReportService;
    }

    @GetMapping("/metrics")
    public ResponseEntity<byte[]> getTicketsReport() {
        byte[] pdf = pdfReportService.generateMetricsReport();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
//        headers.setContentDispositionFormData("attachment", "tickets_report.pdf");
        headers.setContentDisposition(ContentDisposition.inline().filename("tickets_report.pdf").build());

        return ResponseEntity.ok()
                .headers(headers)
                .body(pdf);
    }
}
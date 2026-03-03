package com.fresherjobs.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.*;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class EmailService {

    @Value("${spring.brevo.api.url}")
    private String brevoApiUrl;

    @Value("${spring.brevo.api.key}")
    private String apiKey;

    @Value("${spring.brevo.sender.email}")
    private String fromEmail;

    @Value("${spring.brevo.sender.name}")
    private String fromName;

    @Value("${fronted.url}")
    private String frontedUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    // Send a plain text email asynchronously.
    @Async
    public void sendEmail(String to, String subject, String body) {
        try {
            Map<String, Object> payload = Map.of(
                    "sender", Map.of("name", fromName, "email", fromEmail),
                    "to", List.of(Map.of("email", to)),
                    "subject", subject,
                    "textContent", body);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("api-key", apiKey);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);
            restTemplate.postForEntity(brevoApiUrl, request, String.class);

            log.info("Email sent to {} — Subject: {}", to, subject);
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
        }
    }

    // Send a styled HTML email using a template file (async — non-blocking).
    @Async
    public void sendHtmlEmail(String to, String subject, String templateName, Map<String, String> variables) {
        try {
            String html = loadTemplate(templateName);

            // Replace all {{key}} placeholders
            for (Map.Entry<String, String> entry : variables.entrySet()) {
                html = html.replace("{{" + entry.getKey() + "}}", entry.getValue());
            }

            // Always inject site URL
            html = html.replace("{{siteUrl}}", frontedUrl);

            Map<String, Object> payload = Map.of(
                    "sender", Map.of("name", fromName, "email", fromEmail),
                    "to", List.of(Map.of("email", to)),
                    "subject", subject,
                    "htmlContent", html);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("api-key", apiKey);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);
            restTemplate.postForEntity(brevoApiUrl, request, String.class);

            log.info("HTML email sent to {} — Subject: {} — Template: {}", to, subject, templateName);
        } catch (Exception e) {
            log.error("Failed to send HTML email to {}: {}", to, e.getMessage());
        }
    }

    // Load an HTML template file from classpath: resources/templates/{name}.html
    private String loadTemplate(String templateName) throws IOException {
        ClassPathResource resource = new ClassPathResource("templates/" + templateName + ".html");
        return new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
    }
}

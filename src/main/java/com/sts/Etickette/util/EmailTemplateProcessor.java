package com.sts.Etickette.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.apache.commons.text.StringSubstitutor;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.Scanner;

@Component
public class EmailTemplateProcessor {

    @Autowired
    private ResourceLoader resourceLoader;

    public String processTemplate(String templatePath, Map<String, String> placeholders) throws Exception {
        Resource resource = resourceLoader.getResource(templatePath);
        String content;

        try (Scanner scanner = new Scanner(resource.getInputStream(), StandardCharsets.UTF_8.name())) {
            content = scanner.useDelimiter("\\A").next();
        }

        return StringSubstitutor.replace(content, placeholders);
    }
}

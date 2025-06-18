package com.harkins.startYourEngine.service;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Slf4j
@Service
public class FileStorageService {
    private final Path uploadDir = Paths.get("uploads");

    @PostConstruct
    public void init() throws IOException {
        Files.createDirectories(uploadDir);
    }

    public String uploadFile(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = uploadDir.resolve(fileName);
        Files.write(filePath, file.getBytes());
        String imageUrl = "/uploads/" + fileName;
        log.info("Generated image URL: {}", imageUrl);
        return imageUrl;
    }
}

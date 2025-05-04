package com.harkins.startYourEngine.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.ai.document.Document;
import org.springframework.ai.reader.tika.TikaDocumentReader;
import org.springframework.ai.transformer.splitter.TextSplitter;
import org.springframework.ai.transformer.splitter.TokenTextSplitter;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.Resource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Service
public class DocumentIngestionService implements CommandLineRunner {

    @Value("classpath:/pdf/*.pdf")
    Resource[] resources;
    final VectorStore vectorStore;
    final JdbcTemplate jdbcTemplate;

    // Tên bảng để lưu trữ thông tin về các file đã xử lý
    private static final String PROCESSED_FILES_TABLE = "processed_pdf_files";

    @Override
    public void run(String... args) throws Exception {
        System.out.println("Kiểm tra và tạo bảng lưu trữ thông tin file đã xử lý...");
        createProcessedFilesTableIfNotExists();

        // Lấy danh sách các file đã xử lý
        Set<String> processedFiles = getProcessedFiles();
        List<Resource> newResources = new ArrayList<>();

        // Kiểm tra xem có file mới nào cần xử lý không
        for (Resource resource : resources) {
            String filename = resource.getFilename();
            if (!processedFiles.contains(filename)) {
                newResources.add(resource);
            }
        }

        if (newResources.isEmpty()) {
            System.out.println("Không có file PDF mới cần xử lý.");
            return;
        }

        System.out.println("Đang xử lý " + newResources.size() + " file PDF mới...");

        List<Document> allDocuments = new ArrayList<>();
        TextSplitter textSplitter = new TokenTextSplitter();

        for (Resource resource : newResources) {
            String filename = resource.getFilename();
            System.out.println("Đọc file: " + filename);

            try {
                TikaDocumentReader tikaDocumentReader = new TikaDocumentReader(resource);
                List<Document> documents = textSplitter.split(tikaDocumentReader.read());

                // Thêm metadata cho mỗi document để biết nó thuộc file nào
                for (Document doc : documents) {
                    doc.getMetadata().put("source_file", filename);
                }

                allDocuments.addAll(documents);

                // Đánh dấu file đã được xử lý
                markFileAsProcessed(filename);
            } catch (Exception e) {
                System.err.println("Lỗi khi xử lý file " + filename + ": " + e.getMessage());
                e.printStackTrace();
            }
        }

        if (!allDocuments.isEmpty()) {
            vectorStore.add(allDocuments);
            System.out.println("Đã thêm " + allDocuments.size() + " chunk từ " + newResources.size() + " file mới.");
        }
    }

    private void createProcessedFilesTableIfNotExists() {
        jdbcTemplate.execute(
                "CREATE TABLE IF NOT EXISTS " + PROCESSED_FILES_TABLE + " (" +
                        "id SERIAL PRIMARY KEY, " +
                        "filename VARCHAR(255) NOT NULL UNIQUE, " +
                        "processed_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP" +
                        ")"
        );
    }

    private Set<String> getProcessedFiles() {
        List<String> files = jdbcTemplate.queryForList(
                "SELECT filename FROM " + PROCESSED_FILES_TABLE,
                String.class
        );
        return new HashSet<>(files);
    }

    private void markFileAsProcessed(String filename) {
        jdbcTemplate.update(
                "INSERT INTO " + PROCESSED_FILES_TABLE + " (filename) VALUES (?) " +
                        "ON CONFLICT (filename) DO NOTHING",
                filename
        );
    }
}
package com.harkins.startYourEngine.configuration;

import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.ai.vectorstore.pgvector.PgVectorStore;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

@Configuration
public class PgVectorStoreConfig {

    @Bean
    public PgVectorStore pgVectorStore(JdbcTemplate jdbcTemplate, EmbeddingModel embeddingModel) {
        // Tạo bảng vector nếu chưa tồn tại
        jdbcTemplate.execute("CREATE EXTENSION IF NOT EXISTS vector");

        return PgVectorStore.builder(jdbcTemplate, embeddingModel)
                .vectorTableName("processed_pdf_files")  // Tên bảng lưu vector
                .dimensions(1536)       // Dimension tùy thuộc vào embedding model
                .build();
    }
}
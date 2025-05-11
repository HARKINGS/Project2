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
        // Tạo extension và bảng vector
        jdbcTemplate.execute("CREATE EXTENSION IF NOT EXISTS vector");
        jdbcTemplate.execute("""
            CREATE TABLE IF NOT EXISTS document_vectors (
                id VARCHAR PRIMARY KEY,
                content TEXT,
                metadata JSONB,
                embedding VECTOR(768)  -- Số chiều phù hợp với nomic-embed-text
            )
            """);

        return PgVectorStore.builder(jdbcTemplate, embeddingModel)
                .vectorTableName("document_vectors")  // Tên bảng vector mới
                .dimensions(768)      // Nomic-embed-text dùng 768 dimensions
                .initializeSchema(true) // Kích hoạt tự động khởi tạo schema
                .build();
    }
}
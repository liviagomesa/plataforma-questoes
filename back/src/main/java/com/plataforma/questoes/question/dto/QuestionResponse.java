package com.plataforma.questoes.question.dto;

import com.plataforma.questoes.question.QuestionType;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;

public record QuestionResponse(
        UUID id,
        String title,
        QuestionType type,
        Map<String, Object> data,
        Instant createdAt
) {}

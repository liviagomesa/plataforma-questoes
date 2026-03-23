package com.plataforma.questoes.question.dto;

import com.plataforma.questoes.question.QuestionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.Map;

public record QuestionRequest(
        @NotBlank String title,
        @NotNull QuestionType type,
        @NotNull Map<String, Object> data
) {}

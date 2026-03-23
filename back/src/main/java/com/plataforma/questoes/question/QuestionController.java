package com.plataforma.questoes.question;

import com.plataforma.questoes.question.dto.QuestionRequest;
import com.plataforma.questoes.question.dto.QuestionResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/questions")
@Tag(name = "Questões", description = "CRUD de questões avaliativas")
public class QuestionController {

    private final QuestionService service;

    public QuestionController(QuestionService service) {
        this.service = service;
    }

    @GetMapping
    @Operation(summary = "Lista todas as questões")
    public List<QuestionResponse> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Busca questão por ID")
    public QuestionResponse findById(@PathVariable UUID id) {
        return service.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Cria nova questão")
    public QuestionResponse create(@RequestBody @Validated QuestionRequest req) {
        return service.create(req);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualiza questão existente")
    public QuestionResponse update(@PathVariable UUID id, @RequestBody @Validated QuestionRequest req) {
        return service.update(id, req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Remove questão")
    public void delete(@PathVariable UUID id) {
        service.delete(id);
    }
}

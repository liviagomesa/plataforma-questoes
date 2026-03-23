package com.plataforma.questoes.question;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.plataforma.questoes.question.dto.QuestionRequest;
import com.plataforma.questoes.question.dto.QuestionResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class QuestionService {

    private final QuestionRepository repository;
    private final ObjectMapper objectMapper;

    public QuestionService(QuestionRepository repository, ObjectMapper objectMapper) {
        this.repository = repository;
        this.objectMapper = objectMapper;
    }

    public List<QuestionResponse> findAll() {
        return repository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public QuestionResponse findById(UUID id) {
        return repository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Questão não encontrada"));
    }

    public QuestionResponse create(QuestionRequest req) {
        Question q = new Question();
        q.setTitle(req.title());
        q.setType(req.type());
        q.setData(toJson(req.data()));
        return toResponse(repository.save(q));
    }

    public QuestionResponse update(UUID id, QuestionRequest req) {
        Question q = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Questão não encontrada"));
        q.setTitle(req.title());
        q.setType(req.type());
        q.setData(toJson(req.data()));
        return toResponse(repository.save(q));
    }

    public void delete(UUID id) {
        repository.deleteById(id);
    }

    private QuestionResponse toResponse(Question q) {
        return new QuestionResponse(
                q.getId(), q.getTitle(), q.getType(),
                fromJson(q.getData()), q.getCreatedAt()
        );
    }

    private String toJson(Map<String, Object> data) {
        try {
            return objectMapper.writeValueAsString(data);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao serializar dados da questão", e);
        }
    }

    private Map<String, Object> fromJson(String json) {
        try {
            return objectMapper.readValue(json, new TypeReference<>() {});
        } catch (Exception e) {
            throw new RuntimeException("Erro ao desserializar dados da questão", e);
        }
    }
}

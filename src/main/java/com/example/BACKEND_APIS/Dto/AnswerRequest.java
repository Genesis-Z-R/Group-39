package com.example.BACKEND_APIS.Dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class AnswerRequest {
@NotNull
    private Long questionId;
@NotNull
    private Long userId;
@NotBlank
    private String content;

}

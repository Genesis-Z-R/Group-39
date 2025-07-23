
package com.example.BACKEND_APIS.Dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class QuestionRequest {
    // Getters and Setters
    @NotBlank
    private String title;

    @NotBlank
    private String content;

    @NotNull
    private Long userId;

}

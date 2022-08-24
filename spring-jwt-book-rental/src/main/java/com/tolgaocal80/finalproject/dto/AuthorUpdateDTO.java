package com.tolgaocal80.finalproject.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;


public class AuthorUpdateDTO {

    @NotBlank
    @Size(max = 255, min = 1, message = "Enter a valid author name")
    private String name;

    public String getName() {
        return name;
    }

}

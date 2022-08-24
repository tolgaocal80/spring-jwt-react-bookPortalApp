package com.tolgaocal80.finalproject.dto;

import javax.validation.constraints.NotBlank;

public class UserUpdateDTO {

    private String password;

    @NotBlank
    private String username;

    private String role;

    public String getRole() {
        return role;
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }
}

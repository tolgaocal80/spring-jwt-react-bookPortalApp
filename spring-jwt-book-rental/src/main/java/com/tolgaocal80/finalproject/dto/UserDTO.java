package com.tolgaocal80.finalproject.dto;


import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

public class UserDTO {

    @NotBlank
    @Size(max = 255, min = 3, message = "Please enter a valid username")
    @Email
    private String username;

    @NotBlank
    @Size(max = 255, min = 3, message = "Please enter a valid password")
    private String password;

    private String role;

    public String getRole(){
        return role;
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }
}

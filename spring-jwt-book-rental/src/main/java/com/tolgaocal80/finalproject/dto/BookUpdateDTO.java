package com.tolgaocal80.finalproject.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

public class BookUpdateDTO {

    @NotBlank
    @Size(max = 255, min = 1, message = "Enter a valid book name")
    private String name;
    private String viewsNumber;
    private String authorName;
    private String isbn;
    private int year;
    private int pageNumber;
    private String type;
    private int readNumber;
    private int favoriteNumber;
    private boolean isOnPortal ;

    public String getIsbn() {
        return isbn;
    }

    public void setIsbn(String isbn) {
        this.isbn = isbn;
    }

    public String getName() {
        return name;
    }

    public String getViewsNumber() {
        return viewsNumber;
    }

    public String getAuthorName() {
        return authorName;
    }

    public int getYear() {
        return year;
    }

    public int getPageNumber() {
        return pageNumber;
    }

    public String getType() {
        return type;
    }

    public int getReadNumber() {
        return readNumber;
    }

    public int getFavoriteNumber() {
        return favoriteNumber;
    }

    public boolean isOnPortal() {
        return isOnPortal;
    }
}

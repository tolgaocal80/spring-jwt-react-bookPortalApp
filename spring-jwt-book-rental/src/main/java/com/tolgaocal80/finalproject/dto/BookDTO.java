package com.tolgaocal80.finalproject.dto;


import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;


public class BookDTO {

    @NotBlank
    @Size(max = 255, min = 1, message = "Enter a valid book name")
    private String name;

    @NotBlank
    @Size(max = 255, min = 1, message = "Enter a valid author name")
    private String authorName;

    @NotBlank
    @Size(max = 255, min = 1, message = "Enter a valid ISBN name")
    private String isbn;

    @NotBlank
    @Size(max = 255, message = "Enter a valid topic")
    private String type;

    private boolean isOnPortal = true;

    private int viewsNumber = 0;

    private int readNumber = 0;

    private int favoriteNumber = 0;

    private int year;

    private int pageNumber;

    public String getName() {
        return name;
    }


    public String getAuthorName() {
        return authorName;
    }

    public String getIsbn() {
        return isbn;
    }

    public String getType() {
        return type;
    }

    public boolean isOnPortal() {
        return isOnPortal;
    }

    public int getViewsNumber() {
        return viewsNumber;
    }

    public int getReadNumber() {
        return readNumber;
    }

    public int getFavoriteNumber() {
        return favoriteNumber;
    }

    public int getYear() {
        return year;
    }

    public int getPageNumber() {
        return pageNumber;
    }
}

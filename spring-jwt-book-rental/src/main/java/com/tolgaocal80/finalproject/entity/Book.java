package com.tolgaocal80.finalproject.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.ManyToMany;
import javax.persistence.Table;
import java.util.Set;

@Entity
@Table(name = "BOOK")

public class Book extends EntityBase{

    @Column(name = "ISBN", length = 255, unique = true)
    private String isbn;

    @Column(name = "NAME", length = 255, nullable = false)
    private String name;

    @Column(name = "AUTHOR_NAME")
    private String authorName;

    public void incrementReadNumber(){
        this.readNumber++;
    }

    public void decrementFavoriteNumber(){
        this.favoriteNumber--;
    }
    public void incrementFavoriteNumber(){
        this.favoriteNumber++;
    }

    @Column(name = "YEAR", length = 4)
    private int year;

    @Column(name = "PAGE_NUMBER", length = 10)
    private int pageNumber;

    @Column(name = "TYPE")
    private String type;

    @Column(name = "READ_NUMBER")
    private int readNumber = 0;

    @Column(name = "FAVORITE_NUMBER")
    private int favoriteNumber = 0;

    @Column(name = "IS_ON_PORTAL")
    private boolean isOnPortal = true;

    @Column(name = "VIEWS_NUMBER")
    private int viewsNumber = 0;

    @ManyToMany(mappedBy = "books")
    @JsonBackReference
    private Set<Author> authors;

    @ManyToMany(mappedBy = "favoriteBooks")
    @JsonBackReference
    private Set<User> userFavorites;

    @ManyToMany(mappedBy = "readBooks")
    @JsonBackReference
    private Set<User> readUsers;

    public String getIsbn() {
        return isbn;
    }

    public void setIsbn(String isbn) {
        this.isbn = isbn;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAuthorName() {
        return authorName;
    }

    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public int getPageNumber() {
        return pageNumber;
    }

    public void setPageNumber(int pageNumber) {
        this.pageNumber = pageNumber;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public int getReadNumber() {
        return readNumber;
    }

    public void setReadNumber(int readNumber) {
        this.readNumber = readNumber;
    }

    public int getFavoriteNumber() {
        return favoriteNumber;
    }

    public void setFavoriteNumber(int favoriteNumber) {
        this.favoriteNumber = favoriteNumber;
    }

    public boolean isOnPortal() {
        return isOnPortal;
    }

    public void setOnPortal(boolean onPortal) {
        isOnPortal = onPortal;
    }

    public int getViewsNumber() {
        return viewsNumber;
    }

    public void setViewsNumber(int viewsNumber) {
        this.viewsNumber = viewsNumber;
    }

    public Set<Author> getAuthors() {
        return authors;
    }

    public void setAuthors(Set<Author> authors) {
        this.authors = authors;
    }

    public Set<User> getUserFavorites() {
        return userFavorites;
    }

    public void setUserFavorites(Set<User> userFavorites) {
        this.userFavorites = userFavorites;
    }

    public Set<User> getReadUsers() {
        return readUsers;
    }

    public void setReadUsers(Set<User> readUsers) {
        this.readUsers = readUsers;
    }
}

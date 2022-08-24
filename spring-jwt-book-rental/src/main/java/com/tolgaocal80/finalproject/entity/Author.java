package com.tolgaocal80.finalproject.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import javax.persistence.*;
import java.util.Set;

@Entity
@Table(name = "AUTHOR")
public class Author extends EntityBase{

    @Column(name = "NUMBER_OF_BOOKS")
    private int numberOfBooks = 0;

    @Column(name = "NAME", unique = true)
    private String name;

    @ManyToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinTable(name = "AUTHORS_BOOKS",
            joinColumns = {@JoinColumn(name = "AUTHOR_ID", referencedColumnName = "ID")},
            inverseJoinColumns = {@JoinColumn(name = "BOOK_ID", referencedColumnName = "ID")})

    @JsonManagedReference
    private Set<Book> books;

    public void addBookNumber(){
        this.numberOfBooks++;
    }

    public int getNumberOfBooks() {
        return numberOfBooks;
    }

    public void setNumberOfBooks(int numberOfBooks) {
        this.numberOfBooks = numberOfBooks;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<Book> getBooks() {
        return books;
    }

    public void setBooks(Set<Book> books) {
        this.books = books;
    }
}

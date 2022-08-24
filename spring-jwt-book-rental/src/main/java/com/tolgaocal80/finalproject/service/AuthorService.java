package com.tolgaocal80.finalproject.service;

import com.tolgaocal80.finalproject.dto.AuthorDTO;
import com.tolgaocal80.finalproject.dto.AuthorUpdateDTO;
import com.tolgaocal80.finalproject.dto.BookDTO;
import com.tolgaocal80.finalproject.entity.Author;
import com.tolgaocal80.finalproject.entity.Book;
import com.tolgaocal80.finalproject.entity.User;
import com.tolgaocal80.finalproject.repository.AuthorRepository;
import com.tolgaocal80.finalproject.repository.BookRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class AuthorService {

    private final AuthorRepository authorRepository;
    private final BookRepository bookRepository;


    public AuthorService(AuthorRepository authorRepository, BookRepository bookRepository, BookRepository bookRepository1) {
        this.authorRepository = authorRepository;
        this.bookRepository = bookRepository1;
    }

    public Author save(AuthorDTO authorDTO){
        Author author = new Author();
        author.setName(authorDTO.getName());

        return authorRepository.save(author);
    }

    public Author findById(Long id){
        return authorRepository.findById(id).orElseThrow(() -> {
            throw new IllegalArgumentException("No writer with given id: "+id);
        });
    }

    public List<Author> findAll(){
        return authorRepository.findAll();
    }

    public Page<Author> findAllWithPagination(int pageNumber, int pageSize){
        PageRequest pageRequest = PageRequest.of(pageNumber,pageSize);
        return authorRepository.findAll(pageRequest);
    }


    public Map<String, Object> getAuthorsWithPagination(String authorName, int pageSize, int pageNumber){
        try{
            List<Author> authors = new ArrayList<>();
            Pageable pageable = PageRequest.of(pageNumber, pageSize);
            Page<Author> pageAuthors;

            if(authorName == null || authorName.isEmpty() || authorName.isBlank()){
                pageAuthors = authorRepository.findAllByActiveTrue(pageable);
            }else{
                pageAuthors = authorRepository.searchAuthorsByActiveTrueAndNameContains(authorName, pageable);
            }

            authors = pageAuthors.getContent();
            Map<String, Object> response = new HashMap<>();

            response.put("authors", authors);
            response.put("currentPage", pageAuthors.getNumber());
            response.put("totalItems", pageAuthors.getTotalElements());
            response.put("totalPages", pageAuthors.getTotalPages());

            return response;

        }catch (Exception e){
            throw new IllegalArgumentException("Error occurred with author search");
        }

    }





    public List<Author> findAllByName(String authorName){
        Optional<List<Author>> authorOptional = authorRepository.findAllByNameContainsAndActiveTrue(authorName);
        return authorOptional.orElseThrow(() -> {
            throw new IllegalArgumentException("No writer with given name: "+authorName);
        });
    }

    public List<Author> findAllAuthorsByBookName(String bookName){
        return authorRepository.findAllByBooks_NameContainsAndActiveTrue(bookName)
                .orElseThrow(()->{
                    throw new IllegalArgumentException("Couldn't find any author with given book name: "+bookName);
                });
    }

    public List<Author> findAllAuthorsByBookType(String bookType){
        return authorRepository.findAllByBooks_TypeContainsAndActiveTrue(bookType)
                .orElseThrow(()->{
                    throw new IllegalArgumentException("Couldn't find any author with given book type: "+bookType);
                });
    }


    public Author findByName(String authorName){
        Optional<Author> authorOptional = authorRepository.findByName(authorName);
        return authorOptional.orElseThrow(() -> {
            throw new IllegalArgumentException("Couldn't find any author with given name: "+authorName);
        });
    }

    public List<Author> getAuthorsOrderByNumberOfBooks(){
        return authorRepository.getAllByActiveTrueOrderByNumberOfBooks();
    }

    public Author addBookToAuthor(String authorName, BookDTO bookDTO){
        Optional<Author> authorOpt = authorRepository.findByName(authorName);

        if (authorOpt.isPresent()){

            if(!bookDTO.getAuthorName().equals(authorOpt.get().getName())){
                throw new IllegalArgumentException("Author name doesn't match with given book: "+bookDTO.getName()+" Author: "+bookDTO.getAuthorName());
            }

            Book book = new Book();
            book.setName(bookDTO.getName());
            book.setAuthorName(authorOpt.get().getName());
            book.setIsbn(bookDTO.getIsbn());
            book.setType(bookDTO.getType());
            book.setYear(bookDTO.getYear());
            book.setPageNumber(bookDTO.getPageNumber());

            Author author = authorOpt.get();

            author.getBooks().add(book);
            author.addBookNumber();
            book.setAuthors(Set.of(author));
            bookRepository.save(book);

            return author;
        }

        throw  new IllegalArgumentException("Author with given name couln't find: "+authorName);
    }

    public Author addBookToAuthor(Long id, BookDTO bookDTO){
        Optional<Author> authorOpt = authorRepository.findById(id);

        if (authorOpt.isPresent()){

            if(!bookDTO.getAuthorName().equals(authorOpt.get().getName())){
                throw new IllegalArgumentException("Author name doesn't match with given book: "+bookDTO.getName()+" Author: "+bookDTO.getAuthorName());
            }

            Book book = new Book();
            book.setName(bookDTO.getName());
            book.setAuthorName(authorOpt.get().getName());
            book.setIsbn(bookDTO.getIsbn());
            book.setType(bookDTO.getType());
            book.setYear(bookDTO.getYear());
            book.setPageNumber(bookDTO.getPageNumber());

            Author author = authorOpt.get();

            author.getBooks().add(book);
            author.addBookNumber();
            book.setAuthors(Set.of(author));
            bookRepository.save(book);

            return author;
        }

        throw  new IllegalArgumentException("Author with given id couln't find: "+id);
    }

    public Author remove(Long id){
        Author author = this.findById(id);
        author.setActive(!author.isActive());
        return authorRepository.save(author);
    }

    public Author update(Long id, AuthorUpdateDTO authorUpdateDTO){
        Author author = this.findById(id);
        author.setName(authorUpdateDTO.getName());
        return authorRepository.save(author);
    }

}

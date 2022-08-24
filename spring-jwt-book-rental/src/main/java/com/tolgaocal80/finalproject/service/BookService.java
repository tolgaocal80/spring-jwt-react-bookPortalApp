package com.tolgaocal80.finalproject.service;

import com.tolgaocal80.finalproject.dto.BookDTO;
import com.tolgaocal80.finalproject.dto.BookUpdateDTO;
import com.tolgaocal80.finalproject.entity.Author;
import com.tolgaocal80.finalproject.entity.Book;
import com.tolgaocal80.finalproject.entity.User;
import com.tolgaocal80.finalproject.repository.AuthorRepository;
import com.tolgaocal80.finalproject.repository.BookRepository;
import com.tolgaocal80.finalproject.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class BookService {

    private final BookRepository bookRepository;
    private final AuthorRepository authorRepository;
    private final UserRepository userRepository;

    public BookService(BookRepository bookRepository, AuthorRepository authorRepository, UserRepository userRepository) {
        this.bookRepository = bookRepository;
        this.authorRepository = authorRepository;
        this.userRepository = userRepository;
    }

    public Book save(BookDTO bookDTO){

        Book book = new Book();
        book.setName(bookDTO.getName());
        book.setIsbn(bookDTO.getIsbn());
        book.setType(bookDTO.getType());
        book.setYear(bookDTO.getYear());
        book.setPageNumber(bookDTO.getPageNumber());
        book.setAuthorName(bookDTO.getAuthorName());

        boolean authorExist = authorRepository.existsByName(bookDTO.getAuthorName());

        if(!authorExist){
            Author author = new Author();
            author.setName(bookDTO.getAuthorName());
            author.setBooks(Set.of(book));
            author.addBookNumber();
            authorRepository.save(author);
            book.setAuthors(Set.of(author));
            return book;
        }else{
            Optional<Author> bookAuthor = authorRepository.findByName(bookDTO.getAuthorName());
            bookAuthor.ifPresent( (author) -> {

                author.getBooks().add(book);
                author.addBookNumber();

                book.setAuthors(Set.of(author));
            });
        }
        return bookRepository.save(book);
    }

    public List<Book> findAll(){
        return bookRepository.findAll();
    }

    public Page<Book> findAllWithPagination(int pageNumber, int pageSize){
        PageRequest paged = PageRequest.of(pageNumber, pageSize);
        return bookRepository.findAll(paged);
    }

    // return Page

    public Map<String, Object> searchBooksByNameWithPagination(String bookName, int pageNumber, int pageSize){
        try{
            List<Book> books = new ArrayList<Book>();
            Pageable paging = PageRequest.of(pageNumber,pageSize);
            Page<Book> pageBooks;

            if(bookName == null){
                pageBooks = bookRepository.findAll(paging);
            }else{
                pageBooks = bookRepository.searchBooksByActiveTrueAndNameContains(bookName, paging);
            }
            books = pageBooks.getContent();
            Map<String, Object> response = new HashMap<>();

            response.put("books", books);

            response.put("currentPage", pageBooks.getNumber());
            response.put("totalItems", pageBooks.getTotalElements());
            response.put("totalPages", pageBooks.getTotalPages());

            return response;

        }catch (Exception exception){
            throw  new IllegalArgumentException("Error occured with book search!");
        }
    }

    public boolean matchFavoriteUserAndBook(long bookId, long userId){
        Book book = bookRepository.getById(bookId);
        Optional<User> user = userRepository.getById(userId);
        return user.map(value -> value.getFavoriteBooks().contains(book)).orElse(false);
    }

    public boolean matchReadBookAndUser(long bookId, long userId) {
        Book book = bookRepository.getById(bookId);
        Optional<User> user = userRepository.getById(userId);
        return user.map(value -> value.getReadBooks().contains(book)).orElse(false);
    }

    public Book findByName(String name){
        Optional<Book> bookOpt = bookRepository.findByNameAndActiveTrue(name);
        return bookOpt.orElseThrow(() -> {
            throw new IllegalArgumentException("Book not found");
        });
    }

    public List<Book> findAllOrderByViewsNumber(){
        return bookRepository.getAllByActiveTrueOrderByViewsNumber();
    }

    // Yazar ismi yazınca örnegin "Marcus", yazar isminde Marcus bulunan bütün kitaplar gelsin.
    public List<Book> findAllByAuthorName(String authorName){
        return bookRepository.findAllByAuthorNameContainsAndActiveTrueOrderByName(authorName)
                .orElseThrow(() -> {
                    throw new IllegalArgumentException("Couldn't find any book with author name contains: "+authorName);
                });
    }

    public List<Book> getAllBooksOrderByFavoriteNumber(){
        return bookRepository.getAllByActiveTrueOrderByFavoriteNumberDesc();
    }

    public List<Book> findBooksByYear(int year){
        return bookRepository.findByYearAndActiveTrue(year).orElseThrow(()->{
            throw new IllegalArgumentException("Couldn't find any book with year: "+year);
        });
    }

    public List<Book> getAllBooksOrderByReadNumber(){
        return bookRepository.getAllByActiveTrueOrderByReadNumberDesc().orElseThrow(()->{
            throw new IllegalArgumentException("Couldn't find any book");
        });
    }

    public Book getMaxReadBook(){
        return bookRepository.getMaxReadBook().orElseThrow(() -> {
            throw new IllegalArgumentException("No book found");
        });
    }

    public Book findByIsbn(String isbn){
        Optional<Book> bookOpt = bookRepository.findByIsbn(isbn);
        return bookOpt.orElseThrow(() -> {
            throw new IllegalArgumentException("Book not found by ISBN number");
        });
    }

    public List<Book> findByType(String type){
        Optional<List<Book>> bookListOpt = bookRepository.findByType(type);
        return bookListOpt.orElseThrow(() -> {
            throw new IllegalArgumentException("Couldn't find any book with given type: "+type);
        });
    }

    public List<Book> findAllByBookName(String bookName){
        return bookRepository.findAllByNameContainsAndActiveTrue(bookName)
                .orElseThrow(()-> {
                    throw new IllegalArgumentException("Couldn't find any book contains given name: "+bookName);
                });
    }

    public Book findByID(long id){
        Optional<Book> bookOpt = bookRepository.findById(id);
        return bookOpt.orElseThrow(() -> {
            throw  new IllegalArgumentException("Book not found");
        });
    }

    public Book remove(Long id){
        Book book = this.findByID(id);
        book.setActive(!book.isActive());
        return bookRepository.save(book);
    }

    public Book update(Long id, BookUpdateDTO bookUpdateDTO){

        Book book = this.findByID(id);

        book.setName(bookUpdateDTO.getName());
        book.setAuthorName(bookUpdateDTO.getAuthorName());
        book.setType(bookUpdateDTO.getType());
        book.setPageNumber(bookUpdateDTO.getPageNumber());
        book.setYear(bookUpdateDTO.getYear());
        book.setIsbn(bookUpdateDTO.getIsbn());

        return bookRepository.save(book);
    }

}

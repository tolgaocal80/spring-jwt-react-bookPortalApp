package com.tolgaocal80.finalproject.controllers;


import com.tolgaocal80.finalproject.dto.BookDTO;
import com.tolgaocal80.finalproject.dto.BookUpdateDTO;
import com.tolgaocal80.finalproject.entity.Book;
import com.tolgaocal80.finalproject.payload.response.MessageResponse;
import com.tolgaocal80.finalproject.repository.BookRepository;
import com.tolgaocal80.finalproject.service.BookService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/books")
public class BookController {

    private static final Logger LOGGER = LoggerFactory.getLogger(BookController.class);

    private final BookService bookService;
    private final BookRepository bookRepository;


    public BookController(BookService bookService, BookRepository bookRepository) {
        this.bookService = bookService;
        this.bookRepository = bookRepository;
    }


    @GetMapping("")
    public ResponseEntity<List<Book>> getAllBooks(){
        return ResponseEntity.ok(bookService.findAll());
    }

    @GetMapping("/by-book-name")
    public ResponseEntity<Book> findBookByName(@RequestParam(name = "bookName") String bookName){
        return ResponseEntity.ok(bookService.findByName(bookName));
    }

    @GetMapping("/all-by-bookname")
    public ResponseEntity<List<Book>> getAllBooksByName(@RequestParam(name = "bookName") String bookname){
        return ResponseEntity.ok(bookService.findAllByBookName(bookname));
    }

    @GetMapping("/order-by-views-number")
    public ResponseEntity<List<Book>> getAllBooksOrderByViewsNumber(){
        return ResponseEntity.ok(bookService.findAllOrderByViewsNumber());
    }

    @GetMapping("/all-by-type")
    public ResponseEntity<List<Book>> getAllBooksByType(@RequestParam(name = "type") String type){
        return ResponseEntity.ok(bookService.findByType(type));
    }

    @GetMapping("/by-isbn")
    public ResponseEntity<Book> findBookByIsbnNumber(@RequestParam(name = "isbn") String isbn){
        return ResponseEntity.ok(bookService.findByIsbn(isbn));
    }

    @GetMapping("/all-by-author-name")
    public ResponseEntity<List<Book>> getAllBooksByAuthorName(@RequestParam(name = "authorName") String authorName){
        return ResponseEntity.ok(bookService.findAllByAuthorName(authorName));
    }

    @GetMapping("/all-with-pagination")
    public ResponseEntity<Page<Book>> getAllBooksWithPagination(@RequestParam(name = "pageNumber") int pageNumber, @RequestParam(name = "pageSize") int pageSize){
        return ResponseEntity.ok(bookService.findAllWithPagination(pageNumber,pageSize));
    }

    @GetMapping("/search-by-name-pagination")
    public ResponseEntity<Map<String, Object>> searchBooksByNameWithPagination(@RequestParam(name = "bookName", required = false) String bookName, @RequestParam(name = "pageNumber", defaultValue = "0") int pageNumber, @RequestParam(name = "pageSize", defaultValue = "3") int pageSize){
        try {
            return ResponseEntity.ok(bookService.searchBooksByNameWithPagination(bookName, pageNumber, pageSize));
        }catch (Exception exception){
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @GetMapping("/check-if-favorite")
    public ResponseEntity<Map<String, Boolean>> matchFavoriteUserAndBook(@RequestParam(name = "bookId") long bookId,@RequestParam(name = "userId") long userId){
        boolean isFavorite = bookService.matchFavoriteUserAndBook(bookId,userId);
        Map<String, Boolean> favorite = new HashMap<>();
        favorite.put("isFavorite", isFavorite);
        return new ResponseEntity<>(favorite, HttpStatus.OK);
    }

    @GetMapping("/check-if-read")
    public ResponseEntity<Map<String, Boolean>> matchReadUserAndBook(@RequestParam(name = "bookId") long bookId, @RequestParam(name = "userId") long userId) {
        boolean isRead = bookService.matchReadBookAndUser(bookId, userId);
        Map<String, Boolean> read = new HashMap<>();
        read.put("isRead", isRead);
        return new ResponseEntity<>(read, HttpStatus.OK);
    }

    @GetMapping("/all-order-by-favorite")
    public ResponseEntity<List<Book>> getAllBooksOrderByFavorite(){
        return ResponseEntity.ok(bookService.getAllBooksOrderByFavoriteNumber());
    }

    @GetMapping("/all-by-year")
    public ResponseEntity<List<Book>> getAllBooksByYear(@RequestParam(name = "year") int year){
        return ResponseEntity.ok(bookService.findBooksByYear(year));
    }

    @GetMapping("/by-id")
    public ResponseEntity<Book> findBookById(@RequestParam(name = "id") Long id){
        return ResponseEntity.ok(bookService.findByID(id));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("/edit/{bookId}")
    public ResponseEntity<?> updateBook(@PathVariable(name = "bookId") long id, @Valid @RequestBody BookUpdateDTO bookUpdateDTO){

        String responseMessage = "";

        try {
            bookService.update(id, bookUpdateDTO);

            responseMessage = "Book updated successfully!"
                    +"\nBook Name: \n" + bookUpdateDTO.getName()
                    +"\nAuthor Name:  \n" + bookUpdateDTO.getAuthorName();

            return ResponseEntity.ok(new MessageResponse(responseMessage));

        }catch (Exception e){
            responseMessage = "Book couldn't updated. You can't give same ISBN number to books.";
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse(responseMessage));
        }
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/delete/{bookId}")
    public ResponseEntity<Book> removeBook(@PathVariable(name = "bookId") long id){
        return ResponseEntity.ok(bookService.remove(id));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("")
    public ResponseEntity<?> createBook(@Valid @RequestBody BookDTO bookDTO){

        String responseMessage = "";

        try {
            bookService.save(bookDTO);
            responseMessage = "Book saved successfully!"
                    +"\nBook Name: \n" + bookDTO.getName()
                    +"\nAuthor Name:  \n" + bookDTO.getAuthorName();

            return ResponseEntity.ok(new MessageResponse(responseMessage));

        }catch (Exception e){
            responseMessage = "Book couldn't added: This ISBN is already on database.";
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse(responseMessage));
        }
    }

}

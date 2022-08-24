package com.tolgaocal80.finalproject.controllers;

import com.tolgaocal80.finalproject.dto.AuthorDTO;
import com.tolgaocal80.finalproject.dto.AuthorUpdateDTO;
import com.tolgaocal80.finalproject.dto.BookDTO;
import com.tolgaocal80.finalproject.entity.Author;
import com.tolgaocal80.finalproject.payload.response.MessageResponse;
import com.tolgaocal80.finalproject.service.AuthorService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/authors")
public class AuthorController {

    private final AuthorService authorService;

    public AuthorController(AuthorService authorService) {
        this.authorService = authorService;
    }

    @GetMapping("")
    public ResponseEntity<List<Author>> getAllAuthors(){
        return ResponseEntity.ok(authorService.findAll());
    }

    @GetMapping("/by-name")
    public ResponseEntity<Author> findAuthorByName(@RequestParam(name = "name") String authorName){
        return ResponseEntity.ok(authorService.findByName(authorName));
    }

    @GetMapping("/all-by-book-name")
    public ResponseEntity<List<Author>> findAllByBooksNameContains(@RequestParam(name = "bookName") String bookName){
        return ResponseEntity.ok(authorService.findAllAuthorsByBookName(bookName));
    }

    @GetMapping("/all-by-book-type")
    public  ResponseEntity<List<Author>> findAllByBooksTypeContains(@RequestParam(name = "bookType") String bookType){
        return ResponseEntity.ok(authorService.findAllAuthorsByBookType(bookType));
    }

    @GetMapping("/all-by-name")
    public ResponseEntity<List<Author>> findAllByName(@RequestParam(name = "name") String authorName){
        return ResponseEntity.ok(authorService.findAllByName(authorName));
    }

    @GetMapping("/all-with-pagination")
    public ResponseEntity<Page<Author>> getAllAuthorsWithPagination(@RequestParam(name = "pageNumber") int pageNumber, @RequestParam(name = "pageSize") int pageSize){
        return ResponseEntity.ok(authorService.findAllWithPagination(pageNumber,pageSize));
    }



    @GetMapping("/search-by-authorname-pagination")
    public ResponseEntity<Map<String, Object>> getAuthorsWithJpaPagination(
            @RequestParam(name = "authorName", required = false) String authorName,
            @RequestParam(name = "pageSize",defaultValue = "5") int pageSize,
            @RequestParam(name = "pageNumber",defaultValue = "0") int pageNumber)
    {
        try{
            return ResponseEntity.ok(authorService.getAuthorsWithPagination(authorName, pageSize, pageNumber));
        }catch (Exception e){
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



    @GetMapping("/all-order-by-book-number")
    public ResponseEntity<List<Author>> getAllAuthorsOrderByNumberOfBooks(){
        return ResponseEntity.ok(authorService.getAuthorsOrderByNumberOfBooks());
    }

    @GetMapping("/by-id")
    public ResponseEntity<Author> findById(@RequestParam(name = "id") Long id){
        return ResponseEntity.ok(authorService.findById(id));
    }

    @PutMapping("/edit/{authorId}")
    public ResponseEntity<?> updateAuthor(@PathVariable(name = "authorId") long id, @Valid @RequestBody AuthorUpdateDTO authorUpdateDTO){

        String responseMessage = "";
        try{
            authorService.update(id, authorUpdateDTO);

            responseMessage = "Author updated successfully!"
                    +"\nAuthor Name: \n" + authorUpdateDTO.getName();

            return ResponseEntity.ok(new MessageResponse(responseMessage));

        }catch (Exception e){
            responseMessage = "Author couldn't updated.";
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse(responseMessage));
        }
    }

    @DeleteMapping("/{authorId}")
    public ResponseEntity<Author> removeAuthor(@PathVariable(name = "authorId") long id){
        return ResponseEntity.ok(authorService.remove(id));
    }





    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("")
    public ResponseEntity<?> createAuthor(@Valid @RequestBody AuthorDTO authorDTO){

        String responseMessage = "";

        try {
            authorService.save(authorDTO);
            responseMessage = "Author created successfully!"
                    +"\nAuthor Name: \n" + authorDTO.getName();

            return ResponseEntity.ok(new MessageResponse(responseMessage));

        }catch (Exception e){
            responseMessage = "Author couldn't created.";
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse(responseMessage));
        }

    }




    @PostMapping("/{authorId}/add-book")
    public ResponseEntity<Author> addBookToAuthor(@PathVariable(name = "authorId") long id, @Valid @RequestBody BookDTO bookDTO){
        return ResponseEntity.ok(authorService.addBookToAuthor(id, bookDTO));
    }

    @PostMapping("/add-book-to-author")
    public ResponseEntity<Author> addBookToAuthor(@RequestParam(name = "authorName") String authorName, @Valid @RequestBody BookDTO bookDTO){
        authorName = authorName.replaceAll("%20"," ");
        return ResponseEntity.ok(authorService.addBookToAuthor(authorName, bookDTO));
    }


}

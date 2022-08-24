package com.tolgaocal80.finalproject.controllers;

import com.tolgaocal80.finalproject.dto.UserDTO;
import com.tolgaocal80.finalproject.dto.UserUpdateDTO;
import com.tolgaocal80.finalproject.entity.Book;
import com.tolgaocal80.finalproject.entity.User;
import com.tolgaocal80.finalproject.payload.response.MessageResponse;
import com.tolgaocal80.finalproject.repository.UserRepository;
import com.tolgaocal80.finalproject.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;

    public UserController(UserService userService, UserRepository userRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
    }

    @GetMapping("")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<User>> getUsers(){
        return ResponseEntity.ok(userService.findAll());
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/search-by-name-pagination")
    public ResponseEntity<Map<String, Object>> getUsersWithJpaPagination(
            @RequestParam(name = "userName", required = false) String userName,
            @RequestParam(name = "pageSize",defaultValue = "5") int pageSize,
            @RequestParam(name = "pageNumber",defaultValue = "0") int pageNumber)
    {
        try{
            return ResponseEntity.ok(userService.getUsersWithPagination(userName, pageSize, pageNumber));
        }catch (Exception e){
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/by-username")
    public ResponseEntity<User> searchUsers(@RequestParam(name = "username") String username){
        return ResponseEntity.ok(userService.findByUsername(username));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/all-by-username")
    public ResponseEntity<List<User>> searchAllUsers(@RequestParam(name = "username") String username){
        return ResponseEntity.ok(userService.findAllByUsername(username));
    }


    @GetMapping("/{userId}")
    public ResponseEntity<User> getUser(@PathVariable(name = "userId") long id){
        return ResponseEntity.ok(userService.findById(id));
    }

    @GetMapping("/{userId}/get-favorite-books")
    public ResponseEntity<List<Book>> getUsersFavoriteBooksById(@PathVariable(name = "userId") long userId){
        return ResponseEntity.ok(userService.getUsersFavoriteBooksById(userId));
    }

    @GetMapping("/get-favorite-books")
    public ResponseEntity<List<Book>> getUsersFavoriteBooksByName(@RequestParam(name = "userName") String userName){
        return ResponseEntity.ok(userService.getUsersFavoriteBooksByName(userName));
    }

    @GetMapping("/{userId}/get-read-books")
    public ResponseEntity<List<Book>> getUsersReadBooksById(@PathVariable(name = "userId") long userId){
        return ResponseEntity.ok(userService.getUsersReadBooksById(userId));
    }

    @GetMapping("/get-read-books")
    public ResponseEntity<List<Book>> getUsersReadBookByName(@RequestParam(name = "userName") String userName){
        return ResponseEntity.ok(userService.getUsersReadBooksByName(userName));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("/edit/{userId}")
    public ResponseEntity<?> updateUser(@PathVariable(name = "userId") long id, @Valid @RequestBody UserUpdateDTO userUpdateDTO){

        String responseMessage = "";
        try{
            userService.update(id, userUpdateDTO);

            responseMessage = "User updated successfully!"
                    +"\nUser Name: \n" + userUpdateDTO.getUsername();

            return ResponseEntity.ok(new MessageResponse(responseMessage));
        }catch (Exception e){
            responseMessage = "User couldn't updated.";
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse(responseMessage));
        }
    }

    @PutMapping("/{userId}/add-book-to-favorites")
    public ResponseEntity<Map<String, Boolean>> addBookToUserFavorites(@PathVariable(name = "userId") long userId, @RequestParam(name = "bookId") long bookId){
        boolean addToFavorite = userService.addBookToFavorites(userId, bookId);

        Map<String, Boolean> response = new HashMap<>();
        response.put("favorite", addToFavorite);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{userId}/add-book-to-read")
    public ResponseEntity<Map<String, Boolean>> addBookToUserRead(@PathVariable(name = "userId") long userId, @RequestParam(name = "bookId") long bookId){
        boolean addToRead = userService.addBookToRead(userId, bookId);

        Map<String, Boolean> response = new HashMap<>();
        response.put("read", addToRead);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }


    @DeleteMapping("/{userId}/remove-book-from-read-list")
    public ResponseEntity<User> removeBookFromUserRead(@PathVariable(name = "userId") long userId, @RequestParam(name = "bookId") long bookId){
        return ResponseEntity.ok(userService.removeBookFromReadListByBookId(userId, bookId));
    }

    @DeleteMapping("/{userId}/remove-book-from-favorite-list")
    public ResponseEntity<User> removeBookFromUserFavorite(@PathVariable(name = "userId") long userId, @RequestParam(name = "bookId") long bookId){
        return ResponseEntity.ok(userService.removeBookFromFavoriteListByBookId(userId, bookId));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/delete/{userId}")
    public ResponseEntity<User> removeUser(@PathVariable(name = "userId") long id){
        return ResponseEntity.ok(userService.remove(id));
    }


    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("")
    public ResponseEntity<?> createUser(@Valid @RequestBody UserDTO userDTO){
        String responseMessage = "";

        try {
            userService.save(userDTO);
            responseMessage = "User created successfully!"
                    +"\nUser Name: \n" + userDTO.getUsername()
                    +"\nUser Role: \n" + userDTO.getRole();

            return ResponseEntity.ok(new MessageResponse(responseMessage));

        }catch (Exception e){
            responseMessage = "User couldn't created.";
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse(responseMessage));
        }
    }

}

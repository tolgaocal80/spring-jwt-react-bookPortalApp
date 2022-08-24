package com.tolgaocal80.finalproject.controllers;

import com.tolgaocal80.finalproject.entity.Book;
import com.tolgaocal80.finalproject.entity.User;
import com.tolgaocal80.finalproject.service.BookService;
import com.tolgaocal80.finalproject.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/test")
public class TestController {

  private final BookService bookService;
  private final UserService userService;

  public TestController(BookService bookService, UserService userService) {
    this.bookService = bookService;
    this.userService = userService;
  }

  @GetMapping("/all")
  public ResponseEntity<Map<String, Object>> allAccess() {

    try{
      int userCount = userService.getUserNumber();
      int readBooksNumber = userService.readBooksNumbers();

      Book maxReadBook = bookService.getMaxReadBook();
      Book maxFavoritedBook = bookService.getMaxFavoritedBook();
      User maxReadUser = userService.getMaxReadUser();

      Map<String, Object> response = new HashMap<>();

      String message = "Welcome to Book Rental App." +
              "There are " + userCount + " user and "+ readBooksNumber +" books read.";

      response.put("message",message);
      response.put("maxReadUser", maxReadUser);
      response.put("maxReadBook", maxReadBook);
      response.put("maxFavoritedBook", maxFavoritedBook);

      return ResponseEntity.ok(response);

    }catch (Exception e){
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @GetMapping("/user")
  @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
  public String userAccess() {
    return "User Content.";
  }


  @GetMapping("/admin")
  @PreAuthorize("hasRole('ADMIN')")
  public String adminAccess() {
    return "Admin Board.";
  }
}

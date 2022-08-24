package com.tolgaocal80.finalproject.controllers;

import com.tolgaocal80.finalproject.service.BookService;
import com.tolgaocal80.finalproject.service.UserService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
  public String allAccess() {

    int userCount = userService.getUserNumber();
    int readBooksNumber = userService.readBooksNumbers();

    return "Welcome to Book Rental App\n You can manage your books here...\n" +
            "There are " + userCount + " user and "+ readBooksNumber +" books read.";
  }

  @GetMapping("/user")
  @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
  public String userAccess() {
    return "User Content.";
  }

  @GetMapping("/mod")
  @PreAuthorize("hasRole('MODERATOR')")
  public String moderatorAccess() {
    return "Moderator Board.";
  }

  @GetMapping("/admin")
  @PreAuthorize("hasRole('ADMIN')")
  public String adminAccess() {
    return "Admin Board.";
  }
}

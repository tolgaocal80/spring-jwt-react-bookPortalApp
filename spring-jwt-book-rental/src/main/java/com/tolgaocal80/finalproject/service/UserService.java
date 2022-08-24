package com.tolgaocal80.finalproject.service;

import com.tolgaocal80.finalproject.dto.UserDTO;
import com.tolgaocal80.finalproject.dto.UserUpdateDTO;
import com.tolgaocal80.finalproject.entity.Book;
import com.tolgaocal80.finalproject.entity.Role;
import com.tolgaocal80.finalproject.entity.User;
import com.tolgaocal80.finalproject.repository.BookRepository;
import com.tolgaocal80.finalproject.repository.RoleRepository;
import com.tolgaocal80.finalproject.repository.UserRepository;
import com.tolgaocal80.finalproject.security.services.UserDetailsImpl;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;


@Service
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;

    private final RoleRepository roleRepository;

    private final BookService bookService;

    private final BookRepository bookRepository;

    private PasswordEncoder encoder;

    public UserService(UserRepository userRepository, RoleRepository roleRepository, BookService bookService, BookRepository bookRepository, PasswordEncoder encoder){
        this.bookService = bookService;
        this.bookRepository = bookRepository;
        this.encoder = encoder;
        this.userRepository = userRepository;

        this.roleRepository = roleRepository;
    }

    public User save(UserDTO userDTO){

        User user = new User();
        user.setPassword(encoder.encode(userDTO.getPassword()));
        user.setUsername(userDTO.getUsername());

        Optional<Role> userRoleOpt = roleRepository.findByName(userDTO.getRole());

        if (userRoleOpt.isPresent()){
            user.setRoles(Set.of(userRoleOpt.get()));
        }else{
            user.setRoles(Set.of(roleRepository.findByName("ROLE_USER").get()));
        }

        return userRepository.save(user);
    }

    public List<User> findAll(){
        return userRepository.findAll();
    }

    public Page<User> findAllWithPagination(int pageNumber, int pageSize){
        PageRequest paged = PageRequest.of(pageNumber, pageSize);
        return userRepository.findAll(paged);
    }

    public User findByUsername(String username){
        Optional<User> userOpt = userRepository.findByUsername(username);
        return userOpt.orElseThrow( () -> {
            throw new IllegalArgumentException("User not found");
        });
    }

    public int getUserNumber(){
        return userRepository.countUsersByActiveTrue();
    }

    public int readBooksNumbers(){
        return userRepository.getReadBookNumbers();
    }

    public User getMaxReadUser(){
        return userRepository.findFirstByOrderByReadBooksNumberDesc().orElseThrow(() -> {
            throw new IllegalArgumentException("Couldn't found");
        });
    }

    public List<User> findAllByUsername(String username){
        return userRepository.findByUsernameStartsWithAndActiveTrueOrderByCreateDateDesc(username);
    }

    public List<Book> getUsersFavoriteBooksById(long id){
        Optional<User> userOpt = userRepository.findById(id);
        List<Book> userFavoriteBooks = Collections.emptyList();
        if(userOpt.isPresent()){
            User user = userOpt.get();
            userFavoriteBooks = user.getFavoriteBooks().stream().toList();
        }
        return userFavoriteBooks;
    }

    public Map<String, Object> getUsersWithPagination(String userName, int pageSize, int pageNumber){
        try{
            List<User> users;
            Pageable pageable = PageRequest.of(pageNumber, pageSize);
            Page<User> pageUsers;

            if(userName == null){
                pageUsers = userRepository.findAll(pageable);
            }else{
                pageUsers = userRepository.searchUsersByActiveTrueAndUsernameContains(userName, pageable);
            }

            users = pageUsers.getContent();
            Map<String, Object> response = new HashMap<>();

            response.put("users", users);
            response.put("currentPage", pageUsers.getNumber());
            response.put("totalItems", pageUsers.getTotalElements());
            response.put("totalPages", pageUsers.getTotalPages());

            return response;

        }catch (Exception e){
            throw new IllegalArgumentException("Error occured with user search");
        }

    }

    public List<Book> getUsersFavoriteBooksByName(String name){
        var userOpt = userRepository.findByUsername(name);
        List<Book> userFavoriteBooks = Collections.emptyList();
        if(userOpt.isPresent()){
            User user = userOpt.get();
            userFavoriteBooks = user.getFavoriteBooks().stream().toList();
        }
        return userFavoriteBooks;
    }

    public List<Book> getUsersReadBooksByName(String name){
        var userOpt = userRepository.findByUsername(name);
        List<Book> userReadBooks = Collections.emptyList();
        if(userOpt.isPresent()){
            User user = userOpt.get();
            userReadBooks = user.getReadBooks().stream().toList();
        }
        return userReadBooks;
    }
    public List<Book> getUsersReadBooksById(long id){
        var userOpt = userRepository.findById(id);
        List<Book> userReadBooks = Collections.emptyList();
        if(userOpt.isPresent()){
            User user = userOpt.get();
            userReadBooks = user.getReadBooks().stream().toList();
        }
        return userReadBooks;
    }

    public User getById(long id){
        Optional<User> userOpt = userRepository.getById(id);
        return userOpt.orElseThrow( () -> {
            throw new IllegalArgumentException("User not found");
        } ) ;
    }

    public User findById(Long id){
        var userOptional = userRepository.findById(id);
        return userOptional.orElseThrow(() -> {
            throw new IllegalArgumentException("User not found");
        });
    }

    public User update(Long id, UserUpdateDTO userUpdateDTO){
        User user = this.findById(id);

        if(userUpdateDTO.getPassword() == null || userUpdateDTO.getPassword().isEmpty() ||
        userUpdateDTO.getPassword().isBlank() || userUpdateDTO.getPassword().length() < 3) {
        }else{
            user.setPassword(encoder.encode(userUpdateDTO.getPassword()));
        }

        user.setUsername(userUpdateDTO.getUsername());

        Optional<Role> role = roleRepository.findByName(userUpdateDTO.getRole());

        role.ifPresent(role1 -> {
            user.getRoles().clear();
            user.getRoles().add(role1);
        });
        return userRepository.save(user);
    }

    public boolean addBookToFavorites(long userId, long bookId){
        User user = this.findById(userId);
        Book book = bookService.findByID(bookId);
        if(book.getUserFavorites().add(user)){
            book.incrementFavoriteNumber();
            bookRepository.save(book);
            user.getFavoriteBooks().add(book);
            userRepository.save(user);
            return true;
        }else{
            book.getUserFavorites().remove(user);
            book.decrementFavoriteNumber();
            bookRepository.save(book);
            user.getFavoriteBooks().remove(book);
            userRepository.save(user);
            return false;
        }
    }
    public boolean addBookToRead(long userId, long bookId){
        User user = this.findById(userId);
        Book book = bookService.findByID(bookId);

        if(book.getReadUsers().add(user)){
            book.incrementReadNumber();
            book.getReadUsers().add(user);
            bookRepository.save(book);

            user.getReadBooks().add(book);
            user.incrementReadBooksNumber();
            userRepository.save(user);
            return true;
        }else{
            book.getReadUsers().remove(user);
            bookRepository.save(book);
            user.getReadBooks().remove(book);
            userRepository.save(user);
            return false;
        }
    }

    public User removeBookFromReadListByBookId(long userId, long bookId){
        User user = this.findById(userId);
        Book book = bookService.findByID(bookId);

        if(book.getReadUsers().remove(user)){
            bookRepository.save(book);

            user.getReadBooks().remove(book);
            return userRepository.save(user);
        }
        throw new IllegalArgumentException("Book couldn't find on user's read list.");
    }

    public User removeBookFromFavoriteListByBookId(long userId, long bookId){
        User user = this.findById(userId);
        Book book = bookService.findByID(bookId);

        if(book.getUserFavorites().remove(user)){
            book.decrementFavoriteNumber();
            bookRepository.save(book);

            user.getFavoriteBooks().remove(book);
            return userRepository.save(user);
        }
        throw new IllegalArgumentException("Book couldn't find on user's favorite list");
    }

    public User remove(long id){
        User user = this.findById(id);
        user.setActive(!user.isActive());
        return userRepository.save(user);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = this.findByUsername(username);
        return UserDetailsImpl.build(user);
    }

}

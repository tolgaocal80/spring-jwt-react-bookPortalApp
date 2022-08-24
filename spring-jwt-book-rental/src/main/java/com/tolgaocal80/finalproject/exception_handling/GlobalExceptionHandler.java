package com.tolgaocal80.finalproject.exception_handling;

import org.hibernate.exception.ConstraintViolationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.client.HttpClientErrorException;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;

@ControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger LOGGER = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handlerRuntimeException(HttpServletRequest request, Throwable throwable){
        LOGGER.error(throwable.getMessage(), throwable);
        var map = new HashMap<>();
        map.put("error", throwable.getMessage());
        return new ResponseEntity<>(map, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(ArithmeticException.class)
    public ResponseEntity<?> handlerArithmeticException(HttpServletRequest request, Throwable throwable){
        LOGGER.error(throwable.getMessage(), throwable);
        var map = new HashMap<>();
        map.put("error", throwable.getMessage());
        return new ResponseEntity<>(map, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<?> handlerDataIntegrityException(HttpServletRequest request, Throwable throwable){
        LOGGER.error(throwable.getMessage(), throwable);
        var map = new HashMap<>();
        map.put("error", "Book couldn't added, already in portal...");
        return new ResponseEntity<>(map, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<?> handlerIllegalException(HttpServletRequest request, Throwable throwable){
        LOGGER.error(throwable.getMessage(), throwable);
        var map = new HashMap<>();
        map.put("error", throwable.getLocalizedMessage());
        return new ResponseEntity<>(map, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(HttpClientErrorException.class)
    public ResponseEntity<?> handlerAuthorizationException(HttpServletRequest request, Throwable throwable){
        LOGGER.error(throwable.getMessage(), throwable);
        var map = new HashMap<>();
        map.put("error", throwable.getLocalizedMessage());
        return new ResponseEntity<>(map, HttpStatus.FORBIDDEN);
    }


    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<?> handlerAccessException(HttpServletRequest request, Throwable throwable){
        LOGGER.error(throwable.getMessage(), throwable);
        var map = new HashMap<>();
        map.put("error", throwable.getLocalizedMessage());
        return new ResponseEntity<>(map, HttpStatus.FORBIDDEN);
    }


    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handlerValidationException(HttpServletRequest request, Throwable throwable){
        LOGGER.error(throwable.getMessage(), throwable);
        var map = new HashMap<>();
        map.put("error", throwable.getLocalizedMessage());
        return new ResponseEntity<>(map, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<?> handlerConstraintViolation(HttpServletRequest request, Throwable throwable){
        LOGGER.error(throwable.getMessage(), throwable);
        var map = new HashMap<>();
        map.put("error", throwable.getMessage());
        return new ResponseEntity<>(map, HttpStatus.INTERNAL_SERVER_ERROR);
    }


}
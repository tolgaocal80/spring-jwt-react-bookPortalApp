package com.tolgaocal80.finalproject.repository;

import com.tolgaocal80.finalproject.entity.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

    Optional<Book> findByNameAndActiveTrue(String name);

    List<Book> getAllByActiveTrueOrderByFavoriteNumberDesc();

    Optional<List<Book>> findByYearAndActiveTrue(int year);

    Optional<List<Book>> findAllByAuthorNameContainsAndActiveTrueOrderByName(String authorName);

    Optional<Book> findById(Long id);


    Optional<Book> findFirstByOrderByFavoriteNumberDesc();

    Optional<Book> findFirstByOrderByReadNumberDesc();


    Page<Book> searchBooksByActiveTrueAndNameContains(String name, Pageable pageable);


    Optional<List<Book>> getAllByActiveTrueOrderByReadNumberDesc();

    Optional<List<Book>> findByType(String type);

    List<Book> getAllByActiveTrueOrderByViewsNumber();

    Optional<Book> findByIsbn(String ISBN);

    Optional<List<Book>> findAllByNameContainsAndActiveTrue(String name);

}

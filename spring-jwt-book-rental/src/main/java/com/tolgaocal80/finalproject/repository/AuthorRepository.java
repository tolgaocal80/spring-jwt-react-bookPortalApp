package com.tolgaocal80.finalproject.repository;

import com.tolgaocal80.finalproject.entity.Author;
import com.tolgaocal80.finalproject.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AuthorRepository extends JpaRepository<Author, Long> {

    Optional<List<Author>> findAllByNameContainsAndActiveTrue(String name);

    Page<Author> searchAuthorsByActiveTrueAndNameContains(String authorName, Pageable pageable);

    Optional<Author> findById(Long id);

    Page<Author> findAllByActiveTrue(Pageable pageable);

    boolean existsByName(String name);

    Optional<Author> findByName(String name);

    List<Author> getAllByActiveTrueOrderByNumberOfBooks();

    Optional<List<Author>> findAllByBooks_NameContainsAndActiveTrue(String bookName);

    Optional<List<Author>> findAllByBooks_TypeContainsAndActiveTrue(String bookType);

}

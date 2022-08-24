package com.tolgaocal80.finalproject.repository;

import com.tolgaocal80.finalproject.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    Page<User> searchUsersByActiveTrueAndUsernameContains(String username, Pageable pageable);

    List<User> findByRoles_NameIn(List<String> roles);

    List<User> findByUsernameStartsWithAndActiveTrueOrderByCreateDateDesc(String username);

    @Query(value = "select u from User u where u.id = :id")
    Optional<User> getById(long id);

    int countUsersByActiveTrue();

    @Query("select sum(u.readBooks.size) from User u")
    int getReadBookNumbers();



    boolean existsByUsername(String username);

    /*
    @Query(value = "select * from user_account where id = :id", nativeQuery = true)
    Optional<User> getByIdNative(long id);
     */

}

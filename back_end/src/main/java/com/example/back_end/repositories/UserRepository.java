package com.example.back_end.repositories;

import com.example.back_end.entity.User;
import org.springframework.data.domain.Example;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,Integer> {
    boolean existsByUsername(String username);
    Optional<User> findUserByEmailAndPassword(String email, String password);

    Optional<User> findByEmail(String email);

    @Override
    <S extends User> List<S> findAll(Example<S> example);
    Optional<User> findUserById(int id);
    Optional<User> findByUsername(String username);
}


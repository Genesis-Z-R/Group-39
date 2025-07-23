package com.example.BACKEND_APIS.Repository;

import com.example.BACKEND_APIS.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
public interface UserRepository  extends JpaRepository<User, Long>{
}

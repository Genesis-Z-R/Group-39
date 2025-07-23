package com.example.BACKEND_APIS.Service;

import com.example.BACKEND_APIS.Dto.UserRequest;
import com.example.BACKEND_APIS.Dto.UserResponse;
import com.example.BACKEND_APIS.Model.User;
import com.example.BACKEND_APIS.Repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;

@Service
public class UserServices {

    @Autowired
    private UserRepository userRepository;

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    public Optional<UserResponse> getUserById(Long id) {
        return userRepository.findById(id)
                .map(this::convertToResponse);
    }

    public UserResponse createUser(UserRequest userRequest) {
        User user = new User();
        user.setUsername(userRequest.getUsername());
        user.setEmail(userRequest.getEmail());
        user.setAvatarUrl(userRequest.getAvatarUrl());
        user.setPassword(userRequest.getPassword()); // You should hash this later!
        return convertToResponse(userRepository.save(user));
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    private UserResponse convertToResponse(User user) {
        return new UserResponse(user.getId(), user.getUsername(), user.getEmail(), user.getAvatarUrl()); // Add bio if needed
    }
}

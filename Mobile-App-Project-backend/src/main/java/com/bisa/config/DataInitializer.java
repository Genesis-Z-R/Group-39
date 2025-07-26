package com.bisa.config;

import com.bisa.model.*;
import com.bisa.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.util.HashSet;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Configuration
public class DataInitializer {
    @Bean
    CommandLineRunner initData(UserRepository userRepo, PostRepository postRepo, SpaceRepository spaceRepo, CommentRepository commentRepo, FollowRepository followRepo) {
        return args -> {
            if (userRepo.count() == 0) {
                List<User> users = new ArrayList<>();
                for (int i = 1; i <= 100; i++) {
                    User user = new User();
                    user.setName("User " + i);
                    user.setEmail("user" + i + "@example.com");
                    user.setAvatar("https://randomuser.me/api/portraits/med/men/" + (i % 100) + ".jpg");
                    user.setCredentials("Credentials for user " + i);
                    users.add(userRepo.save(user));
                }

                List<Post> posts = new ArrayList<>();
                Random rand = new Random();
                for (int i = 1; i <= 100; i++) {
                    Post post = new Post();
                    User author = users.get(rand.nextInt(users.size()));
                    post.setUser(author);
                    post.setQuestion("Sample question " + i + "?");
                    post.setAnswer("Sample answer for question " + i + ".");
                    post.setMediaUrl("https://picsum.photos/seed/" + i + "/600/400");
                    post.setMediaType("image");
                    post.setUpvotes(rand.nextInt(500));
                    post.setShares(rand.nextInt(50));
                    post.setCreatedAt(Instant.now().minusSeconds(rand.nextInt(100000)));
                    posts.add(postRepo.save(post));
                }

                for (int i = 0; i < 200; i++) {
                    Comment comment = new Comment();
                    Post post = posts.get(rand.nextInt(posts.size()));
                    User commenter = users.get(rand.nextInt(users.size()));
                    comment.setPost(post);
                    comment.setUser(commenter);
                    comment.setContent("Comment " + (i + 1) + " on post " + post.getId());
                    comment.setCreatedAt(Instant.now().minusSeconds(rand.nextInt(100000)));
                    commentRepo.save(comment);
                }

                // 50 users follow 1-10 other users each
                for (int i = 0; i < 50; i++) {
                    User follower = users.get(i);
                    int follows = 1 + rand.nextInt(10);
                    for (int j = 0; j < follows; j++) {
                        User following = users.get(rand.nextInt(users.size()));
                        if (!follower.getId().equals(following.getId())) {
                            Follow follow = new Follow();
                            follow.setFollower(follower);
                            follow.setFollowingId(following.getId());
                            follow.setType("user");
                            followRepo.save(follow);
                        }
                    }
                }
            }
        };
    }
} 
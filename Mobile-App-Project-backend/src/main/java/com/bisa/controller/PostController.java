package com.bisa.controller;

import com.bisa.model.Post;
import com.bisa.repository.PostRepository;
import com.bisa.model.Comment;
import com.bisa.repository.CommentRepository;
import com.bisa.model.FactCheck;
import com.bisa.model.Share;
import com.bisa.repository.ShareRepository;
import com.bisa.dto.ShareRequest;
import com.bisa.service.FactCheckService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
import java.util.Map;

@RestController
@RequestMapping("/api/posts")
public class PostController {
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final ShareRepository shareRepository;
    private final FactCheckService factCheckService;

    public PostController(PostRepository postRepository, CommentRepository commentRepository, ShareRepository shareRepository, FactCheckService factCheckService) {
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;
        this.shareRepository = shareRepository;
        this.factCheckService = factCheckService;
    }

    @GetMapping
    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Post> getPostById(@PathVariable Long id) {
        return postRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Post createPost(@RequestBody Post post) {
        return postRepository.save(post);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Post> updatePost(@PathVariable Long id, @RequestBody Post postDetails) {
        Optional<Post> postOpt = postRepository.findById(id);
        if (postOpt.isEmpty()) return ResponseEntity.notFound().build();
        Post post = postOpt.get();
        post.setQuestion(postDetails.getQuestion());
        post.setAnswer(postDetails.getAnswer());
        post.setMediaUrl(postDetails.getMediaUrl());
        post.setMediaType(postDetails.getMediaType());
        post.setUpvotes(postDetails.getUpvotes());
        post.setShares(postDetails.getShares());
        post.setCreatedAt(postDetails.getCreatedAt());
        return ResponseEntity.ok(postRepository.save(post));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        if (!postRepository.existsById(id)) return ResponseEntity.notFound().build();
        postRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/upvote")
    public ResponseEntity<Post> upvotePost(@PathVariable Long id) {
        Optional<Post> postOpt = postRepository.findById(id);
        if (postOpt.isEmpty()) return ResponseEntity.notFound().build();
        Post post = postOpt.get();
        post.setUpvotes(post.getUpvotes() + 1);
        return ResponseEntity.ok(postRepository.save(post));
    }

    @PostMapping("/{id}/share")
    public ResponseEntity<Post> sharePost(@PathVariable Long id, @RequestBody(required = false) ShareRequest shareRequest) {
        Optional<Post> postOpt = postRepository.findById(id);
        if (postOpt.isEmpty()) return ResponseEntity.notFound().build();
        
        Post post = postOpt.get();
        post.setShares(post.getShares() + 1);
        Post savedPost = postRepository.save(post);
        
        // If share request details are provided, save the share record
        if (shareRequest != null) {
            Share share = new Share();
            share.setPost(savedPost);
            share.setShareType(shareRequest.getShareType() != null ? shareRequest.getShareType() : "unknown");
            share.setPlatform(shareRequest.getPlatform() != null ? shareRequest.getPlatform() : "app");
            share.setUserAgent(shareRequest.getUserAgent());
            shareRepository.save(share);
        }
        
        return ResponseEntity.ok(savedPost);
    }

    @PostMapping("/{id}/fact-check")
    public ResponseEntity<FactCheck> factCheckPost(@PathVariable Long id, @RequestParam(defaultValue = "system") String checkedBy) {
        Optional<Post> postOpt = postRepository.findById(id);
        if (postOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Post post = postOpt.get();
        FactCheck factCheck = factCheckService.performFactCheck(post, checkedBy);
        return ResponseEntity.ok(factCheck);
    }

    @GetMapping("/{id}/fact-check")
    public ResponseEntity<FactCheck> getLatestFactCheck(@PathVariable Long id) {
        Optional<Post> postOpt = postRepository.findById(id);
        if (postOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Optional<FactCheck> factCheck = factCheckService.getLatestFactCheck(postOpt.get());
        return factCheck.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/fact-check/history")
    public ResponseEntity<List<FactCheck>> getFactCheckHistory(@PathVariable Long id) {
        Optional<Post> postOpt = postRepository.findById(id);
        if (postOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        List<FactCheck> history = factCheckService.getFactCheckHistory(postOpt.get());
        return ResponseEntity.ok(history);
    }

    @GetMapping("/{id}/fact-check/status")
    public ResponseEntity<Map<String, Object>> getFactCheckStatus(@PathVariable Long id) {
        Optional<Post> postOpt = postRepository.findById(id);
        if (postOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Optional<FactCheck> latestCheck = factCheckService.getLatestFactCheck(postOpt.get());
        
        Map<String, Object> status = Map.of(
            "hasFactCheck", latestCheck.isPresent(),
            "lastChecked", latestCheck.map(FactCheck::getCheckedAt).orElse(null),
            "validityStatus", latestCheck.map(FactCheck::getValidityStatus).orElse("NOT_CHECKED"),
            "accuracyScore", latestCheck.map(FactCheck::getAccuracyScore).orElse(null),
            "confidenceLevel", latestCheck.map(FactCheck::getConfidenceLevel).orElse(null)
        );
        
        return ResponseEntity.ok(status);
    }

    @GetMapping("/{id}/shares")
    public ResponseEntity<List<Share>> getPostShares(@PathVariable Long id) {
        Optional<Post> postOpt = postRepository.findById(id);
        if (postOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        List<Share> shares = shareRepository.findByPostOrderBySharedAtDesc(postOpt.get());
        return ResponseEntity.ok(shares);
    }

    @GetMapping("/{id}/shares/stats")
    public ResponseEntity<Map<String, Object>> getShareStats(@PathVariable Long id) {
        Optional<Post> postOpt = postRepository.findById(id);
        if (postOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Post post = postOpt.get();
        long totalShares = shareRepository.countByPost(post);
        List<Object[]> shareTypeStats = shareRepository.getShareTypeStats(post);
        
        Map<String, Object> stats = Map.of(
            "totalShares", totalShares,
            "shareTypeStats", shareTypeStats,
            "postId", id
        );
        
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/{id}/comments")
    public ResponseEntity<List<Comment>> getCommentsForPost(@PathVariable Long id) {
        Optional<Post> postOpt = postRepository.findById(id);
        if (postOpt.isEmpty()) return ResponseEntity.notFound().build();
        List<Comment> comments = commentRepository.findByPost(postOpt.get());
        return ResponseEntity.ok(comments);
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<Comment> addCommentToPost(@PathVariable Long id, @RequestBody Comment comment) {
        Optional<Post> postOpt = postRepository.findById(id);
        if (postOpt.isEmpty()) return ResponseEntity.notFound().build();
        comment.setPost(postOpt.get());
        Comment saved = commentRepository.save(comment);
        return ResponseEntity.ok(saved);
    }
} 
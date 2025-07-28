import java.io.*;
import java.net.*;
import java.util.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class SimpleBackend {
    private static final int PORT = 8080;
    private static final String CONTEXT_PATH = "/api";
    
    // Simple in-memory storage
    private static Map<String, Object> users = new HashMap<>();
    private static Map<String, Object> questions = new HashMap<>();
    private static Map<String, Object> answers = new HashMap<>();
    private static Map<String, Object> comments = new HashMap<>();
    
    public static void main(String[] args) {
        System.out.println("🚀 Starting BISA Simple Backend...");
        System.out.println("📱 API will be available at: http://localhost:" + PORT + CONTEXT_PATH);
        System.out.println("🗄️ Using in-memory storage");
        System.out.println("");
        
        // Initialize some sample data
        initializeSampleData();
        
        try (ServerSocket serverSocket = new ServerSocket(PORT)) {
            System.out.println("✅ Server started successfully on port " + PORT);
            System.out.println("🔄 Waiting for connections...");
            System.out.println("");
            
            while (true) {
                Socket clientSocket = serverSocket.accept();
                new Thread(() -> handleRequest(clientSocket)).start();
            }
        } catch (IOException e) {
            System.err.println("❌ Error starting server: " + e.getMessage());
        }
    }
    
    private static void handleRequest(Socket clientSocket) {
        try (BufferedReader in = new BufferedReader(new InputStreamReader(clientSocket.getInputStream()));
             PrintWriter out = new PrintWriter(clientSocket.getOutputStream(), true)) {
            
            String requestLine = in.readLine();
            if (requestLine == null) return;
            
            String[] parts = requestLine.split(" ");
            String method = parts[0];
            String path = parts[1];
            
            System.out.println("📥 " + method + " " + path);
            
            // Parse headers
            Map<String, String> headers = new HashMap<>();
            String line;
            while ((line = in.readLine()) != null && !line.isEmpty()) {
                if (line.contains(":")) {
                    String[] header = line.split(":", 2);
                    headers.put(header[0].trim(), header[1].trim());
                }
            }
            
            // Handle different endpoints
            String response = handleEndpoint(method, path, headers, in);
            
            // Send response
            out.println("HTTP/1.1 200 OK");
            out.println("Content-Type: application/json");
            out.println("Access-Control-Allow-Origin: *");
            out.println("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
            out.println("Access-Control-Allow-Headers: Content-Type, Authorization");
            out.println("Content-Length: " + response.getBytes().length);
            out.println("");
            out.println(response);
            
        } catch (IOException e) {
            System.err.println("❌ Error handling request: " + e.getMessage());
        }
    }
    
    private static String handleEndpoint(String method, String path, Map<String, String> headers, BufferedReader in) {
        try {
            if (path.startsWith(CONTEXT_PATH + "/auth")) {
                return handleAuth(method, path, headers, in);
            } else if (path.startsWith(CONTEXT_PATH + "/users")) {
                return handleUsers(method, path, headers, in);
            } else if (path.startsWith(CONTEXT_PATH + "/questions")) {
                return handleQuestions(method, path, headers, in);
            } else if (path.startsWith(CONTEXT_PATH + "/answers")) {
                return handleAnswers(method, path, headers, in);
            } else if (path.startsWith(CONTEXT_PATH + "/comments")) {
                return handleComments(method, path, headers, in);
            } else {
                return createResponse("error", "Endpoint not found", null);
            }
        } catch (Exception e) {
            return createResponse("error", "Internal server error: " + e.getMessage(), null);
        }
    }
    
    private static String handleAuth(String method, String path, Map<String, String> headers, BufferedReader in) {
        if (method.equals("POST") && path.equals(CONTEXT_PATH + "/auth/signin")) {
            return createResponse("success", "Login successful", Map.of(
                "accessToken", "mock-jwt-token-" + System.currentTimeMillis(),
                "tokenType", "Bearer"
            ));
        } else if (method.equals("POST") && path.equals(CONTEXT_PATH + "/auth/signup")) {
            return createResponse("success", "User registered successfully", null);
        } else if (method.equals("GET") && path.equals(CONTEXT_PATH + "/auth/me")) {
            return createResponse("success", "Current user", Map.of(
                "id", 1,
                "name", "Demo User",
                "username", "demouser",
                "email", "demo@example.com",
                "bio", "Demo user for testing",
                "reputation", 100,
                "followers", 10,
                "following", 5,
                "isVerified", false
            ));
        }
        return createResponse("error", "Auth endpoint not found", null);
    }
    
    private static String handleUsers(String method, String path, Map<String, String> headers, BufferedReader in) {
        if (method.equals("GET") && path.matches(CONTEXT_PATH + "/users/\\d+")) {
            String userId = path.substring(path.lastIndexOf("/") + 1);
            return createResponse("success", "User found", Map.of(
                "id", Integer.parseInt(userId),
                "name", "Demo User",
                "username", "demouser",
                "email", "demo@example.com",
                "bio", "Demo user for testing",
                "reputation", 100,
                "followers", 10,
                "following", 5,
                "isVerified", false
            ));
        } else if (method.equals("PUT") && path.matches(CONTEXT_PATH + "/users/\\d+")) {
            return createResponse("success", "User updated successfully", null);
        }
        return createResponse("error", "Users endpoint not found", null);
    }
    
    private static String handleQuestions(String method, String path, Map<String, String> headers, BufferedReader in) {
        if (method.equals("GET") && path.equals(CONTEXT_PATH + "/questions")) {
            List<Map<String, Object>> questionsList = new ArrayList<>();
            for (int i = 1; i <= 5; i++) {
                questionsList.add(Map.of(
                    "id", i,
                    "title", "Sample Question " + i,
                    "content", "This is sample question content " + i,
                    "author", Map.of(
                        "id", 1,
                        "name", "Demo User",
                        "username", "demouser"
                    ),
                    "upvotes", 10 + i,
                    "downvotes", i,
                    "views", 50 + i * 10,
                    "isAnswered", i % 2 == 0,
                    "createdAt", LocalDateTime.now().minusDays(i).format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
                ));
            }
            return createResponse("success", "Questions retrieved", questionsList);
        } else if (method.equals("POST") && path.equals(CONTEXT_PATH + "/questions")) {
            return createResponse("success", "Question created successfully", Map.of("id", System.currentTimeMillis()));
        }
        return createResponse("error", "Questions endpoint not found", null);
    }
    
    private static String handleAnswers(String method, String path, Map<String, String> headers, BufferedReader in) {
        if (method.equals("GET") && path.matches(CONTEXT_PATH + "/questions/\\d+/answers")) {
            List<Map<String, Object>> answersList = new ArrayList<>();
            for (int i = 1; i <= 3; i++) {
                answersList.add(Map.of(
                    "id", i,
                    "content", "This is sample answer " + i,
                    "author", Map.of(
                        "id", 1,
                        "name", "Demo User",
                        "username", "demouser"
                    ),
                    "upvotes", 5 + i,
                    "downvotes", i - 1,
                    "isAccepted", i == 1,
                    "createdAt", LocalDateTime.now().minusHours(i).format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
                ));
            }
            return createResponse("success", "Answers retrieved", answersList);
        } else if (method.equals("POST") && path.matches(CONTEXT_PATH + "/questions/\\d+/answers")) {
            return createResponse("success", "Answer created successfully", Map.of("id", System.currentTimeMillis()));
        }
        return createResponse("error", "Answers endpoint not found", null);
    }
    
    private static String handleComments(String method, String path, Map<String, String> headers, BufferedReader in) {
        if (method.equals("GET") && path.matches(CONTEXT_PATH + "/questions/\\d+/comments")) {
            List<Map<String, Object>> commentsList = new ArrayList<>();
            for (int i = 1; i <= 2; i++) {
                commentsList.add(Map.of(
                    "id", i,
                    "content", "This is sample comment " + i,
                    "author", Map.of(
                        "id", 1,
                        "name", "Demo User",
                        "username", "demouser"
                    ),
                    "upvotes", 2 + i,
                    "downvotes", 0,
                    "createdAt", LocalDateTime.now().minusMinutes(i * 30).format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
                ));
            }
            return createResponse("success", "Comments retrieved", commentsList);
        } else if (method.equals("POST") && path.matches(CONTEXT_PATH + "/questions/\\d+/comments")) {
            return createResponse("success", "Comment created successfully", Map.of("id", System.currentTimeMillis()));
        }
        return createResponse("error", "Comments endpoint not found", null);
    }
    
    private static String createResponse(String status, String message, Object data) {
        Map<String, Object> response = new HashMap<>();
        response.put("status", status);
        response.put("message", message);
        response.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        if (data != null) {
            response.put("data", data);
        }
        return response.toString().replace("=", ":").replace(" ", "");
    }
    
    private static void initializeSampleData() {
        System.out.println("📊 Initializing sample data...");
        users.put("1", Map.of(
            "id", 1,
            "name", "Demo User",
            "username", "demouser",
            "email", "demo@example.com",
            "bio", "Demo user for testing",
            "reputation", 100,
            "followers", 10,
            "following", 5,
            "isVerified", false
        ));
        System.out.println("✅ Sample data initialized");
    }
} 
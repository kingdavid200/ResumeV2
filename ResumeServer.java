import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpContext;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.concurrent.Executors;

/**
 * A simple embedded HTTP server that serves the resume website and exposes
 * JSON APIs for the résumé data and a contact form endpoint. This server
 * uses only the standard JDK classes and can be started with
 * `java ResumeServer` from the command line. Static assets are served
 * from the ./resume_site directory.
 */
public class ResumeServer {
    public static void main(String[] args) throws IOException {
        int port = 8000;
        String webRoot = "resume_site";
        // Create the HTTP server
        HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);
        // Thread pool to handle requests concurrently
        server.setExecutor(Executors.newFixedThreadPool(10));
        // Context for static files and index
        server.createContext("/", new StaticFileHandler(webRoot));
        // API to return the résumé data as JSON
        server.createContext("/api/resume", exchange -> {
            try {
                if (!"GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                    exchange.sendResponseHeaders(405, -1);
                    return;
                }
                byte[] json = Files.readAllBytes(Paths.get(webRoot, "data.json"));
                Headers headers = exchange.getResponseHeaders();
                headers.add("Content-Type", "application/json; charset=UTF-8");
                headers.add("Access-Control-Allow-Origin", "*");
                exchange.sendResponseHeaders(200, json.length);
                try (OutputStream os = exchange.getResponseBody()) {
                    os.write(json);
                }
            } catch (IOException e) {
                exchange.sendResponseHeaders(500, -1);
            }
        });
        // API to handle contact form submissions
        server.createContext("/api/contact", exchange -> {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                // CORS preflight response
                Headers h = exchange.getResponseHeaders();
                h.add("Access-Control-Allow-Origin", "*");
                h.add("Access-Control-Allow-Methods", "POST, OPTIONS");
                h.add("Access-Control-Allow-Headers", "Content-Type");
                exchange.sendResponseHeaders(204, -1);
                return;
            }
            if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(405, -1);
                return;
            }
            try {
                // Read request body
                InputStream is = exchange.getRequestBody();
                byte[] body = is.readAllBytes();
                String payload = new String(body, StandardCharsets.UTF_8);
                // Basic validation to mitigate injection and spam attacks
                if (payload.length() > 5000 || payload.contains("<") || payload.toLowerCase().contains("<script")) {
                    String errorJson = "{\"status\":\"error\",\"message\":\"Invalid input\"}";
                    Headers headers = exchange.getResponseHeaders();
                    headers.add("Content-Type", "application/json; charset=UTF-8");
                    headers.add("Access-Control-Allow-Origin", "*");
                    exchange.sendResponseHeaders(400, errorJson.getBytes(StandardCharsets.UTF_8).length);
                    try (OutputStream os = exchange.getResponseBody()) {
                        os.write(errorJson.getBytes(StandardCharsets.UTF_8));
                    }
                    return;
                }
                // Log payload to console (for demonstration)
                System.out.println("Received contact message: " + payload);
                // Respond with success JSON
                String responseJson = "{\"status\":\"success\"}";
                Headers headers = exchange.getResponseHeaders();
                headers.add("Content-Type", "application/json; charset=UTF-8");
                headers.add("Access-Control-Allow-Origin", "*");
                exchange.sendResponseHeaders(200, responseJson.getBytes(StandardCharsets.UTF_8).length);
                try (OutputStream os = exchange.getResponseBody()) {
                    os.write(responseJson.getBytes(StandardCharsets.UTF_8));
                }
            } catch (IOException e) {
                exchange.sendResponseHeaders(500, -1);
            }
        });
        server.start();
        System.out.println("Resume server is running on http://localhost:" + port + "/");
    }
}

/**
 * Handler to serve static files from a given root directory. If the URI
 * resolves to a directory, index.html will be served. Content type is
 * guessed from file extensions, with UTF‑8 used for text files.
 */
class StaticFileHandler implements HttpHandler {
    private final Path root;
    StaticFileHandler(String rootDir) {
        this.root = Paths.get(rootDir).toAbsolutePath().normalize();
    }
    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String requested = exchange.getRequestURI().getPath();
        if (requested.equals("/")) {
            requested = "/index.html";
        }
        // Strip leading slash
        String relative = requested.startsWith("/") ? requested.substring(1) : requested;
        Path filePath = root.resolve(relative).normalize();
        // Prevent directory traversal attacks
        if (!filePath.startsWith(root) || !Files.exists(filePath) || Files.isDirectory(filePath)) {
            exchange.sendResponseHeaders(404, -1);
            return;
        }
        byte[] bytes = Files.readAllBytes(filePath);
        Headers headers = exchange.getResponseHeaders();
        headers.add("Content-Type", guessContentType(filePath));
        headers.add("Access-Control-Allow-Origin", "*");
        exchange.sendResponseHeaders(200, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        }
    }
    private String guessContentType(Path path) {
        String name = path.getFileName().toString().toLowerCase();
        if (name.endsWith(".html") || name.endsWith(".htm")) return "text/html; charset=UTF-8";
        if (name.endsWith(".css")) return "text/css; charset=UTF-8";
        if (name.endsWith(".js")) return "application/javascript; charset=UTF-8";
        if (name.endsWith(".json")) return "application/json; charset=UTF-8";
        if (name.endsWith(".png")) return "image/png";
        if (name.endsWith(".jpg") || name.endsWith(".jpeg")) return "image/jpeg";
        if (name.endsWith(".svg")) return "image/svg+xml";
        if (name.endsWith(".pdf")) return "application/pdf";
        return "application/octet-stream";
    }
}
package com.safe4all.servlets;

import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.safe4all.models.AuthResponse;
import com.safe4all.services.AuthenticationService;

@WebServlet("/PIP")
public class PIPServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private AuthenticationService authService;
    private ObjectMapper objectMapper;

    @Override
    public void init() throws ServletException {
        authService = new AuthenticationService();
        objectMapper = new ObjectMapper();
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        PrintWriter out = response.getWriter();
        
        try {
            String username = request.getParameter("username");
            String pin = request.getParameter("pin");
            String role = request.getParameter("role");
            String deviceId = request.getParameter("deviceId");
            
            AuthResponse authResponse = authService.authenticate(username, pin, role, deviceId);
            
            if (authResponse.isSuccess()) {
                HttpSession session = request.getSession(true);
                session.setAttribute("userId", authResponse.getUserId());
                session.setAttribute("role", role);
                session.setAttribute("deviceId", deviceId);
                
                response.setStatus(HttpServletResponse.SC_OK);
            } else {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            }
            
            String jsonResponse = objectMapper.writeValueAsString(authResponse);
            out.print(jsonResponse);
            
        } catch (Exception e) {
            AuthResponse errorResponse = new AuthResponse(false, "001", "Authentication failed: " + e.getMessage());
            String jsonResponse = objectMapper.writeValueAsString(errorResponse);
            out.print(jsonResponse);
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        } finally {
            out.flush();
        }
    }
}
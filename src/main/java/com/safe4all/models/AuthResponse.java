package com.safe4all.models;

public class AuthResponse {
    private boolean success;
    private String code;
    private String message;
    private String userId;
    private Output output;

    public AuthResponse() {}

    public AuthResponse(boolean success, String code, String message) {
        this.success = success;
        this.code = code;
        this.message = message;
        this.output = new Output(code, message);
    }

    public AuthResponse(boolean success, String userId, String code, String message) {
        this.success = success;
        this.userId = userId;
        this.code = code;
        this.message = message;
        this.output = new Output(code, message);
    }

    public static class Output {
        private String code;
        private String message;

        public Output() {}

        public Output(String code, String message) {
            this.code = code;
            this.message = message;
        }

        public String getCode() { return code; }
        public void setCode(String code) { this.code = code; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public Output getOutput() { return output; }
    public void setOutput(Output output) { this.output = output; }
}
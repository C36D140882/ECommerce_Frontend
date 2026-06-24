import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import {
  MailOutline,
  LockOutlined,
  Visibility,
  VisibilityOff,
  AdminPanelSettingsOutlined,
} from "@mui/icons-material";
import { API_URL } from "../../api/api";

export default function AdminLoginPage(): React.ReactElement {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch(`${API_URL}/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: identifier, password }),
      });
      const data = await response.json();
      if (response.ok && data.user.role === "Admin") {
        localStorage.setItem("adminSession", "active");
        localStorage.setItem(
          "userTokens",
          JSON.stringify({ access: data.access, refresh: data.refresh }),
        );
        localStorage.setItem("userData", JSON.stringify(data.user));
        localStorage.setItem("userSession", JSON.stringify(data.user));
        navigate("/admin/dashboard");
      } else if (response.ok && data.user.role !== "Admin") {
        setMessage("Access denied. Admin role required.");
      } else {
        setMessage(data.detail || data.error || "Invalid credentials.");
      }
    } catch (error) {
      setMessage("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#eef2f9",
        backgroundImage:
          "radial-gradient(circle at 20% 20%, #e0e7ff 0%, transparent 45%), radial-gradient(circle at 85% 80%, #dbeafe 0%, transparent 45%)",
        p: 3,
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 460,
          borderRadius: 5,
          boxShadow: "0 20px 45px rgba(30, 41, 59, 0.10)",
          border: "1px solid #eef1f6",
          p: { xs: 3.5, sm: 5 },
        }}
      >
        <Box component="form" onSubmit={handleSubmit}>
          {/* Icon + heading */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "#eff6ff",
                color: "#2563eb",
                mx: "auto",
                mb: 2,
              }}
            >
              <AdminPanelSettingsOutlined sx={{ fontSize: 30 }} />
            </Box>
            <Typography
              variant="h5"
              fontWeight={800}
              color="#0f172a"
              sx={{ mb: 0.75 }}
            >
              Admin Login
            </Typography>
            <Typography variant="body2" color="#64748b">
              Enter your credentials to access
              <br />
              the admin panel
            </Typography>
          </Box>

          {/* Email */}
          <Typography
            variant="body2"
            fontWeight={700}
            color="#1e293b"
            sx={{ mb: 1 }}
          >
            Email Address
          </Typography>
          <TextField
            placeholder="Enter your email address"
            type="email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            fullWidth
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MailOutline sx={{ fontSize: 20, color: "#94a3b8" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 2.5,
              "& .MuiOutlinedInput-root": {
                bgcolor: "#f8fafc",
                borderRadius: 3,
                "& fieldset": { borderColor: "#e2e8f0" },
                "&:hover fieldset": { borderColor: "#cbd5e1" },
                "&.Mui-focused fieldset": { borderColor: "#2563eb" },
              },
            }}
          />

          {/* Password */}
          <Typography
            variant="body2"
            fontWeight={700}
            color="#1e293b"
            sx={{ mb: 1 }}
          >
            Password
          </Typography>
          <TextField
            placeholder="Enter your password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlined sx={{ fontSize: 20, color: "#94a3b8" }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                    size="small"
                    aria-label="toggle password visibility"
                  >
                    {showPassword ? (
                      <VisibilityOff sx={{ fontSize: 20, color: "#94a3b8" }} />
                    ) : (
                      <Visibility sx={{ fontSize: 20, color: "#94a3b8" }} />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 3,
              "& .MuiOutlinedInput-root": {
                bgcolor: "#f8fafc",
                borderRadius: 3,
                "& fieldset": { borderColor: "#e2e8f0" },
                "&:hover fieldset": { borderColor: "#cbd5e1" },
                "&.Mui-focused fieldset": { borderColor: "#2563eb" },
              },
            }}
          />

          {/* Submit button */}
          <Button
            type="submit"
            disabled={loading}
            variant="contained"
            fullWidth
            sx={{
              py: 1.5,
              borderRadius: 3,
              textTransform: "none",
              fontWeight: 700,
              fontSize: "0.95rem",
              background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
              boxShadow: "0 10px 20px rgba(37, 99, 235, 0.25)",
              "&:hover": {
                background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
                boxShadow: "0 12px 24px rgba(37, 99, 235, 0.32)",
              },
            }}
          >
            {loading ? "Authenticating..." : "Login to Dashboard"}
          </Button>

          {message && (
            <Alert severity="error" sx={{ mt: 2.5, borderRadius: 2 }}>
              {message}
            </Alert>
          )}
        </Box>
      </Card>
    </Box>
  );
}

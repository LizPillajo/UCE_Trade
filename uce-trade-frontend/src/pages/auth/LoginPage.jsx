import { useState } from "react";
import { Typography, Box, Link, Alert, Divider, Stack } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import SchoolIcon from "@mui/icons-material/School";
import GoogleIcon from "@mui/icons-material/Google";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import AuthSplitLayout from "../../components/layout/AuthSplitLayout";

import { useAuthStore } from "../../store/authStore";

import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../services/firebase";
import { authenticateWithMS1 } from "../../services/authService";
import { signInWithEmailAndPassword } from "firebase/auth";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data) => {
    setServerError("");
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password,
      );
      const token = await userCredential.user.getIdToken();

      const ms1User = await authenticateWithMS1(token);

      login({
        uid: ms1User.uid,
        name: ms1User.fullName,
        role: ms1User.role,
        email: ms1User.email,
        faculty: ms1User.faculty,
      }, token);

      const redirectPath =
        ms1User.role === "UCE_ADMIN"
          ? "/admin/dashboard"
          : ms1User.role === "UCE_STUDENT"
            ? "/student/dashboard"
            : "/explore";
      navigate(redirectPath);
    } catch (error) {
      console.error(error);
      setServerError("Credenciales incorrectas o usuario no registrado.");
    }
  };

  const handleFirebaseLogin = async () => {
    try {
      setServerError('');
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      
      const ms1User = await authenticateWithMS1(token); 
      
      login({
          uid: ms1User.uid,
          name: ms1User.fullName || result.user.displayName, 
          role: ms1User.role, 
          email: ms1User.email, 
          avatar: result.user.photoURL,
          faculty: ms1User.faculty
      }, token);
      
      const redirectPath = ms1User.role === 'UCE_ADMIN' ? "/admin/dashboard" : (ms1User.role === 'UCE_STUDENT' ? "/student/dashboard" : "/explore");
      navigate(redirectPath);
    } catch (err) {
      console.error(err);
      setServerError("Error al iniciar sesión con Google.");
    }
  };

  const handleQuickTest = (role) => {
    if (role === "admin") {
      setValue("email", "admin@uce.edu.ec");
      setValue("password", "123");
    } else {
      setValue("email", "ldpillajo@uce.edu.ec");
      setValue("password", "secretPassword123");
    }
  };

  return (
    <AuthSplitLayout
      panelPosition="right"
      title="Connect with UCE talent"
      subtitle="Access hundreds of services and products offered by students at the Central University of Ecuador."
    >
      <Box display="flex" alignItems="center" mb={4}>
        <SchoolIcon sx={{ color: "#efb034", mr: 1.5, fontSize: 32 }} />
        <Typography variant="h6" fontWeight="bold" color="#0d2149">
          UCE Trade
        </Typography>
      </Box>

      <Typography variant="h4" fontWeight="bold" color="#0d2149" gutterBottom>
        Welcome back
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Enter your credentials or use Google.
      </Typography>

      {serverError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {serverError}
        </Alert>
      )}

      <Button
        variant="outlined"
        fullWidth
        startIcon={<GoogleIcon />}
        onClick={handleFirebaseLogin}
        disabled={isSubmitting}
        sx={{ mb: 3 }}
      >
        Continue with Google
      </Button>

      <Box display="flex" alignItems="center" mb={3}>
        <Divider sx={{ flexGrow: 1 }} />
        <Typography variant="caption" color="text.secondary" sx={{ mx: 2 }}>
          OR
        </Typography>
        <Divider sx={{ flexGrow: 1 }} />
      </Box>

      {/* Formulario conectado a RHF */}
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Institutional Email"
          placeholder="student@uce.edu.ec"
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          {...register("password")}
          error={!!errors.password}
          helperText={errors.password?.message}
        />

        <Box textAlign="right" mb={3}>
          <Link
            component="button"
            type="button"
            variant="body2"
            underline="hover"
            sx={{ color: "#3b82f6", fontWeight: 500 }}
          >
            Forgot your password?
          </Link>
        </Box>

        <Button
          type="submit"
          variant="contained"
          color="secondary"
          fullWidth
          size="large"
          disabled={isSubmitting}
          sx={{ py: 1.5, mb: 3 }}
        >
          {isSubmitting ? "Logging in..." : "Log in"}
        </Button>

        <Typography variant="body2" textAlign="center" color="text.secondary">
          Don't have an account?{" "}
          <Link
            component={RouterLink}
            to="/register"
            fontWeight="bold"
            sx={{ color: "#3b82f6" }}
          >
            Register here
          </Link>
        </Typography>
      </Box>

      {/* Testing Buttons */}
      <Stack direction="row" spacing={2} justifyContent="center" mt={4}>
        <Button
          size="small"
          onClick={() => handleQuickTest("student")}
          variant="outlined"
        >
          Fill Student
        </Button>
        <Button
          size="small"
          onClick={() => handleQuickTest("admin")}
          variant="outlined"
          color="secondary"
        >
          Fill Admin
        </Button>
      </Stack>
    </AuthSplitLayout>
  );
};

export default LoginPage;

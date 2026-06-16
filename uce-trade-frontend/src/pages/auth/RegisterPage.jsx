import { useState } from "react";
import { Typography, Box, Link, Divider, Alert } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import SchoolIcon from "@mui/icons-material/School";
import GoogleIcon from "@mui/icons-material/Google";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";

import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import FacultySelect from "../../components/common/FacultySelect";
import AuthSplitLayout from "../../components/layout/AuthSplitLayout";

import { useAuthStore } from "../../store/authStore";
import { authenticateWithMS1 } from "../../services/authService";
import { updateUserProfile } from "../../services/userService";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, googleProvider } from "../../services/firebase";
import { signInWithPopup } from "firebase/auth";

const registerSchema = z
  .object({
    fullName: z.string().min(3, "Full name is required"),
    email: z.string().email("Invalid email format"),
    faculty: z.string().min(1, "Select a faculty or option"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const RegisterPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { faculty: "" },
  });

  const onSubmit = async (data) => {
    setServerError("");
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password,
      );
      const token = await userCredential.user.getIdToken();
  
      const ms1User = await authenticateWithMS1(token);

      await updateUserProfile(ms1User.uid, {
        fullName: data.fullName,
        faculty: data.faculty,
      });

      toast.success("Account created successfully! Please log in. 🎉");
      navigate("/login");
    } catch (err) {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        setServerError("The email is already in use. Please use a different email.");
      } else {
        setServerError("An error occurred while creating the account. Please try again later.");
      }
    }
  };

  const handleFirebaseSignUp = async () => {
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
      });
      
      const path = ms1User.role === 'UCE_ADMIN' ? '/admin/dashboard' : (ms1User.role === 'UCE_STUDENT' ? '/student/dashboard' : '/explore');
      navigate(path);
  
    } catch (err) {
      console.error(err);
      if (err.code !== 'auth/popup-closed-by-user') {
         setServerError("Error al registrarse con Google.");
      }
    }
  };

  return (
    <AuthSplitLayout
      panelPosition="left"
      title="Start your business venture"
      subtitle="Join the community of university entrepreneurs and grow your business with the support of the UCE."
    >
      <Box display="flex" alignItems="center" mb={2}>
        <SchoolIcon sx={{ color: "#efb034", mr: 1.5, fontSize: 28 }} />
        <Typography variant="h6" fontWeight="bold" color="#0d2149">
          UCE Market
        </Typography>
      </Box>

      <Typography variant="h4" fontWeight="bold" color="#0d2149" gutterBottom>
        Create your account
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Sign up to publish your services
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
        onClick={handleFirebaseSignUp}
        sx={{ mb: 3, bgcolor: "#f3f4f6" }}
      >
        Sign up with Google
      </Button>

      <Box display="flex" alignItems="center" mb={3}>
        <Divider sx={{ flexGrow: 1 }} />
        <Typography variant="caption" color="text.secondary" sx={{ mx: 2 }}>
          OR
        </Typography>
        <Divider sx={{ flexGrow: 1 }} />
      </Box>

      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Full Name"
          placeholder="Liz Pillajo"
          {...register("fullName")}
          error={!!errors.fullName}
          helperText={errors.fullName?.message}
        />

        <Input
          label="Email"
          placeholder="student@uce.edu.ec"
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
        />

        {/* AQUÍ ESTÁ EL CAMBIO IMPORTANTE: COMPONENTE REUTILIZABLE */}
        <FacultySelect register={register} errors={errors} />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          {...register("password")}
          error={!!errors.password}
          helperText={errors.password?.message}
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          {...register("confirmPassword")}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
        />

        <Button
          type="submit"
          variant="contained"
          color="secondary"
          fullWidth
          size="large"
          disabled={isSubmitting}
          sx={{ py: 1.5, mt: 2, mb: 3 }}
        >
          {isSubmitting ? "Creating..." : "Create Account"}
        </Button>

        <Typography variant="body2" textAlign="center" color="text.secondary">
          Do you already have an account?{" "}
          <Link
            component={RouterLink}
            to="/login"
            fontWeight="bold"
            sx={{ color: "#3b82f6" }}
          >
            Enter here
          </Link>
        </Typography>
      </Box>
    </AuthSplitLayout>
  );
};

export default RegisterPage;

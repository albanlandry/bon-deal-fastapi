"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Box,
    Button,
    Input,
    Alert,
    VStack,
    Heading,
} from "@chakra-ui/react";
import { FormControl, FormLabel } from "@chakra-ui/form-control";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleResetRequest = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);

        const res = await fetch("http://localhost:8000/auth/forgot-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });

        setLoading(false);

        if (res.ok) {
            setMessage("If this email is registered, a reset link has been sent.");
        } else {
            setMessage("Something went wrong. Try again.");
        }
    };

    return (
        <Box className="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow-lg">
            <Heading size="lg" textAlign="center" className="mb-6 text-blue-500">
                Forgot Password?
            </Heading>

            {message && (
                <Alert status="info" className="mb-4">
                    <Alert.Indicator />
                    {message}
                </Alert>
            )}

            <form onSubmit={handleResetRequest}>
                <VStack gap={4}>
                    <FormControl isRequired>
                        <FormLabel>Email Address</FormLabel>
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border-gray-300 focus:ring focus:ring-blue-300"
                        />
                    </FormControl>

                    <Button type="submit" colorScheme="blue" width="full" isLoading={loading}>
                        {loading ? "Sending..." : "Reset Password"}
                    </Button>
                </VStack>
            </form>
        </Box>
    );
}
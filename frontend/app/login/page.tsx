"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Box,
    Button,
    Input,
    Alert,
    VStack,
    Heading,
    Link,
    Spinner,
} from "@chakra-ui/react";
import { FormControl, FormLabel } from "@chakra-ui/form-control";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Redirect to home if user is already logged in
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            router.push("/");
        }
    }, [router]);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const body = new URLSearchParams({ username, password });
        const res = await fetch("http://localhost:8000/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: body.toString(),
        });

        setLoading(false);

        if (res.ok) {
            const data = await res.json();
            if (data.access_token) {
                localStorage.setItem("token", data.access_token);
                router.push("/");
            }
        } else {
            setError("Invalid username or password.");
        }
    };

    return (
        <Box className="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow-lg">
            <Heading size="lg" textAlign="center" className="mb-6 text-blue-500">
                Login to Marketplace
            </Heading>

            {error && (
                <Alert status="error" className="mb-4">
                    <Alert.Indicator />
                    {error}
                </Alert>
            )}

            <form onSubmit={handleLogin}>
                <VStack gap={4}>
                    <FormControl isRequired>
                        <FormLabel>Username</FormLabel>
                        <Input
                            type="text"
                            placeholder="Enter username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="border-gray-300 focus:ring focus:ring-blue-300"
                        />
                    </FormControl>

                    <FormControl isRequired>
                        <FormLabel>Password</FormLabel>
                        <Input
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border-gray-300 focus:ring focus:ring-blue-300"
                        />
                    </FormControl>

                    <Button type="submit" colorScheme="blue" width="full" isLoading={loading}>
                        {loading ? <Spinner size="sm" /> : "Login"}
                    </Button>

                    <Link href="/forgot-password" className="text-blue-500 hover:underline text-sm">
                        Forgot Password?
                    </Link>
                </VStack>
            </form>
        </Box>
    );
}

// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { Box, Button, Input, FormControl, FormLabel, FormErrorMessage, VStack, Heading, Alert, AlertIcon } from "@chakra-ui/react";

// export default function LoginPage() {
//     const [username, setUsername] = useState("");
//     const [password, setPassword] = useState("");
//     const [error, setError] = useState("");
//     const router = useRouter();

//     const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
//         e.preventDefault();
//         setError("");

//         const body = new URLSearchParams({ username, password });
//         const res = await fetch("http://localhost:8000/auth/login", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/x-www-form-urlencoded",
//             },
//             body: body.toString(),
//         });

//         if (res.ok) {
//             const data = await res.json();
//             if (data.access_token) {
//                 localStorage.setItem("token", data.access_token);
//                 router.push("/");
//             }
//         } else {
//             setError("Invalid username or password.");
//         }
//     };

//     return (
//         <Box className="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow-lg">
//             <Heading size="lg" textAlign="center" className="mb-6 text-blue-500">
//                 Login to Marketplace
//             </Heading>

//             {error && (
//                 <Alert status="error" className="mb-4">
//                     <AlertIcon />
//                     {error}
//                 </Alert>
//             )}

//             <form onSubmit={handleLogin}>
//                 <VStack gap={4}>
//                     <FormControl isRequired>
//                         <FormLabel>Username</FormLabel>
//                         <Input
//                             type="text"
//                             placeholder="Enter username"
//                             value={username}
//                             onChange={(e) => setUsername(e.target.value)}
//                             className="border-gray-300 focus:ring focus:ring-blue-300"
//                         />
//                     </FormControl>

//                     <FormControl isRequired>
//                         <FormLabel>Password</FormLabel>
//                         <Input
//                             type="password"
//                             placeholder="Enter password"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             className="border-gray-300 focus:ring focus:ring-blue-300"
//                         />
//                     </FormControl>

//                     <Button type="submit" colorScheme="blue" width="full">
//                         Login
//                     </Button>
//                 </VStack>
//             </form>
//         </Box>
//     );
// }

// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";

// export default function SignupPage() {
//     const [username, setUsername] = useState("");
//     const [password, setPassword] = useState("");
//     const [confirmPassword, setConfirmPassword] = useState("");
//     const [city, setCity] = useState("");
//     const [error, setError] = useState("");
//     const router = useRouter();

//     const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
//         e.preventDefault();
//         setError(""); // Reset error

//         if (password !== confirmPassword) {
//             setError("Passwords do not match.");
//             return;
//         }

//         if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)) {
//             setError("Password must be at least 8 characters and contain a letter and a number.");
//             return;
//         }

//         const res = await fetch("http://localhost:8000/auth/signup", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ username, password, confirm_password: confirmPassword, city }),
//         });

//         if (res.ok) {
//             router.push("/login");
//         } else {
//             const data = await res.json();
//             setError(data.detail);
//         }
//     };

//     return (
//         <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
//             <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
//             {error && <p className="text-red-500">{error}</p>}
//             <form onSubmit={handleSignup} className="space-y-4">
//                 <input
//                     type="text"
//                     placeholder="Username"
//                     value={username}
//                     onChange={(e) => setUsername(e.target.value)}
//                     className="w-full p-2 border rounded"
//                     required
//                 />
//                 <input
//                     type="password"
//                     placeholder="Password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     className="w-full p-2 border rounded"
//                     required
//                 />
//                 <input
//                     type="password"
//                     placeholder="Confirm Password"
//                     value={confirmPassword}
//                     onChange={(e) => setConfirmPassword(e.target.value)}
//                     className="w-full p-2 border rounded"
//                     required
//                 />
//                 <input
//                     type="text"
//                     placeholder="City"
//                     value={city}
//                     onChange={(e) => setCity(e.target.value)}
//                     className="w-full p-2 border rounded"
//                     required
//                 />
//                 <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
//                     Sign Up
//                 </button>
//             </form>
//         </div>
//     );
// }
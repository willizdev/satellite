"use client";

import { LoaderIcon } from "@/components/loaderIcon";
import { useToast } from "@/components/toastProvider";
import { randomInt } from "@/utils/math";
import { trpc } from "@/utils/trpc";
import { Eye, EyeOff, LogIn } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";

export default function Signup() {
    const { push } = useRouter();
    const [logged, setLogged] = useState<boolean>(false);

    useEffect(() => {
        if (logged) {
            push("/app");
        }
    }, [logged, push]);

    const { mutateAsync: signup } = trpc.auth.signup.useMutation();
    const { showToast } = useToast();

    const [loading, setLoading] = useState<boolean>(false);
    const [focus, setFocus] = useState<string>("name");

    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const confirmPasswordRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        switch (focus) {
            case "name":
                nameRef.current?.focus();
                break;
            case "email":
                emailRef.current?.focus();
                break;
            case "password":
                passwordRef.current?.focus();
                break;
            case "confirmPassword":
                confirmPasswordRef.current?.focus();
                break;
        }
    }, [focus]);

    const handleSignup = () => {
        setLoading(true);

        if (nameRef.current?.value.length === 0) {
            setFocus("name");
            setLoading(false);
            return;
        }

        try {
            z.string().min(3).max(32).parse(nameRef.current?.value);
        } catch (_) {
            showToast("Name must be between 3-32 characters");
            setFocus("name");
            setLoading(false);
            return;
        }

        try {
            z.string()
                .regex(/^[a-zA-Z\s]+$/)
                .parse(nameRef.current?.value);
        } catch (_) {
            showToast("Name must contain letters and spaces only");
            setFocus("name");
            setLoading(false);
            return;
        }

        if (emailRef.current?.value.length === 0) {
            setFocus("email");
            setLoading(false);
            return;
        }

        try {
            z.string().email().parse(emailRef.current?.value);
        } catch (_) {
            showToast("Invalid email");
            setFocus("email");
            setLoading(false);
            return;
        }

        if (passwordRef.current?.value.length === 0) {
            setFocus("password");
            setLoading(false);
            return;
        }

        try {
            z.string().min(8).max(64).parse(passwordRef.current?.value);
        } catch (_) {
            showToast("Password must be between 8-64 characters");
            setFocus("password");
            setLoading(false);
            return;
        }

        if (confirmPasswordRef.current?.value.length === 0) {
            setFocus("confirmPassword");
            setLoading(false);
            return;
        }

        if (passwordRef.current?.value !== confirmPasswordRef.current?.value) {
            showToast("Password doesn't match");
            setFocus("confirmPassword");
            setLoading(false);
            return;
        }

        signup({
            name: nameRef.current?.value ?? "",
            email: emailRef.current?.value ?? "",
            password: passwordRef.current?.value ?? ""
        })
            .then(() => {
                setLogged(true);
            })
            .catch((err) => {
                showToast(err.toString());
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        const nextStepHandler = (event: {
            key: string;
            preventDefault: () => void;
        }) => {
            if (event.key === "Enter") {
                event.preventDefault();
                handleSignup();
            }
        };
        document.addEventListener("keydown", nextStepHandler);
        return () => {
            document.removeEventListener("keydown", nextStepHandler);
        };
    });

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

    const backgrounds = [
        `bg-[url("/backgrounds/1.svg")]`,
        `bg-[url("/backgrounds/2.svg")]`,
        `bg-[url("/backgrounds/3.svg")]`,
        `bg-[url("/backgrounds/4.svg")]`,
        `bg-[url("/backgrounds/5.svg")]`,
        `bg-[url("/backgrounds/6.svg")]`,
        `bg-[url("/backgrounds/7.svg")]`,
        `bg-[url("/backgrounds/8.svg")]`,
        `bg-[url("/backgrounds/9.svg")]`,
        `bg-[url("/backgrounds/10.svg")]`
    ];

    const [backgroundId, setBackgroundId] = useState<number | null>(null);

    useEffect(() => {
        const rand = randomInt(0, 9);
        setBackgroundId(rand);
    }, []);

    if (backgroundId == null) return null;

    return (
        <div
            className={`min-h-screen w-full ${backgrounds[backgroundId]} bg-cover bg-no-repeat bg-center`}
        >
            <div className="min-h-screen w-full flex items-center justify-center p-[5em]">
                <div className="w-full max-w-[500px] sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px] bg-white shadow-xl rounded-2xl flex flex-col items-center justify-center px-[4em] py-[5em]">
                    <div className="flex items-center justify-center w-full mb-6">
                        <Image src="/satellite_media.svg" alt="satellite" width={40} height={40} />
                        <p className="ml-3 text-xl sm:text-2xl font-medium">
                            <span className="text-[#0076ea]">Satellite</span>
                            <span className="text-[#2C97FF]"> • Signup</span>
                        </p>
                    </div>
                    <div className="w-full space-y-5">
                        <div>
                            <label className="block text-left font-[400] text-base mb-1">
                                Name
                            </label>
                            <input
                                ref={nameRef}
                                type="text"
                                autoFocus={focus === "name"}
                                className="h-12 w-full px-4 border-2 border-[#222] focus:border-[#2C97FF] transition duration-300 rounded-lg shadow-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-left font-[400] text-base mb-1">
                                Email
                            </label>
                            <input
                                ref={emailRef}
                                type="text"
                                autoFocus={focus === "email"}
                                className="h-12 w-full px-4 border-2 border-[#222] focus:border-[#2C97FF] transition duration-300 rounded-lg shadow-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-left font-[400] text-base mb-1">
                                Password
                            </label>
                            <div className="relative w-full">
                                <input
                                    ref={passwordRef}
                                    type={showPassword ? "text" : "password"}
                                    autoFocus={focus === "password"}
                                    className="h-12 w-full pr-12 pl-4 border-2 border-[#222] focus:border-[#2C97FF] transition duration-300 rounded-lg shadow-lg"
                                />
                                <div
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#222] cursor-pointer"
                                    onClick={() => {
                                        setShowPassword(!showPassword);
                                    }}
                                >
                                    {showPassword ? <EyeOff /> : <Eye />}
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-left font-[400] text-base mb-1">
                                Confirm password
                            </label>
                            <div className="relative w-full">
                                <input
                                    ref={confirmPasswordRef}
                                    type={showConfirmPassword ? "text" : "password"}
                                    autoFocus={focus === "confirmPassword"}
                                    className="h-12 w-full pr-12 pl-4 border-2 border-[#222] focus:border-[#2C97FF] transition duration-300 rounded-lg shadow-lg"
                                />
                                <div
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#222] cursor-pointer"
                                    onClick={() => {
                                        setShowConfirmPassword(!showConfirmPassword);
                                    }}
                                >
                                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                                </div>
                            </div>
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="h-12 w-full bg-[#2C97FF] text-white font-medium cursor-pointer rounded-lg shadow-lg hover:opacity-95 transition duration-300 flex items-center justify-center gap-2"
                                onClick={handleSignup}
                            >
                                {loading ? <LoaderIcon /> : <LogIn className="h-5 w-5" />}
                                Sign Up
                            </button>
                        </div>
                        <div>
                            <p>
                                Already have an account?{" "}
                                <a href="/user/signin" className="text-[#2C97FF] font-[500]">
                                    Sign in
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

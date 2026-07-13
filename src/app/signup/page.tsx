"use client";

import { useState } from 'react';
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Card, Form, TextField, Input, Label, Button, FieldError } from "@heroui/react"; 
import { FaCamera, FaEye, FaEyeSlash, FaUser } from "react-icons/fa";
import { Check } from "@gravity-ui/icons";
import { authClient } from "@/lib/auth-client";
import { uploadImage } from "../../utils/uploadImage";

const SignUp = () => {
    const router = useRouter();
    const [preview, setPreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const user = {
            name: formData.get("name")?.toString() ?? "",
            email: formData.get("email")?.toString() ?? "",
            password: formData.get("password")?.toString() ?? "",
            confirm_password: formData.get("confirm_password")?.toString() ?? "",
        };

        if (user.password !== user.confirm_password) {
            toast.error("Passwords do not match!");
            setLoading(false);
            return;
        }

        try {
            let imageUrl = "";
            if (imageFile) {
                try {
                    const uploadedImageUrl = await uploadImage(imageFile);
                    if (!uploadedImageUrl) {
                        toast.error("Image upload failed!");
                        setLoading(false);
                        return;
                    }
                    imageUrl = uploadedImageUrl;
                } catch (uploadErr) {
                    toast.error("Image upload failed!");
                    setLoading(false);
                    return;
                }
            } else {
                toast.error("Please upload an avatar first");
                setLoading(false);
                return;
            }

            const { data, error } = await authClient.signUp.email({
                name: user.name,
                email: user.email,
                image: imageUrl,
                password: user.password,
                callbackURL: "/signin",
            });
            console.log("signup data:", data);
            if (error) {
                toast.error(error.message || "Sign up failed!");
                setLoading(false);
                return;
            }

            await authClient.signOut();
            toast.success("✅ Sign Up Successful");
            router.push("/signin");
        } catch (err) {
            toast.error("❌ Sign Up Failed!");
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen py-12 px-4 flex items-center justify-center">
<Card className="w-full max-w-xl bg-slate-700 border border-white/5 py-8 px-6 sm:px-8 shadow-2xl rounded-2xl">
<h1 className="text-center text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-500 mb-2">Sign Up</h1>


                <Form onSubmit={onSubmit} className="flex w-full flex-col gap-5">
                    
                    {/* Image Profile Upload */}
                    <div className="flex flex-col items-center gap-3 mb-4 w-full">
                        <div className="relative">
<div className="w-24 h-24 rounded-full overflow-hidden border-2 border-cyan-500 shadow-lg bg-slate-700">
                                {preview ? (
<img src={preview} alt="Profile Preview" className="w-full h-full object-cover" />
                                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                                        <FaUser size={32} />
                                    </div>
                                )}
                            </div>
<label htmlFor="image" className="absolute bottom-0 right-0 bg-cyan-500 hover:bg-cyan-600 text-white p-2 rounded-full cursor-pointer shadow-lg transition">
                                <FaCamera size={12} />
                            </label>
                        </div>
<input id="image" name="image" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                        <p className="text-xs text-slate-400">Upload your profile picture</p>
                    </div>

                    {/* Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <TextField isRequired name="name" type="text" className="dark">
                            <Label className="text-slate-300 text-xs font-semibold">Name</Label>
                            <Input placeholder="Enter your name" className="bg-slate-950/50" />
                            <FieldError className="text-xs text-red-400" />
                        </TextField>

                        <TextField isRequired name="email" type="email" className="dark">
                            <Label className="text-slate-300 text-xs font-semibold">Email</Label>
                            <Input placeholder="Enter your email" className="bg-slate-950/50" />
                            <FieldError className="text-xs text-red-400" />
                        </TextField>
                    </div>

                    {/* Passwords */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
<TextField isRequired name="password" type={isShowPassword ? "text" : "password"} className="dark">
                            <Label className="text-slate-300 text-xs font-semibold">Password</Label>
                            <div className="relative">
                                <Input placeholder="Enter your password" className="bg-slate-950/50" />
<button type="button" onClick={() => setIsShowPassword(!isShowPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 z-10 text-slate-400">
                                    {isShowPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </TextField>

<TextField isRequired name="confirm_password" type={isShowConfirmPassword ? "text" : "password"} className="dark">
                <Label className="text-slate-300 text-xs font-semibold">Confirm Password</Label>
                            <div className="relative">
                 <Input placeholder="Re-enter your password" className="bg-slate-950/50" />
<button type="button" onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 z-10 text-slate-400">
                                    {isShowConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </TextField>
                    </div>

                    <div className="flex gap-3 mt-4">
<Button className='flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold h-11 rounded-xl shadow-lg' type="submit" isDisabled={loading}>
                            <Check /> {loading ? "Signing Up..." : "SignUp"}
                        </Button>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default SignUp;
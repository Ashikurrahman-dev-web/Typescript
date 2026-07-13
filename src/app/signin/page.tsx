"use client";
import {Check} from "@gravity-ui/icons";
import {Button, FieldError, Form, Input, Label, TextField,Card} from "@heroui/react";
import { FormEvent, useState } from 'react';
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import {FaEye, FaEyeSlash } from "react-icons/fa";

const SignIn = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
 const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  const formData = new FormData(e.currentTarget);
  const user = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };
  
  try {
      const { data, error } =
        await authClient.signIn.email({
          email: user.email,
          password: user.password,
          callbackURL: "/",
        });
        console.log("DATA:", data);
console.log("ERROR:", error);
      if (error) {
        toast.error(error.message || "Sign in failed");
        setLoading(false)
        return;
      }
toast.success("✅ Sign In Successful!");
router.push("/");
 } catch (err) {
      toast.error("❌ Sign In Failed!");
      console.log(err);
    }
 };  
 
const [isShowPassword, setIsShowPassword] = useState(false);
    return (
      <div className="min-h-screen py-12 px-4 flex items-center justify-center">
<Card className="w-full max-w-xl bg-slate-700 border border-white/5 py-8 px-6 sm:px-8 shadow-2xl rounded-2xl">
<h1 className="text-center text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-400 mb-2">Sign In</h1>
                     <Form onSubmit={onSubmit} className="flex w-full flex-col gap-5">
                          <TextField isRequired name="email" type="email" className="dark">
                                  <Label className="text-slate-300 text-xs font-semibold">Email</Label>
                                  <Input placeholder="Enter your email" className="bg-slate-950/50" />
                                  <FieldError className="text-xs text-red-400" />
                              </TextField>
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
      
                              
                          </div>
      
                          <div className="flex gap-3 mt-4">
  <Button className='flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold h-11 rounded-xl shadow-lg' type="submit" isDisabled={loading}>
                              <Check /> {loading ? "Signing In..." : "SignIn"}
                              </Button>
                          </div>
                      </Form>
                  </Card>
              </div>
    );
};

export default SignIn;
"use client";
import AuthButton from "@/components/AuthButton";
import { useSession } from "next-auth/react";
export default function Login (){
    const { data: session } = useSession();
    // console.log(session);
    return (
        <AuthButton />
    )
}
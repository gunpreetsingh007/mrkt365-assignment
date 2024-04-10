import { useRouter } from "next/router";
import type { FormEvent } from "react";
import { useCallback } from "react";
import { useEffect, useState } from "react";
import ActionButton from "~/components/ActionButton";
import InputField from "~/components/InputField"
import FormTitle from "~/components/FormTitle";
import { useAuth } from "~/utils/auth";


export default function Signup() {
    const router = useRouter();
    const { signUp, isSignUpSuccess, signUpError, isSigningUp, currentUser } = useAuth();
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const onSubmit = useCallback(async (e: FormEvent) => {
        e.preventDefault();
        try {
            signUp({ email, password, name });
        }
        catch (e) {
        }
    }, [email, password, name, signUp]);

    useEffect(() => {
        if (currentUser) {
            router.push("/mark-interests?page=1").catch(console.error);
        }
    }, [currentUser, router]);

    useEffect(() => {
        if (isSignUpSuccess) {
            router.push("/mark-interests?page=1").catch(console.error);
        }
    }, [isSignUpSuccess, router]);

    return (
        <>
            <form onSubmit={onSubmit} className="w-[100%]">
                <FormTitle title="Create your account" />
                <InputField type="text" label="Name" placeholder="Enter" onChange={(e) => setName(e.target.value)} required={true} />
                <InputField type="email" label="Email" placeholder="Enter" onChange={(e) => setEmail(e.target.value)} required={true} />
                <InputField type="password" label="Password" placeholder="Enter" onChange={(e) => setPassword(e.target.value)} required={true} />
                <ActionButton text={!isSigningUp ? "Create account" : ""} isLoading={isSigningUp} />
            </form>
            {/* Handle error message */}
            {signUpError && (
                <div className="error text-red-500">
                    {signUpError.message}
                </div>
            )}
            <div className="flex items-center justify-center gap-x-2.5 self-stretch pl-20 pr-28 pt-6 text-base leading-[normal] mb-16" >
                <div className="text-left font-normal tracking-[0px] text-neutral-800" >
                    Have an Account?
                </div>
                <div className="flex justify-end text-right font-medium tracking-[1.12px] text-black cursor-pointer" onClick={() => router.push("/").catch(console.error)} >
                    <span className="uppercase">Login</span>
                </div>
            </div>
        </>
    );
}

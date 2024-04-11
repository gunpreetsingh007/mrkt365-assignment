import { useRouter } from "next/router";
import type { FormEvent } from "react";
import { useCallback, useEffect, useState } from "react";
import ActionButton from "~/components/ActionButton";
import FormTitle from "~/components/FormTitle";
import InputField from "~/components/InputField"
import { useAuth } from "~/utils/auth";


export default function Login() {
    const router = useRouter();
    const { signIn, signInError, isSigningIn, isSignInSuccess, currentUser } = useAuth();
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const onSubmit = useCallback((e: FormEvent) => {
        e.preventDefault();
        try {
            signIn({ email, password });
        }
        catch (e) {
        }
    }, [email, password, signIn]);

    useEffect(() => {
        if (currentUser) {
            router.push("/mark-interests?page=1").catch(console.error);
        }
    }, [currentUser, router]);

    useEffect(() => {
        if (isSignInSuccess && currentUser) {
            router.push("/mark-interests?page=1").catch(console.error);
        }
    }, [isSignInSuccess, router, currentUser]);

    return (
        <>
            <form onSubmit={onSubmit} className="w-[100%]">
                <FormTitle title="Login" />
                <div className="flex justify-end self-stretch pr-5 pt-7 pb-2 text-right text-2xl font-medium leading-[normal] tracking-[0px] text-black" >
                    Welcome back to ECOMMERCE
                </div>
                <div className="flex justify-center self-stretch pl-4 pt-1.5 text-center text-base font-normal leading-[normal] tracking-[0px] text-black" >
                    The next gen business marketplace
                </div>
                <InputField type="email" label="Email" placeholder="Enter" onChange={(e) => setEmail(e.target.value)} required={true} />
                <InputField type="password" label="Password" placeholder="Enter" onChange={(e) => setPassword(e.target.value)} required={true} />
                <ActionButton text={!isSigningIn ? "Login" : ""} isLoading={isSigningIn} />
            </form>
            <div className="flex h-6 flex-col items-center justify-end self-stretch" >
                <div className="h-px self-stretch bg-neutral-400" />
            </div>
            {/* Handle error message */}
            {signInError && (
                <div className="error text-red-500">
                    {signInError?.message}
                </div>
            )}
            <div className="flex items-center justify-center gap-x-2.5 self-stretch pl-20 pr-28 pt-6 text-base leading-[normal]" >
                <div className="text-left font-normal tracking-[0px] text-neutral-800" >
                    Don’t have an Account?
                </div>
                <div className="flex justify-end text-right font-medium tracking-[1.12px] text-black cursor-pointer" onClick={() => router.push("/signup").catch(console.error)} >
                    <span className="uppercase">Sign up</span>
                </div>
            </div>
        </>
    );
}
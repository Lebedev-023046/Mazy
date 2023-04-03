import Layout from "@/components/Layout";
import Link from "next/link";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { signIn, useSession } from "next-auth/react";
import { getError } from "@/utils/error";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import axios from "axios";

interface ISubmitData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function LoginScreen() {
  const { data: session } = useSession();

  const router = useRouter();
  const { redirect } = router.query;

  useEffect(() => {
    if (session?.user) {
      router.push((redirect as string) || "/");
    }
  }, [redirect, router, session]);

  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors },
  } = useForm<ISubmitData>();

  const submitHandler = async ({ name, email, password }: ISubmitData) => {
    try {
      await axios.post("/api/auth/signup", {
        name,
        email,
        password,
      });

      const logInResult = await signIn("credentials", {
        redirect: false,
        name,
        email,
        password,
      });
      if (logInResult?.error) {
        toast.error(logInResult.error);
      }
    } catch (error: unknown) {
      toast.error(getError(error as string));
    }
  };

  return (
    <Layout title="Create Account">
      <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="text-2xl font-bold mb-4">Create Account</h1>
        <div className="mb-4">
          <label htmlFor="name">Name</label>
          <input
            {...register("name", {
              required: "Please, enter name",
            })}
            type="name"
            className="w-full"
            id="name"
            autoFocus
          ></input>
          {errors.name && (
            <div className="text-red-500">{errors.name.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="email">Email</label>
          <input
            {...register("email", {
              required: "Please, enter email",
            })}
            type="email"
            className="w-full"
            id="email"
          ></input>
          {errors.email && (
            <div className="text-red-500">{errors.email.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="password">Password</label>
          <input
            {...register("password", {
              required: "Please enter email",
              minLength: {
                value: 8,
                message: "Password must comprise of at least 8 characters",
              },
            })}
            type="password"
            className="w-full"
            id="password"
          ></input>
          {errors.password && (
            <div className="text-red-500">{errors.password.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            {...register("confirmPassword", {
              required: "Please enter confirm password",
              validate: (value) => value === getValues("password"),
              minLength: {
                value: 8,
                message:
                  "confirm password must comprise of at least 8 characters",
              },
            })}
            type="password"
            className="w-full"
            id="confirmPassword"
          ></input>
          {errors.confirmPassword && (
            <div className="text-red-500">{errors.confirmPassword.message}</div>
          )}
          {errors.confirmPassword &&
            errors.confirmPassword.type === "validate" && (
              <div className="text-red-500">Passwords swould be equal</div>
            )}
        </div>
        <button className="primary-button">Register</button>
        <div className="mt-4">
          {/* Don&apos;t have an account? */}
          Already have an account? &nbsp;
          <Link href={`/login`}>Login</Link>
        </div>
      </form>
    </Layout>
  );
}

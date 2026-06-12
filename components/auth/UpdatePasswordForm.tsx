"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";

import Link from "next/link";
import { updatePassword } from "@/actions/auth/auth";
import { useRouter } from "next/navigation";


const UpdatePasswordForm = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const router = useRouter();

    const formSchema = z.object({
        password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
        confirmPassword: z.string()
    }).refine((data) => data.password === data.confirmPassword, {
        message: "Las contraseñas no coinciden",
        path: ["confirmPassword"],
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: '',
            confirmPassword: ''
        }
    })

    const { handleSubmit, formState, control } = form;
    const { errors } = formState;

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setIsLoading(true);

        try {

            const res = await updatePassword(data)

            if (!res.success) {
                throw new Error(res.message);
            }

            toast.success(res.message, { duration: 5000 });
            router.push('/profile');

        } catch (error: any) {
            toast.error(error.message, { duration: 2500 });
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <div className="mx-auto w-full bg-background max-w-lg lg:border lg:border-white/50 mt-10 mb-24 lg:p-6" style={{ borderRadius: 20 }}>
            <div className="w-full backdrop-blur-xl py-2 rounded-4xl">
                <div className="text-center">
                    <h1 className="lg:text-5xl md:text-4xl text-3xl font-semibold text-center my-4">
                        Nueva Contraseña
                    </h1>
                    <p className="text-sm text-muted-foreground mb-8">
                        Ingresa tu nueva contraseña
                    </p>
                </div>

                <Form form={form} onSubmit={handleSubmit(onSubmit)} className="mx-4">
                    <div className="grid gap-2">
                        {/* ========== Password ========= */}
                        <FormField
                            control={control}
                            name="password"
                            render={({ field }) => (
                                <FormItem className="mb-3">
                                    <FormLabel>Nueva Contraseña</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            id="password"
                                            type="password"
                                            autoComplete="new-password"
                                            disabled={isLoading}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* ========== Confirm Password ========= */}
                        <FormField
                            control={control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem className="mb-3">
                                    <FormLabel>Confirmar Contraseña</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            id="confirmPassword"
                                            type="password"
                                            autoComplete="new-password"
                                            disabled={isLoading}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* ========== Submit ========= */}
                        <Button className="mt-6" type="submit" disabled={isLoading}>
                            {isLoading && (
                                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Actualizar Contraseña
                        </Button>

                        {/* ========== Volver ========= */}
                        <div className="text-center text-sm mt-3">
                            <Link href="/profile" className="text-white underline underline-offset-4 hover:text-primary cursor-pointer">
                                Volver
                            </Link>
                        </div>
                    </div>
                </Form>
            </div>
        </div>
    );
}

export default UpdatePasswordForm;
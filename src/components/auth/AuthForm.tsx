import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { signIn, signUp } from "@/lib/supabase"

const formSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
})

type FormData = z.infer<typeof formSchema>

interface AuthFormProps {
  type: "login" | "register"
}

export function AuthForm({ type }: AuthFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      const { error } = type === "login"
        ? await signIn(data.email, data.password)
        : await signUp(data.email, data.password)

      if (error) throw error

      toast.success(
        type === "login" 
          ? "Login realizado com sucesso!" 
          : "Conta criada com sucesso!"
      )
    } catch (error) {
      toast.error(
        type === "login"
          ? "Erro ao fazer login"
          : "Erro ao criar conta"
      )
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-sm">
      <div className="space-y-2">
        <Input
          {...register("email")}
          type="email"
          placeholder="Email"
          className={errors.email ? "border-red-500" : ""}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Input
          {...register("password")}
          type="password"
          placeholder="Senha"
          className={errors.password ? "border-red-500" : ""}
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting}
      >
        {type === "login" ? "Entrar" : "Criar conta"}
      </Button>
    </form>
  )
}

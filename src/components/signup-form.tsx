import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"



interface SignupFormData{
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [loading , setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  
  
  const { register, handleSubmit, getValues, reset, formState: { errors } } = useForm<SignupFormData>();
  useEffect(() => {}, [])
  const onSubmit: SubmitHandler<SignupFormData> = data => {
  setLoading(true);
  try {
    const raw = localStorage.getItem("signupdata")
    const users: SignupFormData[] = raw ? JSON.parse(raw) : []

    const exists = users.some((u) => u.email === data.email)
    if (exists) {
      setErrorMessage("Email sudah terdaftar.")
      setMessage(null)
      return
    }

    const newUsers = [...users, data]
    localStorage.setItem("signupdata", JSON.stringify(newUsers))

    setMessage("Akun berhasil dibuat.")
    setErrorMessage(null)
    window.location.href = "/login";
    reset()
  } finally {
    setLoading(false)
  }
};


  
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                <Input id="name" type="text" placeholder="John Doe" required
                {...register("fullName", { required: true })}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register("email", { required: true })}
                  required
                />
              </Field>
              <Field>
                <Field className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input id="password" type="password" required
                      {...register("password", { required: "Password is required", minLength: { value: 8, message: "Password must be at least 8 characters" } })}
                    />
                    {errors.password && <div className="text-sm text-red-600">{errors.password.message}</div>}
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="confirm-password">
                      Confirm Password
                    </FieldLabel>
                    <Input id="confirm-password" type="password" required
                      {...register("confirmPassword", {
                        required: "Please confirm your password",
                        validate: (value) => value === getValues("password") || "Passwords do not match",
                      })}
                    />
                    {errors.confirmPassword && <div className="text-sm text-red-600">{errors.confirmPassword.message}</div>}
                  </Field>
                </Field>
                <FieldDescription>
                  Must be at least 8 characters long.
                </FieldDescription>
              </Field>
              <Field>
                <Button disabled={loading} type="submit">Create Account</Button>
                {message && (
                  <div className="mt-2 text-sm text-green-600">
                    {message}
                  </div>
                )}
                {errorMessage && (
                  <div className="mt-2 text-sm text-red-600">
                    {errorMessage}
                  </div>
                )}
                <FieldDescription className="text-center">
                  Already have an account? <a href="/login">Sign in</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}

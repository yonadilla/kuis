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
import { useForm, type SubmitHandler } from "react-hook-form"
import { useState } from "react"


interface LoginFormProps extends React.ComponentProps<"div"> {
  email?: string;
  password?: string;
}


export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  
  const [ loading, setLoading ] = useState(false);
  const { register, handleSubmit, reset } = useForm<LoginFormProps>();
  
  const randomString = Math.random().toString(36).substring(2, 15);
  const onSubmit : SubmitHandler<LoginFormProps> = data => {
    setLoading(true);
    console.log(data);
    try {
      const storedData = localStorage.getItem("signupData");
        const parsedData = JSON.parse(storedData);
        if (parsedData.email === data.email && parsedData.password === data.password) {
          alert("Login successful!");
          window.location.href = "/";
          localStorage.setItem("loginSession", JSON.stringify({
            email: data.email,
            sessionId: randomString,
            loginTime: Date.now()
          }));
        } else {
          alert("Email and password not match")
          reset();
        }
      setLoading(false)
    } catch (error) {
      setLoading(false);
    }
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  {...register("email", { required: true })}
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" type="password" required 
                {...register("password", { required: true })}
                />
              </Field>
              <Field>
                <Button type="submit" disabled={loading}>Login</Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <a href="/register">Sign up</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

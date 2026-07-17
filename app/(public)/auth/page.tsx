import { AuthPanel } from "@/components/auth/auth-panel"
import { Card } from "@/components/ui/card"

export default function AuthPage() {
  return (
    <div className="flex min-h-screen items-start justify-center pb-12">
      <Card className="w-full max-w-md gap-0 p-6">
        <AuthPanel redirectTo="/" />
      </Card>
    </div>
  )
}

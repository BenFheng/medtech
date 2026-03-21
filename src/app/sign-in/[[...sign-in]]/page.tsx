import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-6">
      <div className="text-center space-y-8">
        <div>
          <h1 className="font-headline font-black text-3xl text-on-surface tracking-tighter">
            VANGUARD
          </h1>
          <p className="text-on-surface-variant text-sm mt-2">
            Sign in to access your protocol
          </p>
        </div>
        <SignIn
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "rounded-xl shadow-none",
              headerTitle: "font-headline",
              formButtonPrimary:
                "bg-primary hover:bg-primary-container text-on-primary rounded-lg",
            },
          }}
        />
      </div>
    </div>
  );
}

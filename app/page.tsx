import AuthForm from "@/components/auth/AuthForm";
export default function Home() {
  return (
    <div className="pt-14" style={{ minHeight: "108vh" }}>
      <AuthForm type="sign-in" />
    </div>
  );
}

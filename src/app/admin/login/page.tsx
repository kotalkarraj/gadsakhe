import LoginForm from "@/components/admin/LoginForm";

type Props = { searchParams: Promise<{ error?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto max-w-md py-8">
      <p className="font-stat text-[11px] tracking-[0.3em] text-rust-text">AUTHORS</p>
      <h1 className="mt-3 font-display text-5xl font-light tracking-tight">
        Sign <span className="italic">in</span>
      </h1>
      <p className="mt-4 font-body text-dusk/60 leading-relaxed">
        We&apos;ll email you a one-time sign-in link. No password needed.
      </p>
      {error && (
        <p className="mt-6 rounded-2xl bg-red-50 px-4 py-3 font-body text-sm text-red-800 ring-1 ring-red-200">
          That sign-in link is invalid or has expired. Request a new one.
        </p>
      )}
      <LoginForm />
    </div>
  );
}

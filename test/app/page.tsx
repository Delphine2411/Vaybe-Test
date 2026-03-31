import { ApplicationForm } from "@/components/application-form";
import { BrandLogo } from "@/components/brand-logo";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 py-5">
      <div className="left-2">
        <BrandLogo />
      </div>
      <section className="mx-auto w-full max-w-3xl">
        <div className="mt-2 mb-8 text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
            Rejoignez notre equipe
          </h1>
          <p className="mt-3 text-lg text-slate-500">
            Postulez des maintenant et faites partie de l&apos;aventure
          </p>
        </div>
        <ApplicationForm />
      </section>
    </main>
  );
}

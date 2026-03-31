"use client";

import Link from "next/link";
import { BriefcaseBusiness, LoaderCircle, Palette, Send } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useApplicationsApi } from "@/hooks/use-applications-api";
import { useToast } from "@/components/ui/toast";
import { isValidEmail, isValidHttpUrl } from "@/lib/application-helpers";
import type { FieldProps, FormState } from "@/lib/types";

const initialValues: FormState = {
  name: "",
  email: "",
  role: "dev",
  motivation: "",
  portfolio: "",
  cv: "",
};

export function ApplicationForm() {
  const [values, setValues] = useState<FormState>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const { submitApplication, isSubmittingApplication } = useApplicationsApi();
  const { toast } = useToast();

  function validateForm(currentValues: FormState) {
    const nextErrors: Partial<Record<keyof FormState, string>> = {};

    if (!currentValues.name.trim()) {
      nextErrors.name = "Le nom est obligatoire.";
    } else if (currentValues.name.trim().length < 2) {
      nextErrors.name = "Le nom doit contenir au moins 2 caracteres.";
    }

    if (!currentValues.email.trim()) {
      nextErrors.email = "L'email est obligatoire.";
    } else if (!isValidEmail(currentValues.email)) {
      nextErrors.email = "L'email n'est pas valide.";
    }

    if (!currentValues.motivation.trim()) {
      nextErrors.motivation = "Le message de motivation est obligatoire.";
    } else if (currentValues.motivation.trim().length < 50) {
      nextErrors.motivation = "Le message doit contenir au moins 50 caracteres.";
    }

    if (!currentValues.cv.trim()) {
      nextErrors.cv = "Le lien vers votre CV est obligatoire.";
    } else if (!isValidHttpUrl(currentValues.cv)) {
      nextErrors.cv = "L'URL du CV n'est pas valide.";
    }

    if (
      currentValues.portfolio.trim() &&
      !isValidHttpUrl(currentValues.portfolio)
    ) {
      nextErrors.portfolio = "L'URL du portfolio n'est pas valide.";
    }

    return nextErrors;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateForm(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      toast({
        variant: "error",
        title: "Formulaire incomplet",
        description: "Veuillez corriger les champs signalés avant l'envoi.",
      });
      return;
    }

    try {
      const payload = await submitApplication(values);

      setValues(initialValues);
      setErrors({});
      toast({
        variant: "success",
        title: "Candidature envoyee",
        description:
          payload.message || "Votre candidature a bien ete enregistree.",
      });
    } catch (error) {
      toast({
        variant: "error",
        title: "Envoi impossible",
        description:
          error instanceof Error
            ? error.message
            : "Impossible d'envoyer votre candidature pour le moment.",
      });
    }
  }

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  return (
    <div className="rounded-[1.75rem] border border-white/70 bg-white/95 shadow-[0_24px_80px_rgba(83,102,168,0.16)] backdrop-blur">
      <div className="border-b border-slate-100 px-6 py-6 md:px-8">
        <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-brand)]">
          Formulaire de candidature
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Remplissez tous les champs pour soumettre votre candidature
        </p>
      </div>

      <div className="px-6 py-6 md:px-8 md:py-8">
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <Field
            label="Nom complet"
            name="name"
            placeholder="Jean Dupont"
            value={values.name}
            error={errors.name}
            onChange={(value) => updateField("name", value)}
            required
          />

          <Field
            label="Email"
            name="email"
            type="email"
            placeholder="jean.dupont@exemple.fr"
            value={values.email}
            error={errors.email}
            onChange={(value) => updateField("email", value)}
            required
          />

          <div className="space-y-3">
            <p className="text-sm font-medium text-slate-700">
              Role souhaite <span className="text-red-500">*</span>
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <RoleCard
                id="role-dev"
                label="Developpeur"
                selected={values.role === "dev"}
                icon={<BriefcaseBusiness className="h-5 w-5" />}
                onSelect={() => updateField("role", "dev")}
              />
              <RoleCard
                id="role-designer"
                label="Designer"
                selected={values.role === "designer"}
                icon={<Palette className="h-5 w-5" />}
                onSelect={() => updateField("role", "designer")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="motivation"
              className="text-sm font-medium text-slate-700"
            >
              Message de motivation <span className="text-red-500">*</span>
            </label>
            <textarea
              id="motivation"
              value={values.motivation}
              onChange={(event) => updateField("motivation", event.target.value)}
              placeholder="Parlez-nous de votre passion, votre experience et pourquoi vous souhaitez nous rejoindre..."
              rows={6}
              className={`w-full rounded-xl border bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[var(--color-brand)] focus:ring-4 focus:ring-blue-100 ${
                errors.motivation ? "border-red-500" : "border-slate-200"
              }`}
            />
            {errors.motivation ? (
              <p className="text-sm text-red-500">{errors.motivation}</p>
            ) : (
              <p className="text-xs text-slate-500">
                Astuce : utilisez des mots-cles comme passionne, experience,
                innovation, impact ou collaboration pour ameliorer votre score.
              </p>
            )}
          </div>

          <Field
            label="Lien vers votre portfolio"
            name="portfolio"
            type="url"
            placeholder="https://mon-portfolio.com"
            value={values.portfolio}
            error={errors.portfolio}
            onChange={(value) => updateField("portfolio", value)}
          />

          <Field
            label="Lien vers votre CV"
            name="cv"
            type="url"
            placeholder="https://mon-cv.pdf"
            value={values.cv}
            error={errors.cv}
            onChange={(value) => updateField("cv", value)}
            required
          />

          <div className="flex flex-col gap-3 pt-4 sm:flex-row">
            <Button
              type="submit"
              className="h-11 flex-1 rounded-xl bg-[var(--color-brand)] text-white hover:bg-[var(--color-brand-strong)]"
              disabled={isSubmittingApplication}
            >
              {isSubmittingApplication ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Soumettre ma candidature
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              asChild
              className="h-11 rounded-xl border-slate-200 bg-white hover:bg-slate-50"
            >
              <Link href="/admin">Voir les candidatures</Link>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function RoleCard({
  id,
  label,
  selected,
  icon,
  onSelect,
}: {
  id: string;
  label: string;
  selected: boolean;
  icon: React.ReactNode;
  onSelect: () => void;
}) {
  return (
    <label
      htmlFor={id}
      className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-all ${
        selected
          ? "border-[var(--color-brand)] bg-blue-50 shadow-[0_8px_24px_rgba(0,71,187,0.08)]"
          : "border-slate-200 bg-white hover:border-slate-300"
      }`}
    >
      <input
        id={id}
        type="radio"
        name="role"
        checked={selected}
        onChange={onSelect}
        className="h-4 w-4 border-slate-300 text-[var(--color-brand)] focus:ring-[var(--color-brand)]"
      />
      <div className="flex items-center gap-2 text-slate-700">
        {icon}
        <span>{label}</span>
      </div>
    </label>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
  required = false,
}: FieldProps & { required?: boolean }) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="text-sm font-medium text-slate-700">
        {label} {required ? <span className="text-red-500">*</span> : null}
      </label>
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={`h-11 w-full rounded-xl border bg-white px-4 text-slate-900 outline-none transition focus:border-[var(--color-brand)] focus:ring-4 focus:ring-blue-100 ${
          error ? "border-red-500" : "border-slate-200"
        }`}
      />
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
    </div>
  );
}

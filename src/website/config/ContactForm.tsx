import { useEffect, useState } from 'react';
import { CONTACT_FORM_CONFIG, type ContactFormField, type ContactFormType } from './contactFormConfig';
import { ContactService } from '../api/contact';
import { useLocation } from 'react-router';
import { Check } from 'lucide-react';

const INITIALSTATE = {
    name: "",
    email: "",
    phone: "",
    message: "",
}

const FIELD_LABELS: Record<ContactFormField, string> = {
    name: "Nombre y apellido",
    email: "Correo electrónico",
    phone: "Teléfono (opcional)",
    message: "Mensaje",
}

const ContactForm = ({ type }: { type: ContactFormType }) => {
    const config = CONTACT_FORM_CONFIG[type]
    const [form, setForm] = useState(INITIALSTATE)
    const [submitted, setSubmitted] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const location = useLocation()
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (form.message.trim().length < 10) {
        setError("El mensaje debe tener al menos 10 caracteres.");
        return; // Ponemos un freno de mano acá: no se ejecuta nada de lo de abajo
    }
    setLoading(true)


  try {
    if (type === "sumate") {
      await ContactService.sendAdvisor(form);
      setLoading(false)
    } else {
      await ContactService.sendContact(form);
      setLoading(false)
    }
     setForm(INITIALSTATE);
    setSubmitted(true);

   
  } catch (error: unknown) {
    const axiosError = error as { response?: { status?: number; data?: unknown } }
    console.log("STATUS:", axiosError.response?.status);
    console.log("DATA:", axiosError.response?.data);
  }
};

  useEffect(() => {
      return () => {
        setForm(INITIALSTATE)
        setSubmitted(false);
      }
}, [location.pathname]);

    return (
        <section className="w-full max-w-xl mx-auto">

            <div className="mb-5 border-l-2 border-red-700 pl-4">
                <h2 className="text-2xl font-bold text-white libre-baskerville-hero mb-1">
                    {config.title}
                </h2>
                <p className="text-white/50 text-sm leading-relaxed">
                    {config.subtitle}
                </p>
            </div>
            

            {submitted ? (
                <div className="rounded-2xl bg-natural-950 p-8 text-start shadow-sm max-w-md mx-auto">
  <div className="mx-auto mb-4 flex w-min h-min p-2 items-center justify-center rounded-full bg-white text-red-800">
    <Check size={38} className='' strokeWidth={3}  />
  </div>
  
  <h3 className="text-xl font-bold text-white libre-baskerville-hero">
    ¡Listo, recibimos tu mensaje!
  </h3>
  
  <p className="mt-2 text-sm text-zinc-500">
    Un asesor de nuestro equipo se pondrá en contacto con vos a la brevedad para darte un seguimiento personalizado.
  </p>
</div>
            ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    {config.fields.map((field) => (
                        <div key={field} className="flex flex-col">
                            <label htmlFor={field} className="text-white/80 font-medium text-xs mb-1 ml-1">
                                {FIELD_LABELS[field]}
                            </label>

                            {field === "message" ? (
                                <textarea
                                    id={field}
                                    name={field}
                                    rows={3}
                                    value={form[field as keyof typeof INITIALSTATE]}
                                    onChange={handleChange}
                                    placeholder={config.messagePlaceholder}
                                    required
                                    className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-red-700"
                                />
                            ) : (
                                <input
                                    id={field}
                                    name={field}
                                    type={field === "email" ? "email" : "text"}
                                    value={form[field as keyof typeof INITIALSTATE]}
                                    onChange={handleChange}
                                    required={field !== "phone"}
                                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none transition focus:border-red-700"
                                />
                            )}
                        </div>
                    ))}

                    {error && (
    <div className="text-left pl-1 animate-fade-in">
        <p className="text-xs font-medium tracking-wide text-red-500 flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
            {error}
        </p>
    </div>
)}

                    {
              loading ? (
                <div className="flex items-center justify-center p-2">
                  <div className="w-8 h-8 border-4 border-red-700/30 border-t-red-700 rounded-full animate-spin"></div>
                </div>
              ): (
                <button
                        type="submit"
                        className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-red-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 cursor-pointer"
                    >
                        {config.submitLabel}
                    </button>
              )
            }

                    

                    <p className="text-center text-xs text-white/30">
                        Respondemos en menos de 24hs hábiles.
                    </p>
                </form>
            )}
        </section>
    );
}

export default ContactForm;
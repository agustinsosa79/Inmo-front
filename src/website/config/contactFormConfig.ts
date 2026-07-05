export type ContactFormType =  "sumate" | "contact"

export type ContactFormField =
  | "name"
  | "email"
  | "phone"
  | "message"

export type ContactFormConfig = {
    title: string,
    subtitle: string,
    fields: ContactFormField[],
    submitLabel: string,
    successMessage: string,
    messagePlaceholder: string
}


export const CONTACT_FORM_CONFIG: Record<ContactFormType, ContactFormConfig> = {
  contact: {
    title: "Contactanos ",
    subtitle: "Dejanos tu consulta y te respondemos a la brevedad.",
    fields: ["name", "email", "phone", "message"],
    submitLabel: "ENVIAR CONSULTA",
    successMessage: "Recibimos tu mensaje.",
    messagePlaceholder: "¿En qué podemos ayudarte?",
  },
  
  sumate: {
    title: "Sumate al equipo",
    subtitle: "¿Tenés experiencia en el rubro inmobiliario? Escribinos.",
    fields: ["name", "email", "phone", "message"],
    submitLabel: "ENVIAR SOLICITUD",
    successMessage: "Revisaremos tu perfil.",
    messagePlaceholder: "¿Por qué querés sumarte al equipo?",
  },
};
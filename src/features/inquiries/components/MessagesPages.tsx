import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Mail, MailOpen, Phone, User, Search, X, MessageSquare} from "lucide-react";
import * as Switch from "@radix-ui/react-switch";
import DeleteInquiryModal from "../utils/DeleteInquiryModal";
import { InquiryApi, type Inquiry } from "../services/inquiryApi";

type Tab = "unread" | "contacted" | "not_contacted" | "all";

const MessagesPage = () => {
  const [searchParams] = useSearchParams();
  const propertyId = searchParams.get("propertyId");
  const propertyTitle = searchParams.get("title");

  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("unread");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [inquiryToDelete, setInquiryToDelete] = useState<Inquiry | null>(null);
  const [copiedField, setCopiedField] = useState<{ id: number; type: "email" | "phone" } | null>(null);

  const navigate = useNavigate();

  const handleCopyText = async (id: number, text: string | null, type: "email" | "phone") => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField({ id, type });
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      console.error("Error al copiar texto:", error);
    }
  };

  const [pinnedIds, setPinnedIds] = useState<Set<number>>(new Set());

  const computePinned = (data: Inquiry[], currentTab: Tab): Set<number> => {
    let filtered: Inquiry[];
    switch (currentTab) {
      case "unread": filtered = data.filter((i) => !i.isRead); break;
      case "contacted": filtered = data.filter((i) => i.isContacted); break;
      case "not_contacted": filtered = data.filter((i) => !i.isContacted); break;
      default: filtered = data;
    }
    return new Set(filtered.map((i) => i.id));
  };

  useEffect(() => {
    const fetchInquiries = async () => {
      setLoading(true);
      try {
        const data = await InquiryApi.getAll(Number(propertyId));
        setInquiries(data);
        setPinnedIds(computePinned(data, tab));
      } catch (error) {
        console.error("Error al cargar mensajes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInquiries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyId]);

  const handleExpand = async (inquiry: Inquiry) => {
    const isOpening = expandedId !== inquiry.id;
    setExpandedId(isOpening ? inquiry.id : null);
    if (isOpening && !inquiry.isRead) {
      try {
        const updated = await InquiryApi.markAsRead(inquiry.id, true);
        setInquiries((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
      } catch (error) {
        console.error("Error al marcar como leída:", error);
      }
    }
  };

  const handleToggleContacted = async (inquiry: Inquiry, isContacted: boolean) => {
    try {
      const updated = await InquiryApi.markAsContacted(inquiry.id, isContacted);
      setInquiries((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
    } catch (error) {
      console.error("Error al actualizar estado de contacto:", error);
    }
  };

  const handleTabChange = (newTab: Tab) => {
    setTab(newTab);
    setPinnedIds(computePinned(inquiries, newTab));
  };

  const handleDeleteInquiry = async (id: number) => {
    try {
      await InquiryApi.deleteInquiry(id);
      setInquiries((prev) => prev.filter((iq) => iq.id !== id));
      setInquiryToDelete(null);
    } catch (error) {
      console.error("error al eliminar la consulta", error);
    }
  };

  const unreadCount = inquiries.filter((i) => !i.isRead).length;
  const contactedCount = inquiries.filter((i) => i.isContacted).length;
  const notContactedCount = inquiries.filter((i) => !i.isContacted).length;

  const visibleInquiries = (
    tab === "all" ? inquiries : inquiries.filter((i) => pinnedIds.has(i.id))
  ).filter((i) =>
    search.trim() ? i.name.toLowerCase().includes(search.trim().toLowerCase()) : true
  );

  const emptyMessage: Record<Tab, string> = {
    unread: "No tenés mensajes sin leer.",
    contacted: "No hay mensajes marcados como contactados.",
    not_contacted: "No hay mensajes pendientes de contactar.",
    all: "No hay mensajes todavía.",
  };


  return (
    <div className="w-full max-w-7xl mx-auto px-2 py-6 sm:p-10 min-h-screen pb-10">
      {/* HEADER */}
      <div className="mb-6 sm:mb-8">
        <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-zinc-500">
          Panel Administrativo
        </p>
        <div className="mt-2 flex items-center gap-3">
          <div className="h-6 sm:h-8 w-1 rounded-full bg-red-950" />
          <h2 className="text-xl sm:text-2xl font-semibold text-red-950 libre-baskerville-hero">
            Mensajes
          </h2>
        </div>
      </div>

      {/* FILTRO ACTIVO POR PROPIEDAD */}
      {propertyId && (
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
          <div>
            <p className="text-[10px] sm:text-xs font-medium uppercase tracking-wider text-red-800">
              Filtro activo
            </p>
            <h3 className="mt-1 text-sm sm:text-base font-semibold text-zinc-900">
              Mensajes de la propiedad #{propertyId}
            </h3>
            {propertyTitle && (
              <p className="mt-0.5 text-xs sm:text-sm text-zinc-500">{propertyTitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => navigate("/dashboard/mensajes")}
            className="w-full sm:w-auto rounded-xl border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:border-zinc-900 hover:text-zinc-900 cursor-pointer text-center"
          >
            Ver todos
          </button>
        </div>
      )}


      {/* TABS + BUSCADOR */}
      <div className="mb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-zinc-200">
        <div className="flex gap-1 overflow-x-auto lg:pb-1 pb-0 scrollbar-hide">
          {(
            [
              { key: "all", label: `Todas (${inquiries.length})` },
              { key: "contacted", label: `Contactados (${contactedCount})` },
              { key: "not_contacted", label: `Sin contactar (${notContactedCount})` },
              { key: "unread", label: "No leídas", badge: unreadCount },
            ] as { key: Tab; label: string; badge?: number }[]
          ).map(({ key, label, badge }) => (
            <button
              key={key}
              type="button"
              onClick={() => handleTabChange(key)}
              className={`flex items-center gap-2 whitespace-nowrap px-3 sm:px-4 py-3 text-[11px] lg:text-sm font-semibold transition cursor-pointer border-b-2 ${
                tab === key
                  ? "border-red-800 text-red-800"
                  : "border-transparent text-zinc-500 hover:text-zinc-800"
              }`}
            >
              {label}
              {badge !== undefined && badge > 0 && (
                <span className="flex h-4 min-w-4 sm:h-5 sm:min-w-5 items-center justify-center rounded-full bg-red-800 px-1.5 text-[10px] sm:text-xs font-bold text-white">
                  {badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* BUSCADOR */}
        <div className="relative mb-2 lg:mb-0 w-full lg:w-64 shrink-0">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            id="search-messages"
            type="text"
            placeholder="Buscar por nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-8 pr-8 text-sm text-zinc-900 outline-none transition focus:border-red-800"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* LISTA */}
      {loading && (
        <div className="flex h-40 items-center justify-center gap-3 text-zinc-400">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-200 border-t-red-800" />
          <span className="text-sm">Cargando mensajes...</span>
        </div>
      )}

      {!loading && visibleInquiries.length === 0 && (
        <div className="flex h-40 sm:h-60 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 p-6 text-center text-zinc-400">
          <MessageSquare size={32} className="opacity-40" />
          <p className="text-xs sm:text-sm">
            {search.trim()
              ? `No se encontraron mensajes de "${search}"`
              : emptyMessage[tab]}
          </p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {visibleInquiries.map((inquiry) => {
          const isExpanded = expandedId === inquiry.id;

          return (
            <div
              key={inquiry.id}
              className={`rounded-2xl border transition overflow-hidden ${
                inquiry.isRead
                  ? "border-zinc-200 bg-white"
                  : "border-red-200 bg-red-50/40"
              }`}
            >
              <button
                type="button"
                onClick={() => handleExpand(inquiry)}
                className="flex w-full flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 px-4 sm:px-5 py-4 text-left cursor-pointer"
              >
                <div className="flex items-start sm:items-center gap-3 min-w-0 w-full">
                  {inquiry.isRead ? (
                    <MailOpen size={18} className="shrink-0 text-zinc-400 mt-0.5 sm:mt-0" />
                  ) : (
                    <Mail size={18} className="shrink-0 text-red-800 mt-0.5 sm:mt-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-zinc-900">
                      {inquiry.name}
                      {inquiry.property && (
                        <span className="ml-2 font-normal text-zinc-500 hidden sm:inline">
                          · {inquiry.property.title}
                          {inquiry.property.address &&
                            ` (${inquiry.property.address}${
                              inquiry.property.zone?.name
                                ? `, ${inquiry.property.zone.name}`
                                : ""
                            })`}
                        </span>
                      )}
                    </p>
                    {inquiry.property && (
                      <p className="truncate text-xs text-zinc-500 sm:hidden mt-0.5">
                        {inquiry.property.title}
                      </p>
                    )}
                    <p className="truncate text-xs sm:text-sm text-zinc-500 mt-0.5 sm:mt-0">
                      {inquiry.message}
                    </p>
                  </div>
                </div>

                <div className="flex w-full sm:w-auto shrink-0 items-center justify-between sm:justify-end gap-3 pl-8 sm:pl-0 mt-1 sm:mt-0">
                  {inquiry.isContacted && (
                    <span className="rounded-full bg-green-100 px-2.5 py-1 text-[10px] sm:text-xs font-semibold text-green-700">
                      Contactado
                    </span>
                  )}
                  <span className="text-[10px] sm:text-xs text-zinc-400">
                    {new Date(inquiry.createdAt).toLocaleDateString("es-AR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-zinc-100 px-4 sm:px-5 py-4 bg-zinc-50/30">
                  <p className="whitespace-pre-line text-sm text-zinc-700 leading-relaxed">
                    {inquiry.message}
                  </p>

                  <div className="mt-5 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-6 text-sm text-zinc-600">
                    <span className="flex items-center gap-2 font-medium">
                      <User size={16} className="text-zinc-400" />
                      {inquiry.name}
                    </span>

                    <div className="relative flex items-center gap-2">
                      <a href={`mailto:${inquiry.email}`} className="flex items-center gap-2 hover:text-red-800 transition-colors">
                        <Mail size={16} className="text-zinc-400" />
                        <span className="break-all">{inquiry.email}</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => handleCopyText(inquiry.id, inquiry.email, "email")}
                        className="text-xs text-zinc-400 hover:text-zinc-900 underline ml-1 cursor-pointer shrink-0"
                      >
                        Copiar
                      </button>
                      {copiedField?.id === inquiry.id && copiedField?.type === "email" && (
                        <span className="absolute -top-7 left-1/2 -translate-x-1/2 rounded bg-zinc-900 px-2 py-1 text-[10px] font-medium text-white shadow-md whitespace-nowrap">
                          ¡Copiado!
                        </span>
                      )}
                    </div>

                    {inquiry.phone && (
                      <div className="relative flex items-center gap-2">
                        <a href={`tel:${inquiry.phone}`} className="flex items-center gap-2 hover:text-red-800 transition-colors">
                          <Phone size={16} className="text-zinc-400" />
                          {inquiry.phone}
                        </a>
                        <button
                          type="button"
                          onClick={() => handleCopyText(inquiry.id, inquiry.phone, "phone")}
                          className="text-xs text-zinc-400 hover:text-zinc-900 underline ml-1 cursor-pointer shrink-0"
                        >
                          Copiar
                        </button>
                        {copiedField?.id === inquiry.id && copiedField?.type === "phone" && (
                          <span className="absolute -top-7 left-1/2 -translate-x-1/2 rounded bg-zinc-900 px-2 py-1 text-[10px] font-medium text-white shadow-md whitespace-nowrap">
                            ¡Copiado!
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-zinc-200 pt-5">
                    <div className="flex items-center gap-3">
                      <Switch.Root
                        checked={inquiry.isContacted}
                        onCheckedChange={(checked) => handleToggleContacted(inquiry, checked)}
                        className="w-11 h-6 bg-zinc-300 rounded-full relative data-[state=checked]:bg-green-700 outline-none cursor-pointer transition-colors"
                      >
                        <Switch.Thumb className="block w-4 h-4 bg-white rounded-full transition-transform translate-x-1 will-change-transform data-[state=checked]:translate-x-6 shadow-sm" />
                      </Switch.Root>
                      <span className="text-sm font-medium text-zinc-700">
                        {inquiry.isContacted ? "Ya contactado" : "Marcar como contactado"}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setInquiryToDelete(inquiry)}
                      className="w-full sm:w-auto text-center rounded-xl border border-red-200 px-4 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-800 hover:text-white hover:border-red-800 cursor-pointer"
                    >
                      Eliminar mensaje
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {inquiryToDelete && (
        <DeleteInquiryModal
          onClose={() => setInquiryToDelete(null)}
          onConfirm={() => handleDeleteInquiry(inquiryToDelete.id)}
        />
      )}
    </div>
  );
};

export default MessagesPage;
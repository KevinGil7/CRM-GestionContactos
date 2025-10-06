import { useEffect, useState } from "react";
import { addMonths, subMonths, format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isToday, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { getCalendarioAll } from "../service/calendario.service";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { CakeIcon, SparklesIcon } from "@heroicons/react/24/outline";

interface CalendarioDto {
  date: string;
  title: string;
  idContacto: string;
  nameContacto: string;
}

interface Day {
  date: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: CalendarioDto[];
}

export default function Calendario() {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [days, setDays] = useState<Day[]>([]);
  const [events, setEvents] = useState<CalendarioDto[]>([]);
  const [filterType, setFilterType] = useState<"all" | "cumpleaños" | "aniversario">("all");
  const [loading, setLoading] = useState(true);

  // 🔹 Trae la data del backend
  const fetchCalendarioData = async () => {
    try {
      setLoading(true);
      const response = await getCalendarioAll();
      if (response.success && response.data) {
        setEvents(response.data);
        toast.success(`Cargados ${response.data.length} eventos`);
      } else {
        toast.error('Error al cargar los datos del calendario');
      }
    } catch (error) {
      toast.error('Error al cargar los datos del calendario');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendarioData();
  }, []);

  // 🔹 Filtrar eventos por tipo
  const getFilteredEvents = (events: CalendarioDto[]) => {
    if (filterType === "all") return events;
    return events.filter(event => 
      event.title.toLowerCase().includes(filterType.toLowerCase())
    );
  };

  // 🔹 Generar los días del mes actual con sus eventos
  useEffect(() => {
    
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const tempDays: Day[] = [];
    let day = startDate;

    // Aplicar filtros a los eventos
    const filteredEvents = getFilteredEvents(events);

    while (day <= endDate) {
      const dateStr = format(day, "yyyy-MM-dd");

      // Filtrar eventos de este día (comparar solo mes y día, ignorar año)
      const dayEvents = filteredEvents.filter((event) => {
        const eventDate = parseISO(event.date);
        const currentDay = parseISO(dateStr);
        
        // Comparar solo mes y día
        return eventDate.getMonth() === currentDay.getMonth() && 
               eventDate.getDate() === currentDay.getDate();
      });

      if (dayEvents.length > 0) {
        console.log(`Eventos para ${dateStr}:`, dayEvents);
      }

      tempDays.push({
        date: dateStr,
        isCurrentMonth: isSameMonth(day, monthStart),
        isToday: isToday(day),
        events: dayEvents,
      });

      day = addDays(day, 1);
    }

    setDays(tempDays);
  }, [currentMonth, events, filterType]);

  // 🔹 Cambiar de mes
  const goToPreviousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const goToToday = () => setCurrentMonth(new Date());

  // 🔹 Mostrar nombre de mes y año
  const formatMonthYear = (date: Date) =>
    format(date, "MMMM yyyy", { locale: es }).replace(/^\w/, (c) => c.toUpperCase());

  // 🔹 Navegar al contacto
  const handleEventClick = (idContacto: string) => {
    navigate(`/home/contactos/${idContacto}`);
  };

  // 🔹 Obtener icono según el tipo de evento
  const getEventIcon = (title: string) => {
    if (title.toLowerCase().includes('cumple')) {
      return <CakeIcon className="h-4 w-4 text-blue-600" />;
    }
    return <SparklesIcon className="h-4 w-4 text-pink-600" />;
  };

  // 🔹 Obtener meses que tienen eventos
  const getMonthsWithEvents = () => {
    const months = new Set();
    events.forEach(event => {
      const eventDate = parseISO(event.date);
      months.add(`${eventDate.getFullYear()}-${eventDate.getMonth()}`);
    });
    return Array.from(months);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="lg:flex lg:h-full lg:flex-col bg-white">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-gray-200 px-6 py-4 lg:flex-none">
        <div>
          <h1 className="text-base font-semibold text-gray-900">
            <time dateTime={currentMonth.toISOString()}>{formatMonthYear(currentMonth)}</time>
          </h1>
          {getFilteredEvents(events).length === 0 && events.length > 0 && (
            <p className="text-xs text-amber-600 mt-1">
              💡 Los eventos están en otros meses. Navega para encontrarlos.
            </p>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {/* Filtros */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Filtrar:</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as "all" | "cumpleaños" | "aniversario")}
              className="rounded-md border border-gray-300 px-3 py-1 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">Todos</option>
              <option value="cumpleaños">Cumpleaños</option>
              <option value="aniversario">Aniversarios</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={goToPreviousMonth}
              className="rounded-md bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              ←
            </button>
            <button
              onClick={goToToday}
              className="rounded-md bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Hoy
            </button>
            <button
              onClick={goToNextMonth}
              className="rounded-md bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              →
            </button>
          </div>
        </div>
      </header>


      {/* Calendario */}
      <div className="shadow ring-1 ring-black/5 lg:flex lg:flex-auto lg:flex-col">
        {/* Encabezado de días */}
        <div className="grid grid-cols-7 gap-px border-b border-gray-300 bg-gray-200 text-center text-xs font-semibold text-gray-700">
          {["L", "M", "M", "J", "V", "S", "D"].map((day, i) => (
            <div key={i} className="flex justify-center bg-white py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Grilla de días */}
        <div className="flex bg-gray-200 text-xs text-gray-700 lg:flex-auto">
          <div className="hidden w-full lg:grid lg:grid-cols-7 lg:grid-rows-6 lg:gap-px">
            {days.map((day) => (
              <div
                key={day.date}
                className={`relative min-h-[110px] bg-white px-2 py-2 border border-gray-100 ${
                  !day.isCurrentMonth ? "bg-gray-50 text-gray-400" : ""
                }`}
              >
                {/* Número del día */}
                <time
                  dateTime={day.date}
                  className={`block text-sm font-semibold ${
                    day.isToday ? "text-indigo-600" : ""
                  }`}
                >
                  {day.date.split("-").pop()?.replace(/^0/, "")}
                </time>

                {/* Eventos */}
                {day.events.length > 0 ? (
                  <div className="mt-1 space-y-1">
                    {day.events.map((event, i) => (
                      <div
                        key={i}
                        onClick={() => handleEventClick(event.idContacto)}
                        className={`cursor-pointer rounded-md px-2 py-1 text-xs font-medium truncate hover:shadow-md transition-all duration-200 border-2 ${
                          event.title.toLowerCase().includes("cumple")
                            ? "bg-blue-200 text-blue-900 border-blue-400 hover:bg-blue-300 shadow-sm"
                            : "bg-pink-200 text-pink-900 border-pink-400 hover:bg-pink-300 shadow-sm"
                        }`}
                      >
                        <div className="flex items-center space-x-1">
                          {getEventIcon(event.title)}
                          <span className="truncate font-bold text-sm">{event.nameContacto}</span>
                        </div>
                        <div className="text-xs font-semibold mt-0.5 truncate">
                          {event.title}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-2 text-gray-400 text-xs italic">—</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

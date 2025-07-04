import { format, parse, startOfWeek, getDay } from 'date-fns';
import { dateFnsLocalizer, DateLocalizer } from 'react-big-calendar';
import { es } from 'date-fns/locale';


export const localizer: DateLocalizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 , locale: es }),
  getDay,
  locales: {es},
});
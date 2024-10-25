import { DateTime } from "luxon";

export function datetime2string(datetime: Date) {
  return {
    datetime: DateTime.fromJSDate(datetime).toFormat('dd/MM/yyyy HH:mm:ss'),
    date: DateTime.fromJSDate(datetime).toFormat('dd/MM/yyyy'),
    time: DateTime.fromJSDate(datetime).toFormat('HH:mm:ss')
  }
}
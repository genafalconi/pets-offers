export default function dateFormat(date: Date) {
  date.setUTCHours(date.getUTCHours() - 3);
  const isoString = date.toISOString();
  return isoString;
}

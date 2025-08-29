export function capitalize(str: string): string {
  return str.substring(0, 1).toLocaleUpperCase() + str.substring(1).toLocaleLowerCase();
}

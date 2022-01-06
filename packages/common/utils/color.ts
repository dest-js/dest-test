type ColorFunction = (text: string) => string

const isColorEnabled = () => !process.env.NO_COLOR
const colorIfAllowed = (colorFN: ColorFunction) => (text: string) =>
  isColorEnabled() ? colorFN(text) : text

export const clc = {
  green: colorIfAllowed((text: string) => `\x1B[32m${text}\x1B[39m`),
  yellow: colorIfAllowed((text: string) => `\x1B[33m${text}\x1B[39m`),
  red: colorIfAllowed((text: string) => `\x1B[31m${text}\x1B[39m`),
  magentaBright: colorIfAllowed((text: string) => `\x1B[95m${text}\x1B[39m`),
  cyanBright: colorIfAllowed((text: string) => `\x1B[96m${text}\x1B[39m`),
}

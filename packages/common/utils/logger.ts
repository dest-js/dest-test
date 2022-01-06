import { clc } from './color'
import {
  LoggerOptions,
  DEFAULT_LOG_LEVELS,
  LoggerLevels,
} from './logger.interface'

// TODO: Add DI Injection Decorator
export class Logger {
  static lastTimestampAt: number

  constructor()
  constructor(context: string)
  constructor(context: string, option: LoggerOptions)
  constructor(private context?: string, private option: LoggerOptions = {}) {
    if (!this.option.levels) {
      this.option.levels = DEFAULT_LOG_LEVELS
    }
  }

  info(message: any): void
  info(message: any, ...optionalParams: any[]): void {
    if (!this.isLevelEnabled('info')) return
    const { messages, context } = this.getContextAndMessageToPrint([
      message,
      ...optionalParams,
    ])
    return this.printToConsole(messages, context, 'info')
  }

  error(message: any)
  error(message: any, ...optionalParams: any[]) {
    if (!this.isLevelEnabled('error')) return
    const { messages, context } = this.getContextAndMessageToPrint([
      message,
      ...optionalParams,
    ])
    return this.printToConsole(messages, context, 'error')
  }

  warn(message: any)
  warn(message: any, ...optionalParams: any[]) {
    if (!this.isLevelEnabled('warn')) return
    const { messages, context } = this.getContextAndMessageToPrint([
      message,
      ...optionalParams,
    ])
    return this.printToConsole(messages, context, 'warn')
  }

  debug(message: any)
  debug(message: any, ...optionalParams: any[]) {
    if (!this.isLevelEnabled('debug')) return
    const { messages, context } = this.getContextAndMessageToPrint([
      message,
      ...optionalParams,
    ])
    return this.printToConsole(messages, context, 'debug')
  }

  verbose(message: any)
  verbose(message: any, ...optionalParams: any[]) {
    if (!this.isLevelEnabled('verbose')) return
    const { messages, context } = this.getContextAndMessageToPrint([
      message,
      ...optionalParams,
    ])
    return this.printToConsole(messages, context, 'verbose')
  }

  /**
   * Set logger's level
   * @param levels log levels
   */
  setLevel(levels: LoggerLevels[]) {
    this.option.levels = levels
  }

  /**
   * Set logger context
   * @param context context
   */
  setContext(context: string) {
    this.context = context
  }

  private isLevelEnabled(level: LoggerLevels) {
    const levels = this.option.levels
    return levels.includes(level)
  }

  private getContextAndMessageToPrint(args: unknown[]) {
    if (args?.length <= 1) return { messages: args, context: this.context }
    const lastElement = args[args.length - 1]
    const isContext = typeof lastElement === 'string'
    if (!isContext) {
      return { messages: args, context: this.context }
    }
    const context = lastElement
    return { messages: args.slice(0, args.length - 1), context }
  }

  protected getTimestamp(): string {
    const localeStringOptions = {
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      day: '2-digit',
      month: '2-digit',
    }
    return new Date(Date.now()).toLocaleString(
      undefined,
      localeStringOptions as Intl.DateTimeFormatOptions
    )
  }

  private updateAndGetTimestampDiff(): string {
    const includeTimestamp = Logger.lastTimestampAt
    const result = includeTimestamp
      ? clc.yellow(` +${Date.now() - Logger.lastTimestampAt}ms`)
      : ''
    Logger.lastTimestampAt = Date.now()
    return result
  }

  private printToConsole(
    messages: unknown[],
    context: string,
    level: LoggerLevels,
    streamType: 'stdout' | 'stderr' = 'stdout'
  ): void {
    const color = this.getColorByLogLevel(level)

    messages.forEach((message) => {
      const output =
        typeof message === 'object'
          ? `${color('Object:')}\n${JSON.stringify(
              message,
              (key, value) =>
                typeof value === 'bigint' ? value.toString() : value,
              2
            )}\n`
          : color(message as string)
      const pidMessage = color(`[DEST] - ${process.pid}`)
      const contextMessage = context ? clc.yellow(`[${context}]`) : ''
      const timestampDiff = this.updateAndGetTimestampDiff()
      const formattedLogLevel = color(level.toUpperCase().padStart(7, ' '))
      const computedMessage = `${pidMessage} ${this.getTimestamp()} ${formattedLogLevel} ${contextMessage} ${output}${timestampDiff}\n`

      process[streamType].write(computedMessage)
    })
  }

  private getColorByLogLevel(level: LoggerLevels) {
    switch (level) {
      case 'debug':
        return clc.magentaBright
      case 'warn':
        return clc.yellow
      case 'error':
        return clc.red
      case 'verbose':
        return clc.cyanBright
      default:
        return clc.green
    }
  }
}

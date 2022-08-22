declare module 'lighthouse' {
  export default function lighthouse(url: string, options: LighthouseOptions): Promise<Result>
}

type LighthouseOptions = {
  logLevel: 'info',
  onlyCategories: [
    'performance'
  ],
  port: number
}

type Result = {
  report: any
}

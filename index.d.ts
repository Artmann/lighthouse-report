declare module 'lighthouse' {
  export default function lighthouse(url: string, options: LighthouseOptions): Promise<Result>

  type LighthouseOptions = {
    logLevel: string,
    onlyCategories: string[],
    port: number
  }
  
  type Result = {
    report: any
  }
}

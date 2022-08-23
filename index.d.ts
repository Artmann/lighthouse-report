declare module 'lighthouse' {
  export default function lighthouse(
    url: string,
    options: LighthouseOptions,
    settings?: any
  ): Promise<Result>

  type LighthouseOptions = {
    logLevel: string,
    onlyCategories: string[],
    port: number
  }

  type Audit = {
    description: string
    displayValue: string
    id: AuditId
    score: number
    scoreDisplayMode: string
    title: string
    numericUnit: string
    numericValue: number
  }

  type AuditId = 'cumulative-layout-shift' | 'first-contentful-paint' | 'first-meaningful-paint' | 'interactive' | 'largest-contentful-paint' | 'speed-index' | 'total-blocking-time'

  type Result = {
    lhr: {
      audits: Record<AuditId, Audit>
      lighthouseVersion: string
      requestedUrl: string
      finalUrl: string
      fetchTime: string

      timing: {
        entries: TimingEnty[]
        total: number
      }
      userAgent: string
    }
  }

  type TimingEnty = {
    duration: number
    entryType: string
    name: string
    startTime: number
  }
}

declare module 'lighthouse/lighthouse-core/config/desktop-config' {
  const config: any

  export default config
}
declare module 'lighthouse/lighthouse-core/config/lr-mobile-config' {
  const config: any

  export default config
}

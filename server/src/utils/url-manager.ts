export class UrlManager {
  private path = "";
  constructor(path: string) {
    this.path = path;
  }
  getStrategyFromPath(): string {
    const pattern: RegExp = /\/(.*?)(?=\/|$)/;
    const match: RegExpMatchArray | null = this.path.match(pattern);
    return match !== null ? match[1] : "";
  }
}

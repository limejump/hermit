export class StructuredLog {
  readonly events: Array<{
    timestamp: Date;
    attributes?: object;
  }>;
  readonly tags: object;
}

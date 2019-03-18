export class StructuredLogDto {
  readonly tags: object;
  readonly events: Array<{
    timestamp: Date | string;
    attributes?: object;
  }>;
}

export class UnstructuredLogDto {
  readonly messages: string[];
  readonly fields?: object;
  readonly tags?: object;
  readonly type?: string;
}

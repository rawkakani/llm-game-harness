/** An error that knows its HTTP status, rendered in OpenAI's error shape. */
export class HttpError extends Error {
  constructor(readonly status: number, message: string, readonly type = "invalid_request_error") {
    super(message);
  }

  toResponse(headers?: HeadersInit): Response {
    return Response.json({ error: { message: this.message, type: this.type } }, { status: this.status, headers });
  }
}

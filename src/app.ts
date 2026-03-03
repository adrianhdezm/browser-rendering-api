import express, { NextFunction, Request, Response } from "express";
import compression from "compression";
import cors from "cors";
import { pinoHttp } from "pino-http";
import { z, ZodError } from "zod";
import { BrowserService } from "./browser.js";
import { logger } from "./logger.js";

class HttpError extends Error {
  public readonly statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = "HttpError";
  }
}

const urlRequestSchema = z.object({ url: z.httpUrl().normalize() });

export function createApp(browserService: BrowserService): express.Express {
  const app = express();
  app.locals.browser = browserService;
  app.disable("x-powered-by");

  app.use(cors());
  app.use(compression());
  app.use(express.json({ limit: "2mb" }));
  app.use(
    pinoHttp({
      logger,
    }),
  );

  app.post(
    "/content",
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const payload = urlRequestSchema.parse(req.body);
        const browser = req.app.locals.browser;
        const result = await browser.getContent(payload.url);

        res.json(result);
      } catch (error) {
        next(error);
      }
    },
  );

  app.post(
    "/screenshot",
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const payload = urlRequestSchema.parse(req.body);
        const browser = req.app.locals.browser;
        const screenshot = await browser.getScreenshot(payload.url);

        res.type("image/png").send(screenshot);
      } catch (error) {
        next(error);
      }
    },
  );

  app.use((req: Request, _res: Response, next: NextFunction) => {
    next(
      new HttpError(404, `Route not found: ${req.method} ${req.originalUrl}`),
    );
  });

  app.use(
    (error: unknown, req: Request, res: Response, _next: NextFunction) => {
      const statusCode =
        error instanceof HttpError
          ? error.statusCode
          : error instanceof ZodError
            ? 400
            : 500;

      const message =
        error instanceof ZodError
          ? (error.issues[0]?.message ?? "Invalid request body.")
          : error instanceof Error
            ? error.message
            : "Internal server error";

      req.log.error({ err: error }, "Unhandled error");
      res.status(statusCode).json({ error: message });
    },
  );

  return app;
}

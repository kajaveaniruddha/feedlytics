import path from "path";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { enqueueFeedback } from "../queues/enqueue";
import type { FeedbackJobData } from "../types/feedback.types";
import { logger } from "../lib/logger";

const PROTO_PATH = path.join(__dirname, "../../proto/feedback_analysis.proto");

export function startFeedbackGrpcServer(port: number): void {
  const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const loaded = grpc.loadPackageDefinition(packageDefinition) as any;
  const ctor = loaded.com.feedlytics.queue.feedback.v1
    .FeedbackAnalysisQueue as grpc.ServiceClientConstructor;

  const server = new grpc.Server();
  server.addService(ctor.service, {
    EnqueueFeedbackAnalysis: (
      call: grpc.ServerUnaryCall<Record<string, unknown>, { accepted: boolean }>,
      cb: grpc.sendUnaryData<{ accepted: boolean }>
    ) => {
      void (async () => {
        try {
          const r = call.request as Record<string, unknown>;
          const job: FeedbackJobData = {
            feedbackId: Number(r.feedback_id),
            content: String(r.content ?? ""),
            workspaceCategoryNames: Array.isArray(r.workspace_category_name)
              ? (r.workspace_category_name as unknown[]).map(String)
              : [],
            callbackBaseUrl: String(r.callback_base_url ?? ""),
            internalAuthToken: String(r.internal_auth_token ?? ""),
            notificationWebhooks: Array.isArray(r.notification_webhooks)
              ? (r.notification_webhooks as { webhook_url?: string }[]).map((w) =>
                  String(w.webhook_url ?? "")
                )
              : [],
            rating: Number(r.rating ?? 0),
            submittedAtEpochMs: Number(r.submitted_at_epoch_ms ?? Date.now()),
          };
          await enqueueFeedback(job);
          cb(null, { accepted: true });
        } catch (err) {
          logger.error({ err: String(err) }, "EnqueueFeedbackAnalysis failed");
          cb(err as grpc.ServiceError, null);
        }
      })();
    },
  });

  server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (error) => {
    if (error) {
      logger.error({ err: String(error) }, "gRPC bind failed");
      throw error;
    }
    server.start();
    logger.info({ port }, "Feedback gRPC server listening");
  });
}

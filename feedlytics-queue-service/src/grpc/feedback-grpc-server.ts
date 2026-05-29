import path from "path";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import {
  enqueueFeedback,
  enqueueInvitationEmail,
  enqueueVerificationEmail,
} from "../queues/enqueue";
import type { FeedbackJobData } from "../types/feedback.types";
import type { InvitationEmailData, VerificationEmailData } from "../types/email.types";
import { logger } from "../lib/logger";

const PROTO_PATHS = [
  path.join(__dirname, "../../proto/feedback_analysis.proto"),
  path.join(__dirname, "../../proto/invitation_email.proto"),
  path.join(__dirname, "../../proto/verification_email.proto"),
];

export function startQueueGrpcServer(port: number): void {
  const packageDefinition = protoLoader.loadSync(PROTO_PATHS, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const loaded = grpc.loadPackageDefinition(packageDefinition) as any;
  const feedbackCtor = loaded.com.feedlytics.queue.feedback.v1
    .FeedbackAnalysisQueue as grpc.ServiceClientConstructor;
  const verificationCtor = loaded.com.feedlytics.queue.email.v1
    .VerificationEmailQueue as grpc.ServiceClientConstructor;
  const invitationCtor = loaded.com.feedlytics.queue.invitation.v1
    .InvitationEmailQueue as grpc.ServiceClientConstructor;

  const server = new grpc.Server();

  server.addService(feedbackCtor.service, {
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

  server.addService(verificationCtor.service, {
    EnqueueVerificationEmail: (
      call: grpc.ServerUnaryCall<Record<string, unknown>, { accepted: boolean }>,
      cb: grpc.sendUnaryData<{ accepted: boolean }>
    ) => {
      void (async () => {
        try {
          const r = call.request as Record<string, unknown>;
          const data: VerificationEmailData = {
            email: String(r.email ?? ""),
            username: String(r.username ?? ""),
            verifyCode: String(r.verify_code ?? ""),
            expiryDate: Number(r.expiry_at_epoch_ms ?? 0),
          };
          await enqueueVerificationEmail(data);
          cb(null, { accepted: true });
        } catch (err) {
          logger.error({ err: String(err) }, "EnqueueVerificationEmail failed");
          cb(err as grpc.ServiceError, null);
        }
      })();
    },
  });

  server.addService(invitationCtor.service, {
    EnqueueInvitationEmail: (
      call: grpc.ServerUnaryCall<Record<string, unknown>, { accepted: boolean }>,
      cb: grpc.sendUnaryData<{ accepted: boolean }>
    ) => {
      void (async () => {
        try {
          const r = call.request as Record<string, unknown>;
          const data: InvitationEmailData = {
            email: String(r.email ?? ""),
            workspaceName: String(r.workspace_name ?? ""),
            inviterName: String(r.inviter_name ?? ""),
            role: String(r.role ?? ""),
            inviteToken: String(r.invite_token ?? ""),
            expiresAtEpochMs: Number(r.expires_at_epoch_ms ?? 0),
          };
          await enqueueInvitationEmail(data);
          cb(null, { accepted: true });
        } catch (err) {
          logger.error({ err: String(err) }, "EnqueueInvitationEmail failed");
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
    logger.info({ port }, "Queue gRPC server listening (feedback + verification + invitation email)");
  });
}

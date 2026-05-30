import { apiClient } from "@/services/api/client";
import { endpoints } from "@/services/api/endpoints";

import type {
  BillingInfoResponseDto,
  CheckoutSessionRequestDto,
  CheckoutSessionResponseDto,
  PortalSessionResponseDto,
} from "@/features/workspace/types/billing.types";

export interface WorkspaceBillingServiceContract {
  getBillingInfo(publicId: string): Promise<BillingInfoResponseDto>;
  createCheckoutSession(publicId: string, input: CheckoutSessionRequestDto): Promise<CheckoutSessionResponseDto>;
  createPortalSession(publicId: string): Promise<PortalSessionResponseDto>;
}

class WorkspaceBillingServiceImpl implements WorkspaceBillingServiceContract {
  async getBillingInfo(publicId: string): Promise<BillingInfoResponseDto> {
    const res = await apiClient.get<BillingInfoResponseDto>(endpoints.billing.info(publicId));
    return res.data;
  }

  async createCheckoutSession(
    publicId: string,
    input: CheckoutSessionRequestDto,
  ): Promise<CheckoutSessionResponseDto> {
    const res = await apiClient.post<CheckoutSessionResponseDto>(
      endpoints.billing.checkoutSession(publicId),
      input,
    );
    return res.data;
  }

  async createPortalSession(publicId: string): Promise<PortalSessionResponseDto> {
    const res = await apiClient.post<PortalSessionResponseDto>(endpoints.billing.portalSession(publicId));
    return res.data;
  }
}

export const workspaceBillingService: WorkspaceBillingServiceContract = new WorkspaceBillingServiceImpl();

import { apiClient } from "@/services/api/client";
import { endpoints } from "@/services/api/endpoints";

export type FeedbackCategoryDto = {
  id: number;
  name: string;
};

export type FeedbackCategoryListDto = {
  categories: FeedbackCategoryDto[];
  maxCategories: number;
};

export interface FeedbackCategoriesServiceContract {
  list(workspacePublicId: string): Promise<FeedbackCategoryListDto>;
  create(workspacePublicId: string, name: string): Promise<FeedbackCategoryDto>;
  update(workspacePublicId: string, categoryId: number, name: string): Promise<FeedbackCategoryDto>;
  delete(workspacePublicId: string, categoryId: number): Promise<void>;
}

class FeedbackCategoriesServiceImpl implements FeedbackCategoriesServiceContract {
  async list(workspacePublicId: string): Promise<FeedbackCategoryListDto> {
    const res = await apiClient.get<FeedbackCategoryListDto>(
      endpoints.feedback.categories(workspacePublicId),
    );
    return res.data;
  }

  async create(workspacePublicId: string, name: string): Promise<FeedbackCategoryDto> {
    const res = await apiClient.post<FeedbackCategoryDto>(endpoints.feedback.categories(workspacePublicId), {
      name,
    });
    return res.data;
  }

  async update(
    workspacePublicId: string,
    categoryId: number,
    name: string,
  ): Promise<FeedbackCategoryDto> {
    const res = await apiClient.put<FeedbackCategoryDto>(
      endpoints.feedback.category(workspacePublicId, categoryId),
      { name },
    );
    return res.data;
  }

  async delete(workspacePublicId: string, categoryId: number): Promise<void> {
    await apiClient.delete(endpoints.feedback.category(workspacePublicId, categoryId));
  }
}

export const feedbackCategoriesService: FeedbackCategoriesServiceContract =
  new FeedbackCategoriesServiceImpl();

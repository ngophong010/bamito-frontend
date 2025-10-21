"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Rating from "@mui/material/Rating";
import { toast } from "react-toastify";
import dayjs from "dayjs";

// 1. Import correct types, services, and hooks
import { useAppSelector } from "@/redux-toolkit/hooks";
import { Feedback } from "@/types";
import { UserProfile } from "@/types/user";
import { feedbackService } from "@/services/feedbackService";
import EditFeedbackModal, { FeedbackFormData } from '@/components/FeedbackModal/FeedbackModal';
import "./DisplayFeedbacks.scss";

const formatDate = (date: string) => dayjs(date).format("DD/MM/YYYY HH:mm:ss");

// Extended Feedback type that includes product information
interface DisplayFeedback extends Feedback {
  user: Pick<UserProfile, 'userName' | 'avatar' | 'id'>;
  product: {
    id: number;
    name: string;
  };
}

interface DisplayFeedbacksProps {
  initialFeedbacks: DisplayFeedback[];
  productId: number; // Used for context and future features
}

const DisplayFeedbacks = ({ initialFeedbacks, productId }: DisplayFeedbacksProps) => {
  const router = useRouter();
  
  // Get the current user's ID from Redux to identify their own reviews
  const currentUserId = useAppSelector((state) => state.user.profile?.id);

  // --- LOCAL UI STATE for the modal ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<DisplayFeedback | null>(null);

  const handleOpenEditModal = (feedback: DisplayFeedback) => {
    setSelectedFeedback(feedback);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // --- ACTION HANDLERS ---
  const handleDelete = async (feedbackId: number) => {
    if (globalThis.confirm("Bạn có chắc chắn muốn xóa đánh giá này?")) {
      try {
        await feedbackService.deleteFeedback(feedbackId);
        toast.success("Xóa đánh giá thành công!");
        router.refresh(); // Re-fetch server data
      } catch (error: any) {
        toast.error(error.message || "Xóa đánh giá thất bại.");
      }
    }
  };

  const handleUpdate = async (formData: FeedbackFormData) => {
    if (!selectedFeedback) return;
    try {
      await feedbackService.updateFeedback(selectedFeedback.id, {
        rating: formData.rating,
        description: formData.description
      });
      toast.success("Cập nhật đánh giá thành công!");
      handleCloseModal();
      router.refresh(); // Re-fetch data
    } catch (error: any) {
      toast.error(error.message || "Cập nhật thất bại.");
    }
  };

  return (
    <div className="feedback-product-container">
      {initialFeedbacks.length > 0 ? (
        initialFeedbacks.map((review) => {
          const isMyReview = review.user.id === currentUserId; // Derive ownership on the fly

          return (
            <div key={review.id} className="review-item">
              <div className="user-info">
                <Image
                  src={review.user.avatar || "/images/default-avatar.png"}
                  alt={review.user.userName}
                  width={60}
                  height={60}
                  className="user-avatar"
                />
                <div className="wrap-user-name">
                  <div className="user-name">{review.user.userName}</div>
                  <div className="timestamp">{formatDate(review.updatedAt)}</div>
                </div>
              </div>
              <Rating name={`rating-${review.id}`} value={review.rating} readOnly />
              <div className="user-comment">{review.description}</div>
              
              {isMyReview && (
                <div className="edit-feedback">
                  <button className="edit-feedback-btn" onClick={() => handleOpenEditModal(review)}>
                    Chỉnh sửa
                  </button>
                  <button className="edit-feedback-btn delete" onClick={() => handleDelete(review.id)}>
                    Xóa
                  </button>
                </div>
              )}
            </div>
          )
        })
      ) : (
        <p>Chưa có đánh giá nào cho sản phẩm này.</p>
      )}

      {/* The Modal is now controlled by this component */}
      {selectedFeedback && (
        <EditFeedbackModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleUpdate}
          productName={selectedFeedback.product.name}
          initialData={{
            rating: selectedFeedback.rating,
            description: selectedFeedback.description || ''
          }}
        />
      )}
    </div>
  );
};

export default DisplayFeedbacks;

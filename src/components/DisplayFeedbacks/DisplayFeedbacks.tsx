"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Rating from "@mui/material/Rating";
import { toast } from "react-toastify";
import dayjs from "dayjs";

// 1. Import correct types, services, and hooks
import { useAppSelector } from "@/redux-toolkit/hooks";
import { Feedback, FeedbackUpdateData } from "@/types";
import { deleteFeedback, updateFeedback } from "@/services/feedbackService";
import EditFeedbackModal from "@/components/EditFeedbackModal/EditFeedbackModal";
import "./DisplayFeedbacks.scss";

const formatDate = (date: string) => dayjs(date).format("DD/MM/YYYY HH:mm:ss");

// 2. Define the props the component now receives
interface DisplayFeedbacksProps {
  initialFeedbacks: Feedback[];
}

const DisplayFeedbacks = ({ initialFeedbacks }: DisplayFeedbacksProps) => {
  const router = useRouter();
  
  // Get the current user's ID from Redux to identify their own reviews
  const currentUserId = useAppSelector((state) => state.user.profile?.id);

  // --- LOCAL UI STATE for the modal ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);

  const handleOpenEditModal = (feedback: Feedback) => {
    setSelectedFeedback(feedback);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFeedback(null);
  };

  // --- ACTION HANDLERS ---
  const handleDelete = async (feedbackId: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa đánh giá này?")) {
      try {
        await deleteFeedback(feedbackId);
        toast.success("Xóa đánh giá thành công!");
        // 3. Use router.refresh() to re-fetch server data
        router.refresh();
      } catch (error: any) {
        toast.error(error.message || "Xóa đánh giá thất bại.");
      }
    }
  };

  const handleUpdate = async (data: FeedbackUpdateData) => {
    if (!selectedFeedback) return;
    try {
      await updateFeedback(selectedFeedback.id, data);
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
            initialData={selectedFeedback}
        />
      )}
    </div>
  );
};

export default DisplayFeedbacks;

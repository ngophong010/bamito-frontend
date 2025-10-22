"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify';
// 1. Import your components, types, and new services
import RatingForm, { RatingFormData } from "@/components/RatingForm/RatingForm";
import FeedbackModal from "@/components/FeedbackModal/FeedbackModal";
import { UnreviewedProduct, FeedbackFormData } from "@/types";
import { feedbackService } from '@/services/feedbackService';
import "./page.scss";
const currencyFormatter = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" });

const FeedbackClient = ({ initialProducts }: { initialProducts: UnreviewedProduct[] }) => {
  const router = useRouter();
  // --- LOCAL UI STATE for the modal ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<UnreviewedProduct | null>(null);
  
  const handleOpenModal = (product: UnreviewedProduct) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCreate = async (formData: FeedbackFormData) => {
        if (!selectedProduct) return;
        
        await feedbackService.createFeedback(selectedProduct.id, {
            orderId: selectedProduct.orderId,
            sizeId: selectedProduct.size.id,
            ...formData,
        });
        toast.success("Gửi đánh giá thành công!");
        handleCloseModal();
        router.refresh();
    };

  // --- ACTION HANDLER for submitting feedback ---
  // This function can be passed to the RatingForm modal
  const handleFeedbackSubmit = async (formData: RatingFormData) => {
    if (!selectedProduct) return;

    try {
      await feedbackService.createFeedback(selectedProduct.id, {
        orderId: selectedProduct.orderId,
        sizeId: selectedProduct.size.id,
        ...formData,
      });
      toast.success("Cảm ơn bạn đã gửi đánh giá!");
      handleCloseModal();
      // 2. Use router.refresh() to re-fetch the server component's data
      // This will automatically update the list of unreviewed products.
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Gửi đánh giá thất bại.");
    }
  };
  return (
    <div className="feedback-container">
      <h1>Sản phẩm chờ đánh giá</h1>
      {initialProducts.length > 0 ? (
        initialProducts.map((product) => (
          <div className="feedback-product" key={`${product.orderId}-${product.id}`}>
            <Image
              src={product.image || '/placeholder.png'}
              width={150}
              height={150}
              alt={product.name}
              className="feedback-product-img"
            />
            <div className="feedback-product-content">
              <div className="product-name">{product.name}</div>
              {/* ... render other product details like price, size, etc. ... */}
            </div>
            <button
              className="feedback-btn"
              onClick={() => handleOpenModal(product)}
            >
              Đánh giá
            </button>
          </div>
        ))
      ) : (
        <div className="no-product">
          <h1>Bạn không có sản phẩm nào để đánh giá.</h1>
        </div>
      )}

      <div>
            {/* ... list of unreviewed products ... */}
            {selectedProduct && (
                <FeedbackModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSubmit={handleCreate}
                    productName={selectedProduct.name}
                    // NO initialData is passed, so it's in CREATE mode
                />
            )}
        </div>

      {/* The Modal is now controlled by this component's state */}
      {selectedProduct && (
        <RatingForm
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleFeedbackSubmit}
          productName={selectedProduct.name}
        />
      )}
    </div>
  );
};
export default FeedbackClient;

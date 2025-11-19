"use client";
import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { toast } from 'react-toastify';
import { DeleteForeverTwoTone } from '@mui/icons-material';
import { addItemToCart, removeItemFromCart } from '@/lib/redux/features/cart/cartSlice';
import { orderService } from '@/services/orderService';
import { createVnPayUrl } from '@/services/paymentService';
import Paypal from '@/components/Paypal/Paypal';
import VoucherSelector from '@/components/VoucherSelector/VoucherSelector';

import { CartData, CartItem, UserProfile, Voucher, ProfileResponse } from '@/types';
import { RootState } from '@/lib/redux/store';

interface CartClientProps {
    initialCartData: CartData;
    initialProfileData: ProfileResponse;
    activeVouchers: Voucher[];
}

const CartClient = ({ initialCartData, initialProfileData, activeVouchers }: CartClientProps) => {
    const router = useRouter();
    const dispatch = useAppDispatch();

    // --- UI STATE MANAGEMENT ---
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);

    // Get live cart data from the Redux store, which will be updated by thunks
    const { items, totalCount } = useAppSelector((state: RootState) => state.cart);
    const { profile } = useAppSelector((state: RootState) => state.user);

    const [isSelectingVoucher, setIsSelectingVoucher] = useState(false);

    // --- DERIVED DATA (Calculations) ---
    const subtotal = useMemo(() =>
        items.reduce((acc: number, item: CartItem) => acc + item.totalPrice, 0),
        [items]);
    const shippingFee = 30000;
    const voucherDiscount = selectedVoucher?.voucherPrice || 0;
    const finalTotal = subtotal + shippingFee - voucherDiscount;

    // --- EVENT HANDLERS ---
    const handleQuantityChange = (productId: string, sizeId: string, newQuantity: number) => {
        // Dispatch a thunk to handle the update. The thunk handles the API call and state sync.
        dispatch(addItemToCart({ productId: Number(productId), size: Number(sizeId), quantity: newQuantity }));
    };

    const handleRemove = (productId: string, sizeId: string) => {
        dispatch(removeItemFromCart({ productId: Number(productId), size: Number(sizeId) }));
    };

    const handlePlaceOrder = async () => {
        // Validation checks
        if (!initialProfileData?.user) {
            toast.error("Vui lòng cập nhật địa chỉ giao hàng trong hồ sơ.");
            return;
        }

        const orderData = {
            payment: paymentMethod,
            deliveryAddress: '', // Use appropriate address field
            voucherId: selectedVoucher?.id,
            cartItems: items.map((p: CartItem) => ({ productId: Number(p.productId), sizeId: Number(p.sizeId), quantity: p.quantity })),
        };

        if (paymentMethod === 'COD' || paymentMethod === 'PAYPAL') {
            try {
                await orderService.createOrder(orderData);
                toast.success('Đặt hàng thành công!');
                router.push('/user/orders');
            } catch (error: any) {
                toast.error(error.message || 'Đặt hàng thất bại.');
            }
        } else if (paymentMethod === 'VNPAY') {
            try {
                const { paymentUrl } = await createVnPayUrl(orderData);
                window.location.href = paymentUrl; // Redirect to VNPAY
            } catch (error: any) {
                toast.error(error.message || "Tạo thanh toán VNPAY thất bại.");
            }
        }
    };

    const handleVoucherSelect = (voucher: Voucher) => {
        setSelectedVoucher(voucher);
        setIsSelectingVoucher(false); // Close the voucher view after selection
    };

    // This is the main render logic
    if (isSelectingVoucher) {
        return (
            <VoucherSelector
                vouchers={activeVouchers}
                onVoucherSelect={handleVoucherSelect}
                onBack={() => setIsSelectingVoucher(false)}
            />
        );
    }

    const handlePaypalSuccess = (details: any) => {
        console.log("Payment successful!", details);
        toast.success(`Payment by ${details.payer.name.given_name} completed.`);
    };

    return (
        <div className="cart-page">
            <h1>Giỏ hàng của bạn</h1>
            <div className="cart-container">
                <div className="cart-list-product">
                    {/* Map over 'items' from Redux store */}
                    {items.map((product: CartItem) => (
                        <div key={`${product.productId}-${product.sizeId}`} className="product-item">
                            {/* ... render product info ... */}
                            <div className="product-action">
                                <button onClick={() => handleRemove(product.productId, product.sizeId)}>
                                    <DeleteForeverTwoTone />
                                </button>
                                <div className="quantity-btn">
                                    <button onClick={() => handleQuantityChange(product.productId, product.sizeId, product.quantity - 1)}>-</button>
                                    <p>{product.quantity}</p>
                                    <button onClick={() => handleQuantityChange(product.productId, product.sizeId, product.quantity + 1)}>+</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="cart-order">
                    <div className="payment">
                        {paymentMethod === "PAYPAL" && (
                            <Paypal
                                // Pass amount as a string with two decimal places
                                amount={finalTotal.toFixed(2)}
                                currency="USD" // PayPal requires specific currency codes
                                onPaymentSuccess={handlePaypalSuccess}
                            />
                        )}
                    </div>
                    {/* ... render user info from 'profile' from Redux store ... */}
                    {/* ... render payment summary using 'subtotal', 'shippingFee', 'voucherDiscount', 'finalTotal' ... */}
                    {/* ... render payment method radio buttons that set 'paymentMethod' ... */}
                    <button className="order-btn" onClick={handlePlaceOrder}>Đặt hàng</button>
                </div>
            </div>
        </div>
    );
};

export default CartClient;

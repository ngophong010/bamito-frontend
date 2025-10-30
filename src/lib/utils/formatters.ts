import dayjs from 'dayjs';
import "dayjs/locale/vi";

dayjs.locale("vi");

export const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

export const formatISODate = (input: string | Date): string => {
  const date = dayjs(input);

  if (!date.isValid()) {
    throw new Error("Invalid date input for formatISODate");
  }

  return date.format("dddd, DD-MM-YYYY");
};

export const getRemainingTimeMessage = (endTime: string | Date): string => {
  const end = dayjs(endTime);
  const now = dayjs();
  const hoursRemaining = end.diff(now, 'hour');

  if (hoursRemaining <= 0) {
    return "Đã hết hạn";
  } else if (hoursRemaining > 24) {
    const days = Math.ceil(hoursRemaining / 24);
    return `Hết hạn trong ${days} ngày`;
  } else {
    return `Hết hạn trong ${hoursRemaining} giờ`;
  }
};

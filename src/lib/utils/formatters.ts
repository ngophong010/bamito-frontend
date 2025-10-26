import dayjs from 'dayjs';

export const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

export const formatISODate = (isoString: string | Date): string => {
  const date = new Date(isoString);
  const daysOfWeek = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
  const dayOfWeek = daysOfWeek[date.getDay()];
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return dayjs(isoString).format("dddd, DD-MM-YYYY");
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

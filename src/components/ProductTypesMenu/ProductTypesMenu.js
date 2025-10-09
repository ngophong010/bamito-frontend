import React from "react";
import { createSlug } from "@/utils/formatters";
import Link from "next/link";
import "./CategoriesMenu.scss";

const CategoriesMenu = ({ categories = [], onCategoryClick }) => {
    return (
        <ul className="product-types-list">
            {categories.map((item) => (
                <li
                    key={item.categoryId}
                    className="product-type-item"
                    onClick={() => onCategoryClick(item.categoryId, item.categoryName)}
                >
                    <Link href={`/${createSlug(item.categoryName)}-${item.categoryId.toLowerCase()}`} onClick={() => oncategoryClick()}>
                        {item.categoryName}
                    </Link>
                </li>
            ))}
        </ul>
    );
};

export default categoriesMenu;
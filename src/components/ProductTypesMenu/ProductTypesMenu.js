import React from "react";
import { createSlug } from "@/utils/formatters";
import Link from "next/link";
import "./ProductTypesMenu.scss";

const ProductTypesMenu = ({ productTypes = [], onProductTypeClick }) => {
    return (
        <ul className="product-types-list">
            {productTypes.map((item) => (
                <li
                    key={item.productTypeId}
                    className="product-type-item"
                    onClick={() => onProductTypeClick(item.productTypeId, item.productTypeName)}
                >
                    <Link href={`/${createSlug(item.productTypeName)}-${item.productTypeId.toLowerCase()}`} onClick={() => onProductTypeClick()}>
                        {item.productTypeName}
                    </Link>
                </li>
            ))}
        </ul>
    );
};

export default ProductTypesMenu;
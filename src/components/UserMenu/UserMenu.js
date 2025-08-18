"use client";
import React, {useMemo} from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import Link from "next/link";
import { handleChangePage } from "../../redux-toolkit/paginationSlice";
import "./UserMenu.scss";

const UserMenu = ({ attrs, handleLogOut, menu = [], roleId }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const visibleMenuItems = useMemo(() => {
    if (roleId === "R1") {
      return menu;
    } else if (roleId === "R2") {
      return menu.filter(item => item.type !== "ADMIN");
    }
    return [];
  }, [menu, roleId]);

  const handleClickItem = (item) => {
    if (item.type === "LOGOUT") {
      handleLogOut();
      return;
    }

    if (item.to) {
      dispatch(handleChangePage(1));
      router.push(item.to);
    }
  };

  return (
    <div className="user-menu-container" tabIndex="-1" {...attrs}>
      {/* {menu.map((item, index) => {
        let line = false;
        if (index === menu.length - 1) {
          line = true;
        }
        if (item.type && item.type === "LOGOUT") {
          return (
            <div key={index}>
              {line && (
                <hr
                  style={{
                    height: 1,
                  }}
                />
              )}
              <div className="userMenuItem" onClick={handleLogOut}>
                <item.icon className="icon" />
                <p className="text">{item.text}</p>
              </div>
            </div>
          );
        } else if (roleId === "R1") {
          return (
            <div key={index}>
              {line && (
                <hr
                  style={{
                    height: 1,
                  }}
                />
              )}
              <div
                onClick={() => handleClickItem(item.to)}
                className="userMenuItem"
              >
                <item.icon className="icon" />
                <p className="text">{item.text}</p>
              </div>
            </div>
          );
        } else if (item.type !== "ADMIN" && roleId === "R2") {
          return (
            <div key={index}>
              {line && (
                <hr
                  style={{
                    height: 1,
                  }}
                />
              )}
              <div
                onClick={() => handleClickItem(item.to)}
                className="userMenuItem"
              >
                <item.icon className="icon" />
                <p className="text">{item.text}</p>
              </div>
            </div>
          );
        }
      })} */}
      {visibleMenuItems.map((item, index) => {
        const isLastItem = index === visibleMenuItems.length - 1;

        // Use a button for accessibility and semantic correctness
        return (
          <button
            key={item.text || index} // Use a more stable key if available, like item.to or item.id
            className="userMenuItem"
            onClick={() => handleClickItem(item)}
          >
            {/* Render the separator for the last item */}
            {isLastItem && <hr className="menu-separator" />}
            
            <item.icon className="icon" />
            <p className="text">{item.text}</p>
          </button>
        );
      })}
    </div>
  );
};

export default UserMenu;

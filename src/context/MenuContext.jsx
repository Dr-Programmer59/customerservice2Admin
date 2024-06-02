"use client";
import { createContext, useState } from "react";
import { useDispatch, useSelector } from 'react-redux'

export const MenuContext = createContext();

const MenuContextProvider = ({ children }) => {
   const [open, setOpen] = useState(false);

   const toggle = () => {
      console.log({ open });
      setOpen((prev) => !prev);
   };

   return <MenuContext.Provider value={{ open, toggle }}>{children}</MenuContext.Provider>;
};

export default MenuContextProvider;

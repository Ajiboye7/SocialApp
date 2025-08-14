import React, { Children } from 'react';
 interface ButtonProps{
    children: string;
    onclick: () => void
}

const Button = ({children, onclick }:ButtonProps) => {
  return (
    <button
    onClick={onclick}
 className="px-4 py-2 bg-primary-500 text-white font-semibold rounded w-full hover:bg-dark-2"
    >
        {children}
    </button>
  );
}

export default Button;



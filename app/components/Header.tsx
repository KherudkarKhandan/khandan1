import React from 'react'

interface HeaderProps {
  children: React.ReactNode
}

const Header: React.FC<HeaderProps> = ({ children }) => {
  return (
    <header className="bg-white/10 backdrop-blur-md shadow-md dark:bg-gray-800/30">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white dark:text-gray-100">Family Tree Explorer</h1>
        <div className="flex items-center space-x-4">
          {children}
        </div>
      </div>
    </header>
  )
}

export default Header


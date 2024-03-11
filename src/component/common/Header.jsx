import React from 'react'

const Header = ({ title }) => {
  return (
    <header className="header">
        <div className="overlay">
            <div className="container">
                <div className="header-title text-center">{title}</div>
            </div>
        </div>
    </header>
  )
}

export default Header
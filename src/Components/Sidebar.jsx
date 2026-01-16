import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ArrowDownToLine,
  ArrowUpFromLine,
  Archive,
  History,
  LogOut,
  ChevronDown,
  Menu,
  X,
  AlertTriangle
} from 'lucide-react';
import '../assets/styles/Sidebar.css';

function Sidebar({ user, onLogout }) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState({});

  const toggleMenu = (menuName) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
  };

  const isActive = (path) => {
    return location.pathname.includes(path);
  };

  const menuItems = [
    {
      name: 'Tổng Quan',
      path: '/dashboard/overview',
      icon: LayoutDashboard,
      color: '#667eea'
    },
    {
      name: 'Sản Phẩm',
      path: '/dashboard/products',
      icon: Package,
      color: '#f59e0b'
    },
    {
      name: 'Xuất Hàng',
      path: '/dashboard/export',
      icon: ArrowUpFromLine,
      color: '#ef4444'
    },
    {
      name: 'Nhập Hàng',
      path: '/dashboard/import',
      icon: ArrowDownToLine,
      color: '#3b82f6'
    },
    {
      name: 'Điều Chỉnh Kho',
      path: '/dashboard/adjust',
      icon: AlertTriangle,
      color: '#ec4899'
    },
    {
      name: 'Kho Hàng',
      path: '/dashboard/inventory',
      icon: Archive,
      color: '#10b981'
    },
    {
      name: 'Lịch Sử',
      path: '/dashboard/history',
      icon: History,
      color: '#8b5cf6'
    }
  ];

  return (
    <>
      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="logo-icon">📦</span>
            {isOpen && <span className="logo-text">Kho Hàng</span>}
          </div>
          <button
            className="toggle-btn"
            onClick={() => setIsOpen(!isOpen)}
            title={isOpen ? 'Đóng menu' : 'Mở menu'}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
              title={!isOpen ? item.name : ''}
            >
              <item.icon size={20} color={item.color} style={{minWidth: '20px'}} />
              {isOpen && (
                <>
                  <span className="nav-label">{item.name}</span>
                  {isActive(item.path) && <div className="active-indicator"></div>}
                </>
              )}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          {isOpen && (
            <div className="user-info">
              <div className="user-avatar">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="user-details">
                <p className="user-name">{user?.username || 'User'}</p>
                <p className="user-status">Quản lý kho</p>
              </div>
            </div>
          )}
          <button className="logout-btn" onClick={onLogout} title="Đăng xuất">
            <LogOut size={20} />
            {isOpen && <span>Đăng xuất</span>}
          </button>
        </div>
      </aside>

      {/* Overlay mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />}
    </>
  );
}

export default Sidebar;

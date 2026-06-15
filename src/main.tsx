import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ConfigProvider, App as AntdApp } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import 'dayjs/locale/zh-cn';
import App from './App';
import './index.css';

const goldTheme = {
  token: {
    colorPrimary: '#D4A574',
    colorInfo: '#D4A574',
    colorSuccess: '#10B981',
    colorWarning: '#F59E0B',
    colorError: '#EF4444',
    colorText: '#F3F4F6',
    colorTextSecondary: '#9CA3AF',
    colorBgBase: '#0B1220',
    colorBgContainer: '#1E293B',
    colorBgElevated: '#111827',
    colorBgLayout: '#0B1220',
    colorBorder: '#334155',
    colorBorderSecondary: '#475569',
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusXS: 4,
    borderRadiusSM: 6,
    fontFamily:
      '"Noto Sans SC", "PingFang SC", "Microsoft YaHei", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
    fontSize: 14,
    fontSizeLG: 16,
    fontSizeXL: 18,
    controlHeight: 36,
    controlHeightLG: 44,
    controlHeightSM: 28,
  },
  components: {
    Button: {
      primaryShadow: '0 2px 8px rgba(212, 165, 116, 0.3)',
      defaultBg: 'rgba(30, 41, 59, 0.6)',
      defaultBorderColor: '#334155',
      defaultColor: '#F3F4F6',
      defaultHoverBg: 'rgba(212, 165, 116, 0.05)',
      defaultHoverBorderColor: '#D4A574',
      defaultHoverColor: '#D4A574',
      defaultActiveBg: 'rgba(212, 165, 116, 0.1)',
      defaultActiveBorderColor: '#D4A574',
      defaultActiveColor: '#D4A574',
      linkColor: '#D4A574',
      linkHoverColor: '#FBBF24',
      linkActiveColor: '#B8860B',
    },
    Card: {
      borderRadiusLG: 12,
      headerBg: 'transparent',
    },
    Input: {
      colorBgContainer: 'rgba(30, 41, 59, 0.6)',
      colorBorder: '#334155',
      hoverBorderColor: 'rgba(212, 165, 116, 0.5)',
      activeBorderColor: '#D4A574',
      activeShadow: '0 0 0 2px rgba(212, 165, 116, 0.15)',
      colorTextPlaceholder: '#6B7280',
      colorText: '#F3F4F6',
    },
    Select: {
      colorBgContainer: 'rgba(30, 41, 59, 0.6)',
      colorBorder: '#334155',
      hoverBorderColor: 'rgba(212, 165, 116, 0.5)',
      activeBorderColor: '#D4A574',
      activeShadow: '0 0 0 2px rgba(212, 165, 116, 0.15)',
      optionSelectedBg: 'rgba(212, 165, 116, 0.15)',
      optionSelectedColor: '#D4A574',
      optionActiveBg: 'rgba(212, 165, 116, 0.08)',
      colorText: '#F3F4F6',
      colorTextPlaceholder: '#6B7280',
    },
    Table: {
      colorBgContainer: 'transparent',
      colorBgElevated: '#111827',
      colorBorderSecondary: 'rgba(51, 65, 85, 0.5)',
      headerBg: 'rgba(30, 41, 59, 0.6)',
      headerColor: '#9CA3AF',
      rowHoverBg: 'rgba(212, 165, 116, 0.05)',
      colorText: '#F3F4F6',
    },
    Menu: {
      itemBg: 'transparent',
      itemHoverBg: 'rgba(212, 165, 116, 0.08)',
      itemHoverColor: '#D4A574',
      itemSelectedBg:
        'linear-gradient(135deg, rgba(212,165,116,0.2), rgba(184,134,11,0.1))',
      itemSelectedColor: '#D4A574',
      itemColor: '#9CA3AF',
      subMenuItemBg: 'transparent',
    },
    Tag: {
      borderRadiusSM: 6,
      defaultBg: 'rgba(107, 114, 128, 0.15)',
      defaultColor: '#9CA3AF',
    },
    Pagination: {
      itemBg: 'rgba(30, 41, 59, 0.6)',
      itemBorderColor: '#334155',
      itemColor: '#9CA3AF',
      itemActiveBg: 'linear-gradient(135deg, #D4A574, #B8860B)',
      itemActiveColor: '#1F2937',
      itemHoverBorderColor: '#D4A574',
      itemHoverColor: '#D4A574',
    },
    Drawer: {
      colorBgElevated: '#0B1220',
    },
    Dropdown: {
      colorBgElevated: '#111827',
      colorBorder: '#334155',
    },
    Modal: {
      contentBg: '#111827',
      headerBg: 'transparent',
      footerBg: 'transparent',
      borderColor: '#334155',
      titleColor: '#F3F4F6',
    },
    Descriptions: {
      colorBgContainer: 'transparent',
      labelBg: 'transparent',
      colorTextLabel: '#9CA3AF',
      colorText: '#F3F4F6',
      colorBorder: '#334155',
    },
    Statistic: {},
    Timeline: {
      tailColor: '#334155',
    },
    Upload: {
      actionsColor: '#D4A574',
    },
    Divider: {
      colorSplit: '#334155',
      textColor: '#9CA3AF',
    },
    Badge: {
      colorError: '#EF4444',
    },
    Result: {
      titleFontSize: 24,
      titleColor: '#F3F4F6',
      subtitleColor: '#9CA3AF',
    },
    Breadcrumb: {
      linkColor: '#9CA3AF',
      lastItemColor: '#F3F4F6',
      separatorColor: '#6B7280',
    },
    Tooltip: {
      colorBgSpotlight: '#111827',
      colorBorder: '#334155',
    },
    Popover: {
      colorBgElevated: '#111827',
      colorBorder: '#334155',
    },
    Avatar: {
      colorBgBase: 'rgba(212, 165, 116, 0.2)',
    },
    Empty: {
      colorBgContainer: 'transparent',
    },
    Progress: {
      defaultColor: '#D4A574',
    },
    List: {
      colorBorderSplit: '#334155',
      colorText: '#F3F4F6',
    },
  },
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider locale={zhCN} theme={goldTheme}>
      <AntdApp>
        <App />
      </AntdApp>
    </ConfigProvider>
  </StrictMode>
);

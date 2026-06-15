import React from 'react';
import { Result, Button, Typography } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: '#0B1220' }}
    >
      <div className="text-center">
        <Result
          status="404"
          title={
            <div>
              <div
                style={{
                  fontSize: 120,
                  fontWeight: 'bold',
                  lineHeight: 1,
                  background: 'linear-gradient(135deg, #D4A574 0%, #FBBF24 50%, #D4A574 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: 12,
                }}
              >
                404
              </div>
              <div
                style={{
                  color: '#F3F4F6',
                  fontSize: 22,
                  marginTop: 12,
                  fontWeight: 500,
                }}
              >
                您访问的页面不存在
              </div>
            </div>
          }
          subTitle={
            <Text type="secondary" style={{ fontSize: 14 }}>
              抱歉，您输入的地址有误，或该页面已被暂时移除。
              <br />
              请检查网址是否正确，或返回首页继续浏览。
            </Text>
          }
          extra={
            <div className="space-x-4 mt-6">
              <Button
                type="primary"
                size="large"
                icon={<HomeOutlined />}
                onClick={() => navigate('/dashboard')}
                style={{
                  background: 'linear-gradient(135deg, #D4A574 0%, #B8860B 100%)',
                  border: 'none',
                  minWidth: 160,
                }}
              >
                返回首页
              </Button>
              <Button
                size="large"
                onClick={() => navigate(-1)}
                style={{
                  borderColor: '#D4A574',
                  color: '#D4A574',
                  minWidth: 140,
                }}
              >
                返回上一页
              </Button>
            </div>
          }
          style={{
            background: 'transparent',
          }}
        />
        <div
          style={{
            marginTop: 40,
            padding: '16px 24px',
            borderTop: '1px solid rgba(212, 165, 116, 0.2)',
            display: 'inline-block',
          }}
        >
          <Text type="secondary" style={{ fontSize: 12 }}>
            全国酒类生产与流通智能监测分析平台 · 技术支持 V1.0.0
          </Text>
        </div>
      </div>
    </div>
  );
}

import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Result
      status="404"
      title="404"
      subTitle="Извините, страница не найдена."
      extra={
        <Button type="primary" onClick={() => navigate('/')} shape="round">
          На главную
        </Button>
      }
      style={{ background: 'transparent', padding: '60px 0' }}
    />
  );
};

export default NotFoundPage;
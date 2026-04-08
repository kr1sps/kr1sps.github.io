import { jsx as _jsx } from "react/jsx-runtime";
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
const NotFoundPage = () => {
    const navigate = useNavigate();
    return (_jsx(Result.PRESENTED_IMAGE_404, { status: "404", title: "404", subTitle: "\u0418\u0437\u0432\u0438\u043D\u0438\u0442\u0435, \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0430 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u0430.", extra: _jsx(Button, { type: "primary", onClick: () => navigate('/'), children: "\u041D\u0430 \u0433\u043B\u0430\u0432\u043D\u0443\u044E" }) }));
};
export default NotFoundPage;

import { Form, Input, Select, Button, Card, Row, Col } from "antd";

const LeftProfile = () => {
  const [form] = Form.useForm();

  const initialValues = {
    firstName: "Thái Kim",
    lastName: "Quý",
    birthday: "15/07/2003",
    gender: "male",
    email: "qalc2003@gmail.com",
    phone: "0339310536",
    address: "Hà Đông",
    city: "Hà Nội",
  };

  const onFinish = (values) => {
    console.log("Giá trị biểu mẫu:", values);
  };

  return (
    <Card>
      <h2 style={{ marginBottom: 24 }}>Thông tin chung</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={initialValues}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="firstName"
              label="Họ và tên đệm"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập tên của bạn",
                },
              ]}
            >
              <Input placeholder="Nhập tên của bạn" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="lastName"
              label="Tên"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập họ của bạn",
                },
              ]}
            >
              <Input placeholder="Nhập họ của bạn" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="birthday" label="Ngày sinh">
              <Input placeholder="dd/mm/yyyy" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="gender" label="Giới tính">
              <Select placeholder="Giới tính">
                <Select.Option value="male">Nam</Select.Option>
                <Select.Option value="female">Nữ</Select.Option>
                <Select.Option value="other">Khác</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập email của bạn",
                },
                { type: "email", message: "Vui lòng nhập email hợp lệ" },
              ]}
            >
              <Input placeholder="ten@congty.com" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="phone" label="Số điện thoại">
              <Input placeholder="+84 123 456 789" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item name="address" label="Địa chỉ">
              <Input placeholder="Nhập địa chỉ nhà của bạn" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item name="city" label="Thành phố">
              <Input placeholder="Thành phố" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: "120px" }}>
            Lưu tất cả
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default LeftProfile;

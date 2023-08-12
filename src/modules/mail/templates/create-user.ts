export function MailCreateUserTemplate(name: string, email: string, password: string) {
  return {
    to: [email],
    cc: null,
    subject: 'Tạo tài khoản',
    html: `
            <div style="width: 680px">
              <p style="margin-bottom: 16px; line-height: 22px">
                Xin chào ${name}! <br />
              </p>
              <p style="margin-bottom: 16px; line-height: 22px">
                Bạn đã tạo thành công tài khoản sử dụng phầm mềm!<br />
                Email: <b>${email}</b><br />
                Password: <b>${password}</b><br />
              </p>
              <p style="margin-bottom: 16px; line-height: 22px">
                Đăng nhập để sử dụng phần mềm miễn phí
              </p>
            </div>
        `,
  };
}
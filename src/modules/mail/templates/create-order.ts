import { ISendMailOptions } from "@nestjs-modules/mailer";
import { CreateOrderDto } from "../../../dto/order.dto";

export async function MailCreateOrderTemplate(name: string, email: string, createOrderDto: CreateOrderDto): Promise<ISendMailOptions> {

  return {
    to: email,
    subject: 'Mua hàng',
    html: `
      <div style="width: 680px">
        <p style="margin-bottom: 16px; line-height: 22px">
          Xin chào ${name}! <br />
        </p>
        <p style="margin-bottom: 16px; line-height: 22px">
         Bạn đã mua 1 đơn hàng có giá trị ${createOrderDto.totalAmount}. Vui lòng chờ nhà cung cấp xác nhận
         </p>
         <p style="margin-bottom: 16px; line-height: 22px">
         Đăng nhập để xem chi tiết
        </p>
      </div>
    `,
  };
}
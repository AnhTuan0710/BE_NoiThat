import { ISendMailOptions } from "@nestjs-modules/mailer";
import { CreateOrderDto } from "../../../dto/order.dto";

export async function MailCreateOrderTemplate(name: string, email: string, createOrderDto: CreateOrderDto): Promise<ISendMailOptions> {

  return {
    to: email,
    subject: 'Đơn hàng mới',
    html: `
      <div style="width: 680px">
        <p style="margin-bottom: 16px; line-height: 22px">
         Khách hàng: ${createOrderDto.name},  SĐT: ${createOrderDto.phone_no} ,Địa chỉ: ${createOrderDto.address} đã đăt 1 đơn hàng với giá trị : ${createOrderDto.total_amount}.
         </p>
         <p style="margin-bottom: 16px; line-height: 22px">
         Vui lòng xác nhận đơn hàng
        </p>
      </div>
    `,
  };
}
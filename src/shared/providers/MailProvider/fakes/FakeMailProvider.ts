import IMailProvider from '../models/IMailprovider';
import ISendMailDTO from '../dtos/ISendMailDTO';

export default class FakeMailProvider implements IMailProvider {
  private messages: ISendMailDTO[] = [];

  public async sendMail(mail: ISendMailDTO): Promise<void> {
    this.messages.push(mail);
  }
}

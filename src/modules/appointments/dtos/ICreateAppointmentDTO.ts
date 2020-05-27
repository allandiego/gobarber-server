/**
 * DTO (Data Transfer Object) describe the format of the object
 */

export default interface ICreateAppointmentDTO {
  provider_id: string;
  client_id: string;
  date: Date;
}

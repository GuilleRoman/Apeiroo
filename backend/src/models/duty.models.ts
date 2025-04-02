export interface Duty {
    id: number;
    name: string;
    created_at?: Date;
    updated_at?: Date;
  }
  
export interface CreateDutyDto {
name: string;
}
  
export interface UpdateDutyDto {
name: string;
}